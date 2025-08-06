// KENDO Assets GraphQL API Service
const ASSETS_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * 构建Assets GraphQL查询
 * @param {Object} filters - 筛选条件
 * @param {number} first - 获取数量
 * @param {number} after - 偏移量
 * @returns {string} GraphQL查询字符串
 */
const buildAssetsQuery = (filters = {}, first = 20, after = 0) => {
    // 构建筛选条件数组（使用$and组合所有条件）
    const allConditions = [];

    // 基本筛选 - 确保是有类型的资产
    allConditions.push({ mimetype: { "$not": "" } });

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

    // 按MIME类型筛选 (例如: 'Images', 'Videos', 'Documents')
    if (filters['media-type'] && filters['media-type'].length > 0) {
        // 为多个类型创建OR条件
        const typeConditions = filters['media-type'].map(type => {
            if (type === 'Images') return { mimetype: { "$like": "image/%" } };
            if (type === 'Videos') return { mimetype: { "$like": "video/%" } };
            if (type === 'Documents') return { mimetype: { "$like": "application/%" } };
            if (type === 'Audio') return { mimetype: { "$like": "audio/%" } };
            // 兼容旧格式
            if (type === 'image') return { mimetype: { "$like": "image/%" } };
            if (type === 'video') return { mimetype: { "$like": "video/%" } };
            if (type === 'document') return { mimetype: { "$like": "application/%" } };
            return {};
        }).filter(condition => Object.keys(condition).length > 0);

        if (typeConditions.length > 0) {
            allConditions.push({ "$or": typeConditions });
        }
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

    // 兼容旧的预定义日期选项（如果存在）
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
            }
          }
        }
      }
    }
  }`;
};

/**
 * 调用KENDO Assets GraphQL API
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} Assets数据
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

        // 检查GraphQL错误
        if (data.errors) {
            throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
        }

        console.log('✅ KENDO Assets API result received');

        // 返回原始数据，由adapter层进行处理
        return data;

    } catch (error) {
        console.error('❌ Error fetching KENDO assets:', error);
        return {
            errors: [{ message: error.message }]
        };
    }
};

export default fetchKendoAssets; 