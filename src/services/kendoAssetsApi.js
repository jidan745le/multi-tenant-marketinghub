// KENDO Assets GraphQL API Service
const ASSETS_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * Build Assets GraphQL query
 * @param {Object} filters - Filter conditions
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @returns {string} GraphQL query string
 */
const buildAssetsQuery = (filters = {}, first = 20, after = 0) => {
    // Build filter conditions array (using $and to combine all conditions)
    const allConditions = [];

    // Basic filtering - ensure assets have a type
    allConditions.push({ mimetype: { "$not": "" } });

    // Filter by filename
    if (filters.filename) {
        allConditions.push({ filename: { "$like": `%${filters.filename}%` } });
    }

    // Filter by folder path
    if (filters['folder-path']) {
        allConditions.push({ fullpath: { "$like": `%${filters['folder-path']}%` } });
    }

    // Filter by product model number (through path matching)
    if (filters['model-number']) {
        allConditions.push({ fullpath: { "$like": `%${filters['model-number']}%` } });
    }

    // Filter by MIME type (example: 'Images', 'Videos', 'Documents')
    if (filters['media-type'] && filters['media-type'].length > 0) {
        // Create OR conditions for multiple types
        const typeConditions = filters['media-type'].map(type => {
            if (type === 'Images') return { mimetype: { "$like": "image/%" } };
            if (type === 'Videos') return { mimetype: { "$like": "video/%" } };
            if (type === 'Documents') return { mimetype: { "$like": "application/%" } };
            if (type === 'Audio') return { mimetype: { "$like": "audio/%" } };
            // Compatibility with old format
            if (type === 'image') return { mimetype: { "$like": "image/%" } };
            if (type === 'video') return { mimetype: { "$like": "video/%" } };
            if (type === 'document') return { mimetype: { "$like": "application/%" } };
            return {};
        }).filter(condition => Object.keys(condition).length > 0);

        if (typeConditions.length > 0) {
            allConditions.push({ "$or": typeConditions });
        }
    }

    // Filter by creation date range
    if (filters['creation-date-from'] || filters['creation-date-to']) {
        const dateConditions = {};

        if (filters['creation-date-from']) {
            dateConditions["$gte"] = filters['creation-date-from'];
        }

        if (filters['creation-date-to']) {
            dateConditions["$lte"] = filters['creation-date-to'];
        }

        if (Object.keys(dateConditions).length > 0) {
            allConditions.push({ creationDate: dateConditions });
        }
    }

    // Compatibility with old predefined date options (if exists)
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
            allConditions.push({
                creationDate: { "$gte": fromDate.toISOString().split('T')[0] }
            });
        }
    }

    // Build final filter conditions
    const filterConditions = allConditions.length > 1
        ? { "$and": allConditions }
        : allConditions[0] || {};

    // Convert filter conditions to string
    const filterString = JSON.stringify(filterConditions);

    // Log filter conditions (for debugging)
    console.log('🔍 Assets GraphQL Query Filter:', {
        rawFilters: filters,
        processedConditions: filterConditions,
        dateFilters: {
            hasDateRange: !!(filters['creation-date-from'] || filters['creation-date-to']),
            fromDate: filters['creation-date-from'],
            toDate: filters['creation-date-to'],
            quickFilter: filters['creation-date']
        }
    });

    return `{
    getAssetListing(first: ${first}, after: ${after}, filter: "${filterString.replace(/"/g, '\\"')}") {
      totalCount
      edges {
        cursor
        node {
          ... on asset {
            id
            fullpath
            assetThumb: fullpath(thumbnail: "content",format: "webp") 
            type
            filename
            mimetype
            filesize
            creationDate
            parent {
              ... on element {
                __typename
              }
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
    }
  }`;
};

/**
 * Call KENDO Assets GraphQL API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Assets data
 */
export const fetchKendoAssets = async (params = {}) => {
    try {
        const { limit = 20, offset = 0 } = params;
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

        console.log('✅ KENDO Assets API result received');

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