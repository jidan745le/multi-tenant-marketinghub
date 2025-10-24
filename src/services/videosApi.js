import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
import CookieService from '../utils/cookieService';

const ASSETS_API_URL = '/apis/kendo/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * Build video assets GraphQL query
 * @param {Object} filters - Filter conditions
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @returns {string} GraphQL query string
 */
const buildVideosQuery = (filters = {}, first = 20, after = 0) => {
    // Build filter conditions array (using $and to combine all conditions)
    const allConditions = [];

    // Basic filtering - ensure assets have a type
    allConditions.push({ mimetype: { "$not": "" } });

    // Core condition: only get video type assets
    allConditions.push({ mimetype: { "$like": "video/%" } });

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
    console.log('🎥 Videos GraphQL Query Filter:', {
        rawFilters: filters,
        processedConditions: filterConditions,
        videoOnlyFilter: true,
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
            srcset(thumbnail: "content") {
              url
              descriptor
              resolutions(types: [2, 5]) {
                url
                resolution
              }
            }
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
            }
          }
        }
      }
    }
  }`;
};

/**
 * Fetch video assets data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Video assets data
 */
export const fetchVideos = async (params = {}) => {
    try {
        const { limit = 20, offset = 0 } = params;
        const query = buildVideosQuery(params, limit, offset);
        const token = CookieService.getToken();

        console.log('🎥 Fetching videos with query:', query);

        const response = await fetch(ASSETS_API_URL, {
            method: 'POST',
            headers: {
                'Pragma': 'no-cache',
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

        if (data.errors) {
            console.error('❌ Videos GraphQL errors:', data.errors);
            throw new Error(`GraphQL error: ${data.errors[0].message}`);
        }

        console.log('✅ Videos GraphQL response received');

        // Use existing assets adapter to transform data
        return adaptGraphQLAssetsResponse(data);

    } catch (error) {
        console.error('❌ Error fetching videos:', error);
        return {
            list: [],
            totalSize: 0,
            startIndex: 0,
            pageSize: 0,
            error: error.message
        };
    }
};

export default fetchVideos; 