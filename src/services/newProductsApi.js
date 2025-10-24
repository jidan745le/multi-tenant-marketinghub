import { adaptGraphQLProductResponse } from '../adapters/kendoProductAdapter';
import CookieService from '../utils/cookieService';

const GRAPHQL_API_URL = '/apis/kendo/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';

/**
 * 构建新产品GraphQL查询（包含OnlineDate过滤）
 * @param {Object} filters - 筛选条件
 * @param {number} first - 获取数量
 * @param {number} after - 偏移量
 * @param {string} brand - 品牌代码
 * @returns {string} GraphQL查询字符串
 */
const buildNewProductsQuery = (filters = {}, first = 100, after = 0, brand = 'kendo') => {
  // 构建筛选条件
  const filterConditions = [];

  // 动态品牌筛选
  const brandName = brand.toUpperCase(); // 将品牌代码转换为大写
  filterConditions.push({
    "Brand": { "$like": `%${brandName}%` }
  });

  // 只获取非taxonomy类型的产品（有完整信息的产品）
  filterConditions.push({
    "objectType": { "$like": "virtual-product" }
  });

  // 新产品基础筛选：Online date was in the last 12 months（默认条件）
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twelveMonthsAgoStr = twelveMonthsAgo.toISOString().split('T')[0];

  // 如果没有Created筛选，应用默认的12个月筛选
  if (!filters['created'] || filters['created'].length === 0) {
    filterConditions.push({
      "OnlineDate": { "$gte": twelveMonthsAgoStr }
    });
  }

  // 产品名称筛选
  if (filters['product-name']) {
    filterConditions.push({
      "ProductName": { "$like": `%${filters['product-name']}%` }
    });
  }

  // 虚拟产品ID筛选（相当于model number）
  if (filters['model-number']) {
    const modelNumbers = filters['model-number'].split(';').map(s => s.trim()).filter(Boolean);
    const modelConditions = modelNumbers.map(modelNumber => ({
      "VirtualProductID": { "$like": `%${modelNumber}%` }
    }));
    if (modelConditions.length > 0) {
      filterConditions.push({ "$or": modelConditions });
    }
  }

  // ERP物料代码筛选（相当于EAN）
  if (filters['ean']) {
    const eans = filters['ean'].split(';').map(s => s.trim()).filter(Boolean);
    const eanConditions = eans.map(ean => ({
      "ERPMaterialCode": { "$like": `%${ean}%` }
    }));
    if (eanConditions.length > 0) {
      filterConditions.push({ "$or": eanConditions });
    }
  }

  // 产品类型筛选
  if (filters['product-type'] && filters['product-type'].length > 0) {
    const typeConditions = filters['product-type'].map(type => ({
      "ProductType": { "$like": `%${type.replace('-', ' ')}%` }
    }));
    filterConditions.push({ "$or": typeConditions });
  }

  // Application筛选 (By Trade)
  if (filters['application'] && filters['application'].length > 0) {
    console.log('🔧 Application filter applied:', filters['application']);
    const applicationConditions = filters['application'].map(app => ({
      "Application": { "$like": `%${app}%` }
    }));
    filterConditions.push({ "$or": applicationConditions });
  }

  // Product category filtering (tree structure support)
  // 使用CategoryID进行筛选
  if (filters['product-category'] && filters['product-category'].length > 0) {
    console.log('🏷️ Product category filter applied:', filters['product-category']);
    const categoryConditions = filters['product-category'].map(category => ({
      "CategoryID": { "$like": `%${category}%` }
    }));
    filterConditions.push({ "$or": categoryConditions });
    console.log('🔍 Category filter conditions (CategoryID):', categoryConditions);
  }

  // Created 时间筛选（New Products专用）
  if (filters['created'] && filters['created'].length > 0) {
    const createdConditions = filters['created'].map(period => {
      const now = new Date();

      switch (period) {
        case 'last-12-months': {
          const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return { "OnlineDate": { "$gte": twelveMonthsAgo.toISOString().split('T')[0] } };
        }

        case 'last-6-months': {
          const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
          return { "OnlineDate": { "$gte": sixMonthsAgo.toISOString().split('T')[0] } };
        }

        case 'coming-soon':
          // Coming Soon: Online Date为空
          return { "OnlineDate": { "$like": "" } };

        default:
          return null;
      }
    }).filter(Boolean);

    if (createdConditions.length > 0) {
      filterConditions.push({ "$or": createdConditions });
    }
  }

  const filterString = JSON.stringify({ "$and": filterConditions });

  return `{
    getProductListing(first: ${first}, after: ${after}, filter: "${filterString.replace(/"/g, '\\"')}") {
      totalCount
      edges {
        cursor
        node {
          id
          Brand
          ERPMaterialCode
          VirtualProductID
          ProductName_en: ProductName(language: "en")
          ProductName_de: ProductName(language: "de")
          ShortDescription_en: ShortDescription(language: "en")
          ShortDescription_de: ShortDescription(language: "de")
          LongDescription_en: LongDescription(language: "en")
          LongDescription_de: LongDescription(language: "de")
          ProductType
          CategoryName
          CategoryID
          Application
          objectType
          OnlineDate
          children {
            __typename
            ...on object_Product {
              id
              CustomerFacingProductCode
              Size
              MainMaterial
              SurfaceFinish
              ApplicableStandard              
            }
          }
          Icons {
            image {
              filename
              fullpath
              filesize
              duration
            }
          }
          Lifestyles {
            image {
              filename
              fullpath
            }
          }
          Main {
            id
            filename
            fullpath
            assetThumb: fullpath(thumbnail: "content",format: "webp")
            assetThumb2: fullpath(thumbnail: "content", format: "webp")
            resolutions(thumbnail: "content", types: [2, 5]) {
              resolution
              url
            }
          }
          OnWhite {
            marker {
              name
            }
            image {
              id
              filename
              fullpath
              filesize
            }
          }
        }
      }
    }
  }`;
};

/**
 * 获取新产品数据
 * @param {Object} params - 查询参数
 * @param {string} brand - 品牌代码
 * @returns {Promise<Object>} 新产品数据
 */
export const fetchNewProducts = async (params = {}, brand = 'kendo') => {
  try {
    const { limit = 100, offset = 0 } = params;
    const query = buildNewProductsQuery(params, limit, offset, brand);
    const token = CookieService.getToken();

    console.log('🆕 Fetching new products with query:', query);

    const response = await fetch(GRAPHQL_API_URL, {
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
      console.error('❌ GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    console.log('✅ New products GraphQL response received');

    // 使用现有的适配器转换数据
    return adaptGraphQLProductResponse(data);

  } catch (error) {
    console.error('❌ Error fetching new products:', error);
    return {
      list: [],
      totalSize: 0,
      startIndex: 0,
      pageSize: 0,
      error: error.message
    };
  }
};

export default fetchNewProducts; 