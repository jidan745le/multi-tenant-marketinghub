import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';

const ASSETS_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * 构建视频资产GraphQL查询
 * @param {Object} filters - 筛选条件
 * @param {number} first - 获取数量
 * @param {number} after - 偏移量
 * @returns {string} GraphQL查询字符串
 */
const buildVideosQuery = (filters = {}, first = 20, after = 0) => {
    // 构建筛选条件数组（使用$and组合所有条件）
    const allConditions = [];

    // 基本筛选 - 确保是有类型的资产
    allConditions.push({ mimetype: { "$not": "" } });

    // 核心条件：只获取视频类型的资产
    allConditions.push({ mimetype: { "$like": "video/%" } });

    // 按文件名筛选
    if (filters.filename) {
        allConditions.push({ filename: { "$like": `%${filters.filename}%` } });
    }

    // 按文件夹路径筛选
    if (filters['folder-path']) {
        allConditions.push({ fullpath: { "$like": `%${filters['folder-path']}%` } });
    }

    // 按产品型号筛选（通过路径匹配）
    if (filters['model-number']) {
        allConditions.push({ fullpath: { "$like": `%${filters['model-number']}%` } });
    }

    // 按创建日期范围筛选
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

    // 兼容旧的预定义日期选项
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

    // 构建最终的筛选条件
    const filterConditions = allConditions.length > 1
        ? { "$and": allConditions }
        : allConditions[0] || {};

    // 将筛选条件转换为字符串
    const filterString = JSON.stringify(filterConditions);

    // 记录过滤条件（用于调试）
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
            assetThumb: fullpath(thumbnail: "content")
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
 * 获取视频资产数据
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 视频资产数据
 */
export const fetchVideos = async (params = {}) => {
    try {
        const { limit = 20, offset = 0 } = params;
        const query = buildVideosQuery(params, limit, offset);

        console.log('🎥 Fetching videos with query:', query);

        const response = await fetch(ASSETS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
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

        // 使用现有的资产适配器转换数据
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