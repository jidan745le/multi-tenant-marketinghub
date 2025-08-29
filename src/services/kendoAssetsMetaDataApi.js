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
 * @param {Array<string>} filters['document-type'] - Filter by Document Type metadata (支持多选)
 * @param {string} filters['metadata-logic'] - Metadata filter logic: 'AND' or 'OR' (default: 'AND')
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

    // Document Type metadata filter (支持多选)
    if (filters['document-type'] && Array.isArray(filters['document-type']) && filters['document-type'].length > 0) {
        metadataFilters.push({
            name: "Document Type",
            values: filters['document-type'],
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

        // Support both AND and OR logic for metadata filters
        const metadataLogic = filters['metadata-logic'] && filters['metadata-logic'].toUpperCase() === 'OR' ? 'OR' : 'AND';
        queryParams.push(`metadataLogic: "${metadataLogic}"`);
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
        metadataLogic: filters['metadata-logic'] ? filters['metadata-logic'].toUpperCase() : 'AND',
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
 * @param {Array<string>} params['document-type'] - Filter by Document Type metadata (支持多选：Catalog, Brochure, Manual等)
 * @param {string} params['metadata-logic'] - Metadata filter logic: 'AND' or 'OR' (default: 'AND')
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

// fetchKendoAssets({
//     'media-category': ['Icons', 'Logos'],
//     'document-type': ['Catalog'],
//     'metadata-logic': 'OR'
// })
export default fetchKendoAssets;

// Usage examples with getAssetsByMetadata:

// ===== METADATA FILTERING EXAMPLES =====

// 1. 搜索 Media Type 为 Icons 的资产:
// fetchKendoAssets({ 'media-category': ['Icons'] })
// 生成的查询包含: metadataFilters: [{ name: "Media Type", values: ["Icons"], operator: "IN" }]

// 2. 搜索 Document Type 为 Catalog 的资产:
// fetchKendoAssets({ 'document-type': ['Catalog'] })
// 生成的查询包含: metadataFilters: [{ name: "Document Type", values: ["Catalog"], operator: "IN" }]

// 3. 多选 Media Category metadata filter:
// fetchKendoAssets({ 'media-category': ['Icons', 'Logos', 'Main'] })

// 4. 组合多个 metadata 条件 (AND 逻辑 - 默认):
// fetchKendoAssets({
//   'media-category': ['Icons', 'Logos'],
//   'document-type': ['Catalog', 'Brochure']
// })
// 结果: 返回既是Icons/Logos类型，又是Catalog/Brochure文档的资产

// ===== OR LOGIC EXAMPLES =====

// 5. 组合多个 metadata 条件 (OR 逻辑):
// fetchKendoAssets({
//   'media-category': ['Icons', 'Logos'],
//   'document-type': ['Catalog', 'Brochure'],
//   'metadata-logic': 'OR'
// })
// 结果: 返回所有Icons/Logos类型的资产 + 所有Catalog/Brochure文档

// 6. OR 逻辑实际应用场景 - 获取所有品牌相关素材:
// fetchKendoAssets({
//   'media-category': ['Logos', 'Brand'],      // 所有Logo和品牌图片
//   'document-type': ['Brochure', 'Catalog'],  // 或者所有宣传册和目录
//   'metadata-logic': 'OR'
// })

// 7. OR 逻辑 - 获取产品的所有相关内容:
// fetchKendoAssets({
//   'media-category': ['Main', 'Detail', 'Application'], // 产品图片
//   'document-type': ['Manual', 'Datasheet', 'Guide'],   // 或者技术文档
//   'model-number': 'ABC123',
//   'metadata-logic': 'OR'
// })

// ===== BRAND/PATH FILTERING EXAMPLES =====

// 5. 特定品牌的 Icons (子品牌主题切换):
// fetchKendoAssets({ brand: 'KENDO', 'media-category': ['Icons'] })
// fetchKendoAssets({ brand: 'BOSCH', 'media-category': ['Icons'] })

// 6. 默认 KENDO 品牌 (不指定 brand 参数):
// fetchKendoAssets({ 'media-category': ['Icons'] })
// 生成: pathStartsWith: "/KENDO/"

// ===== MIME TYPE FILTERING EXAMPLES =====

// 7. 只搜索图片类型的 Icons:
// fetchKendoAssets({
//   'media-category': ['Icons'],
//   'media-type': ['Images']  // 过滤 mimetype: "image/%"
// })

// 8. 只搜索视频文件:
// fetchKendoAssets({
//   'media-type': ['Videos']  // 过滤 mimetype: "video/%"
// })

// 9. 搜索文档文件 (PDF, DOC 等):
// fetchKendoAssets({
//   'media-type': ['Documents']  // 过滤 mimetype: "application/%"
// })

// ===== COMPLEX FILTERING EXAMPLES =====

// 10. 复杂组合查询 - Icons + 图片 + 特定品牌:
// fetchKendoAssets({
//   'media-category': ['Icons'],
//   'media-type': ['Images'],
//   brand: 'KENDO',
//   filename: 'logo'  // 文件名包含 'logo'
// })

// 11. 按产品型号搜索资产:
// fetchKendoAssets({
//   'model-number': 'ABC123',
//   'media-category': ['Main']
// })

// 12. 按文件夹路径搜索:
// fetchKendoAssets({
//   'folder-path': 'PRODUCT ASSETS',
//   'media-category': ['Icons']
// })

// ===== DATE FILTERING EXAMPLES =====

// 13. 日期范围 + Media Type 搜索:
// fetchKendoAssets({
//   'creation-date-from': '2024-01-01',
//   'creation-date-to': '2024-12-31',
//   'media-category': ['Icons']
// })

// 14. 快速日期过滤:
// fetchKendoAssets({
//   'creation-date': 'last_1_month',  // 最近一个月
//   'media-category': ['Icons']
// })

// 15. 只搜索最近两周的 Catalog 文档:
// fetchKendoAssets({
//   'creation-date': 'last_2_weeks',
//   'document-type': ['Catalog'],
//   'media-type': ['Documents']
// })

// ===== PAGINATION EXAMPLES =====

// 16. 分页搜索 Icons (第一页):
// fetchKendoAssets({
//   'media-category': ['Icons'],
//   limit: 20,
//   offset: 0
// })

// 17. 分页搜索 Icons (第二页):
// fetchKendoAssets({
//   'media-category': ['Icons'],
//   limit: 20,
//   offset: 20
// })

// ===== ID-BASED FETCHING EXAMPLES =====

// 18. 获取特定 ID 的资产:
// fetchKendoAssets({ ids: ['647', '648', '649'] })

// 19. 获取特定 ID 且验证是 Icons:
// fetchKendoAssets({
//   ids: ['647', '648'],
//   'media-category': ['Icons']
// })

// ===== GENERATED QUERY EXAMPLES =====

// Example 1: Media Type Icons 查询生成:
// pathStartsWith: "/KENDO/"
// metadataFilters: [{ name: "Media Type", values: ["Icons"], operator: "IN" }]
// metadataLogic: "AND"

// Example 2: Document Type Catalog 查询生成:
// pathStartsWith: "/KENDO/"
// metadataFilters: [{ name: "Document Type", values: ["Catalog"], operator: "IN" }]
// metadataLogic: "AND"

// Example 3: 组合查询生成 (AND 逻辑):
// pathStartsWith: "/KENDO/"
// metadataFilters: [
//   { name: "Media Type", values: ["Icons"], operator: "IN" },
//   { name: "Document Type", values: ["Catalog"], operator: "IN" }
// ]
// metadataLogic: "AND"
// 结果: Icons AND Catalog (交集)

// Example 4: 组合查询生成 (OR 逻辑):
// pathStartsWith: "/KENDO/"
// metadataFilters: [
//   { name: "Media Type", values: ["Icons", "Logos"], operator: "IN" },
//   { name: "Document Type", values: ["Catalog", "Brochure"], operator: "IN" }
// ]
// metadataLogic: "OR"
// 结果: (Icons OR Logos) OR (Catalog OR Brochure) (并集)

// Example 5: OR 逻辑复杂示例:
// pathStartsWith: "/KENDO/"
// metadataFilters: [
//   { name: "Media Type", values: ["Brand", "Logos"], operator: "IN" },
//   { name: "Document Type", values: ["Brochure", "Leaflet"], operator: "IN" }
// ]
// metadataLogic: "OR"
// filter: "{\"$and\":[{\"mimetype\":{\"$not\":\"\"}},{\"fullpath\":{\"$like\":\"%ABC123%\"}}]}"
// 结果: 所有品牌图片 + 所有宣传材料 + 包含ABC123的其他资产 