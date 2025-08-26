// KENDO Assets GraphQL API Service
const ASSETS_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * Build Assets GraphQL query using getAssetsByMetadata
 * @param {Object} filters - Filter conditions
 * @param {Array<string|number>} filters.ids - Array of asset IDs to fetch specific assets
 * @param {string} filters.filename - Filter by filename (partial match)
 * @param {string} filters['folder-path'] - Filter by folder path
 * @param {string} filters['model-number'] - Filter by product model number
 * @param {Array<string>} filters['media-type'] - Filter by media types
 * @param {Array<string>} filters['media-category'] - Filter by Media Category metadata (支持多选)
 * @param {string} filters.brand - Brand path filter (子品牌主题切换)
 * @param {string} filters['creation-date-from'] - Filter by creation date from (YYYY-MM-DD)
 * @param {string} filters['creation-date-to'] - Filter by creation date to (YYYY-MM-DD)
 * @param {number} first - Number of items to fetch
 * @param {number} offset - Offset for pagination
 * @returns {string} GraphQL query string
 */
const buildAssetsQuery = (filters = {}, first = 20, offset = 0) => {
    // Build query parameters for getAssetsByMetadata
    const queryParams = [];

    // Pagination parameters
    queryParams.push(`first: ${first}`);
    if (offset > 0) {
        queryParams.push(`offset: ${offset}`);
    }

    // Brand/Path filtering (子品牌主题切换)
    let pathStartsWith = null;
    if (filters.brand) {
        pathStartsWith = `/${filters.brand.toUpperCase()}/`;
    } else {
        // Default to KENDO if no brand specified
        pathStartsWith = "/KENDO/";
    }
    queryParams.push(`pathStartsWith: "${pathStartsWith}"`);

    // Build metadata filters array
    const metadataFilters = [];

    // Media Category metadata filter (支持多选)
    if (filters['media-category'] && Array.isArray(filters['media-category']) && filters['media-category'].length > 0) {
        metadataFilters.push({
            name: "Media Type",
            values: filters['media-category'],
            operator: "IN"
        });
    }

    // Add metadata filters to query if any exist
    if (metadataFilters.length > 0) {
        // 构建正确的 GraphQL 语法，而不是转义的 JSON 字符串
        const metadataFiltersGraphQL = metadataFilters.map(filter => {
            const valuesStr = filter.values.map(v => `"${v}"`).join(', ');
            return `{ name: "${filter.name}", values: [${valuesStr}], operator: "${filter.operator}" }`;
        }).join(', ');

        queryParams.push(`metadataFilters: [${metadataFiltersGraphQL}]`);
        queryParams.push(`metadataLogic: "AND"`);
    }

    // Build MongoDB-style filter for other conditions
    const mongoFilters = [];

    // Filter by specific IDs if provided
    if (filters.ids && Array.isArray(filters.ids) && filters.ids.length > 0) {
        const idConditions = filters.ids.map(id => String(id));
        mongoFilters.push({ id: { "$in": idConditions } });
    } else {
        // Basic filtering - ensure assets have a mimetype (only when not filtering by IDs)
        mongoFilters.push({ mimetype: { "$not": "" } });
    }

    // Filter by filename
    if (filters.filename) {
        mongoFilters.push({ filename: { "$like": `%${filters.filename}%` } });
    }

    // Filter by folder path (additional path filtering beyond pathStartsWith)
    if (filters['folder-path']) {
        mongoFilters.push({ fullpath: { "$like": `%${filters['folder-path']}%` } });
    }

    // Filter by product model number (through path matching)
    if (filters['model-number']) {
        mongoFilters.push({ fullpath: { "$like": `%${filters['model-number']}%` } });
    }

    // Filter by MIME type (example: 'Images', 'Videos', 'Documents')
    if (filters['media-type'] && filters['media-type'].length > 0) {
        const mimeTypeConditions = filters['media-type'].map(type => {
            if (type === 'Images') return "image/%";
            if (type === 'Videos') return "video/%";
            if (type === 'Documents') return "application/%";
            if (type === 'Audio') return "audio/%";
            // Compatibility with old format
            if (type === 'image') return "image/%";
            if (type === 'video') return "video/%";
            if (type === 'document') return "application/%";
            return null;
        }).filter(pattern => pattern !== null);

        if (mimeTypeConditions.length > 0) {
            if (mimeTypeConditions.length === 1) {
                mongoFilters.push({ mimetype: { "$like": mimeTypeConditions[0] } });
            } else {
                const typeConditions = mimeTypeConditions.map(pattern => ({ mimetype: { "$like": pattern } }));
                mongoFilters.push({ "$or": typeConditions });
            }
        }
    }

    // Filter by creation date range (convert date strings to Unix timestamps)
    if (filters['creation-date-from'] || filters['creation-date-to']) {
        const dateConditions = {};

        if (filters['creation-date-from']) {
            // Convert YYYY-MM-DD to Unix timestamp (seconds)
            const fromTimestamp = Math.floor(new Date(filters['creation-date-from']).getTime() / 1000);
            dateConditions["$gte"] = fromTimestamp;
        }

        if (filters['creation-date-to']) {
            // Convert YYYY-MM-DD to Unix timestamp (seconds) + end of day
            const toDate = new Date(filters['creation-date-to']);
            toDate.setHours(23, 59, 59, 999); // End of day
            const toTimestamp = Math.floor(toDate.getTime() / 1000);
            dateConditions["$lte"] = toTimestamp;
        }

        if (Object.keys(dateConditions).length > 0) {
            mongoFilters.push({ creationDate: dateConditions });
        }
    }

    // Compatibility with old predefined date options
    if (filters['creation-date'] && filters['creation-date'] !== 'all') {
        const now = new Date();
        let fromDate;

        switch (filters['creation-date']) {
            case 'last_2_weeks':
                fromDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            case 'last_1_month':
                fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'last_3_months':
                fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'last_1_year':
                fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
        }

        if (fromDate) {
            // Convert to Unix timestamp (seconds)
            const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
            mongoFilters.push({
                creationDate: { "$gte": fromTimestamp }
            });
        }
    }

    // Build final MongoDB filter
    let mongoFilter = null;
    if (mongoFilters.length > 1) {
        mongoFilter = { "$and": mongoFilters };
    } else if (mongoFilters.length === 1) {
        mongoFilter = mongoFilters[0];
    }

    // Add MongoDB filter to query if exists
    if (mongoFilter) {
        const filterString = JSON.stringify(mongoFilter).replace(/"/g, '\\"');
        queryParams.push(`filter: "${filterString}"`);
    }

    // 构建最终查询字符串
    const finalQuery = `{
    getAssetsByMetadata(${queryParams.join(', ')}) {
      totalCount
      edges {
        cursor
        node {
          id
          fullpath
          assetThumb: fullpath(thumbnail: "content", format: "webp")
          type
          filename            
          mimetype
          filesize
          creationDate
          modificationDate
          parent {
            __typename
          }
          metadata {
            name
            type
            data
          }
        }
      }
    }
  }`;

    // Log filter conditions (for debugging)
    console.log('🔍 Assets getAssetsByMetadata Query Parameters:', {
        rawFilters: filters,
        pathStartsWith: pathStartsWith,
        metadataFilters: metadataFilters,
        mongoFilter: mongoFilter,
        queryParams: queryParams,
        dateFilters: {
            hasDateRange: !!(filters['creation-date-from'] || filters['creation-date-to']),
            fromDate: filters['creation-date-from'],
            toDate: filters['creation-date-to'],
            quickFilter: filters['creation-date'],
            // Show timestamp conversions for debugging
            fromTimestamp: filters['creation-date-from'] ? Math.floor(new Date(filters['creation-date-from']).getTime() / 1000) : null,
            toTimestamp: filters['creation-date-to'] ? (() => {
                const toDate = new Date(filters['creation-date-to']);
                toDate.setHours(23, 59, 59, 999);
                return Math.floor(toDate.getTime() / 1000);
            })() : null
        }
    });

    // Log the complete GraphQL query for debugging
    console.log('📝 Complete GraphQL Query:', finalQuery);

    return finalQuery;
};

/**
 * Call KENDO Assets GraphQL API using getAssetsByMetadata
 * @param {Object} params - Query parameters
 * @param {Array<string|number>} params.ids - Array of asset IDs to fetch specific assets
 * @param {string} params.filename - Filter by filename (partial match)
 * @param {string} params['folder-path'] - Filter by folder path
 * @param {string} params['model-number'] - Filter by product model number
 * @param {Array<string>} params['media-type'] - Filter by media types (Images, Videos, Documents, Audio)
 * @param {Array<string>} params['media-category'] - Filter by Media Category metadata (支持多选：Icons, Logos, Main等)
 * @param {string} params.brand - Brand for path filtering (子品牌主题切换，默认为KENDO)
 * @param {string} params['creation-date-from'] - Filter by creation date from (YYYY-MM-DD)
 * @param {string} params['creation-date-to'] - Filter by creation date to (YYYY-MM-DD)
 * @param {number} params.limit - Number of items to fetch (default: 20)
 * @param {number} params.offset - Offset for pagination (default: 0)
 * @returns {Promise<Object>} Assets data
 */
export const fetchKendoAssets = async (params = {}) => {
    try {
        const { limit = 20, offset = 0, ids } = params;

        // Log IDs parameter for debugging
        if (ids && Array.isArray(ids)) {
            console.log('🔍 Fetching KENDO assets by IDs:', ids);
        }

        const query = buildAssetsQuery(params, limit, offset);

        console.log('🔍 Fetching KENDO assets with query:', query);

        const response = await fetch(ASSETS_API_URL, {
            method: 'POST',
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: null,
                variables: {},
                query: query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for GraphQL errors
        if (data.errors) {
            throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
        }

        console.log('✅ KENDO Assets API result received:', {
            queryType: data?.data?.getAssetsByMetadata ? 'getAssetsByMetadata' : 'getAssetListing',
            totalCount: data?.data?.getAssetsByMetadata?.totalCount || data?.data?.getAssetListing?.totalCount || 0,
            edgeCount: data?.data?.getAssetsByMetadata?.edges?.length || data?.data?.getAssetListing?.edges?.length || 0
        });

        // Return raw data, processed by adapter layer
        return data;

    } catch (error) {
        console.error('❌ Error fetching KENDO assets:', error);
        return {
            errors: [{ message: error.message }]
        };
    }
};

export default fetchKendoAssets;

// Usage examples with getAssetsByMetadata:
//
// 1. Fetch assets with Media Category metadata filter (多选支持):
// fetchKendoAssets({ 'media-category': ['Icons', 'Logos', 'Main'] })
//
// 2. Fetch assets from specific brand (子品牌主题切换):
// fetchKendoAssets({ brand: 'KENDO', 'media-category': ['Icons'] })
// fetchKendoAssets({ brand: 'OTHERBRAND', 'media-category': ['Logos'] })
//
// 3. Fetch multiple specific assets by IDs:
// fetchKendoAssets({ ids: ['647', '648', '649'] })
//
// 4. Complex filtering combining metadata and traditional filters:
// fetchKendoAssets({
//   'media-category': ['Icons', 'Logos'],
//   'media-type': ['Images'],
//   filename: 'product',
//   brand: 'KENDO'
// })
//
// 5. Date range filtering:
// fetchKendoAssets({
//   'creation-date-from': '2024-01-01',
//   'creation-date-to': '2024-12-31',
//   'media-category': ['Main']
// })
//
// Generated query example:
// pathStartsWith: "/KENDO/"
// metadataFilters: [{ name: "Media Type", values: ["Icons", "Logos"], operator: "IN" }]
//
// Pagination examples:
// fetchKendoAssets({ limit: 20, offset: 0 })   // 第一页
// fetchKendoAssets({ limit: 20, offset: 20 })  // 第二页
// fetchKendoAssets({ limit: 20, offset: 40 })  // 第三页 