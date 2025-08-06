// GraphQL API service for KENDO PIM
import { adaptGraphQLProductResponse } from '../adapters/kendoProductAdapter';

const GRAPHQL_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';

/**
 * 构建GraphQL查询
 * @param {Object} filters - 筛选条件
 * @param {number} first - 获取数量
 * @param {number} after - 偏移量
 * @param {string} brand - 品牌代码
 * @returns {string} GraphQL查询字符串
 */
const buildGraphQLQuery = (filters = {}, first = 100, after = 0, brand = 'kendo') => {
  // 构建筛选条件
  const filterConditions = [];

  // 动态品牌筛选
  const brandName = brand.toUpperCase(); // 将品牌代码转换为大写
  filterConditions.push({
    "Brand": { "$like": `%${brandName}%` }
  });

  // 只获取sku类型的产品（有完整信息的产品）
  filterConditions.push({
    "objectType": { "$like": "virtual-product" }
  });

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
           objectType
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
 * 调用GraphQL API获取产品数据
 * @param {Object} params - 查询参数
 * @param {string} brand - 品牌代码
 * @returns {Promise<Object>} 产品数据
 */
export const fetchKendoProducts = async (params = {}, brand = 'kendo') => {
  try {
    const { limit = 1, offset = 0 } = params;
    const brandName = brand.toUpperCase();
    console.log(`🔍 Building GraphQL query for ${brandName} products`);
    const query = buildGraphQLQuery(params, limit, offset, brand);

    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Pragma': 'no-cache',
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

    return adaptGraphQLProductResponse(data);
  } catch (error) {
    console.error('Error fetching KENDO products:', error);

    // 返回空结果而不是抛出错误，以保持UI稳定
    return {
      list: [],
      totalSize: 0,
      startIndex: 0,
      pageSize: 0,
      error: error.message
    };
  }
};

export default fetchKendoProducts; 