// GraphQL API service for KENDO PIM
import { adaptGraphQLProductResponse } from '../adapters/kendoProductAdapter';
import CookieService from '../utils/cookieService';

const GRAPHQL_API_URL = '/apis/kendo/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';

/**
 * Get user permissions from localStorage
 * @returns {Array} User permissions array
 */
const getUserPermissions = () => {
  try {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      return userData.permissions || [];
    }
  } catch {
    // Silent fail
  }
  return [];
};

/**
 * Build GraphQL query
 * @param {Object} filters - Filter conditions
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @param {string} brand - Brand code
 * @returns {string} GraphQL query string
 */
const buildGraphQLQuery = (filters = {}, first = 100, after = 0, brand = 'kendo', language = "en") => {
  // Build filter conditions
  const filterConditions = [];

  // Dynamic brand filtering
  const brandName = brand.toUpperCase(); // Convert brand code to uppercase
  filterConditions.push({
    "Brand": { "$like": `%${brandName}%` }
  });

  // Only get virtual-product type products (products with complete information)
  filterConditions.push({
    "objectType": { "$like": "virtual-product" }
  });

  filterConditions.push({
    "EnrichmentStatus": { "$not": "New" }
  });

  filterConditions.push({
    "LifecycleStatus": { "$like": "Active" }
  });

  // Permission-based filtering
  const userPermissions = getUserPermissions();
  const hasInternalDataAccess = userPermissions.includes('marketinghub:domain:InternalData:access');
  const hasExternalDataAccess = userPermissions.includes('marketinghub:domain:ExternalData:access');

  // If user only has ExternalData access (not InternalData), apply additional filters
  if (hasExternalDataAccess && !hasInternalDataAccess) {

    // OnlineDate is NOT EMPTY
    filterConditions.push({
      "OnlineDate": { "$not": "" }
    });

    // FirstShipmentDate is NOT EMPTY
    filterConditions.push({
      "FirstShipmentDate": { "$not": "" }
    });

    // CustomerSpecificFlag = "No"
    filterConditions.push({
      "CustomerSpecificFlag": { "$not": true }
    });
  }

  // Product name filtering 
  if (filters['product-name']) {
    filterConditions.push({
      "ProductName": { "$like": `%${filters['product-name']}%` }
    });
  }

  // SKU code filtering (CustomerFacingProductCode)
  // Note: SKU code is handled separately with childFilter for nested filtering
  // This is handled in the query building logic below

  // Virtual product ID filtering (equivalent to model number)
  if (filters['model-number']) {
    const modelNumbers = filters['model-number'].split(';').map(s => s.trim()).filter(Boolean);
    const modelConditions = modelNumbers.map(modelNumber => ({
      "VirtualProductID": { "$like": modelNumber }
    }));
    if (modelConditions.length > 0) {
      filterConditions.push({ "$or": modelConditions });
    }
  }

  // ERP material code filtering (equivalent to EAN)
  if (filters['ean']) {
    const eans = filters['ean'].split(';').map(s => s.trim()).filter(Boolean);
    const eanConditions = eans.map(ean => ({
      "ERPMaterialCode": { "$like": `%${ean}%` }
    }));
    if (eanConditions.length > 0) {
      filterConditions.push({ "$or": eanConditions });
    }
  }

  // Product type filtering
  if (filters['product-type'] && filters['product-type'].length > 0) {
    const typeConditions = filters['product-type'].map(type => ({
      "ProductType": { "$like": `%${type.replace('-', ' ')}%` }
    }));
    filterConditions.push({ "$or": typeConditions });
  }

  // Product category filtering (tree structure support)
  // 使用CategoryID进行筛选
  if (filters['product-category'] && filters['product-category'].length > 0) {
    const categoryConditions = filters['product-category'].map(category => ({
      "CategoryID": { "$like": `%${category}%` }
    }));
    filterConditions.push({ "$or": categoryConditions });
  }

  // Application filtering (by Trade)
  if (filters['application'] && filters['application'].length > 0) {
    const applicationConditions = filters['application'].map(app => ({
      "Application": { "$like": `%${app}%` }
    }));
    filterConditions.push({ "$or": applicationConditions });
  }

  // Created date filtering (FilterSidebar已经转换为YYYY-MM-DD格式)
  if (filters['created-on'] && typeof filters['created-on'] === 'string') {
    filterConditions.push({
      "OnlineDate": { "$gte": filters['created-on'] }
    });
  }

  // Online date filtering for new products (OnlineDate > 2025-01-01)
  if (filters['new-products'] === true) {
    filterConditions.push({
      "OnlineDate": { "$gt": "2025-01-01" }
    });
  }

  const filterString = JSON.stringify({ "$and": filterConditions });

  // Handle SKU code with nested filter (childFilter)
  if (filters['sku-code']) {
    const skuCodes = filters['sku-code'].split(';').map(s => s.trim()).filter(Boolean);
    const skuConditions = skuCodes.map(skuCode => ({
      "CustomerFacingProductCode": { "$like": skuCode }
    }));
    
    if (skuConditions.length > 0) {
      const childFilterString = JSON.stringify({ "$or": skuConditions });
      
      return `{
        getProductListing(
          first: ${first}, 
          after: ${after}, 
          filter: "${filterString.replace(/"/g, '\\"')}",
          childFilter: "${childFilterString.replace(/"/g, '\\"')}",
          childClassName: "Product",
          defaultLanguage: "${language}"
        ) {
          totalCount
          edges {
            cursor
            node {
              id
              Brand
              ERPMaterialCode
              VirtualProductID
              CustomerFacingProductCode
              ProductName
              ShortDescription
              LongDescription
              ProductType
              CategoryName
              CategoryID
              Application
              OnlineDate        
              objectType
              EnrichmentStatus
              LifecycleStatus
              CustomerSpecificFlag
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
    }
  }

  return `{
    getProductListing(first: ${first}, after: ${after}, filter: "${filterString.replace(/"/g, '\\"')}", defaultLanguage: "${language}") {
      totalCount
      edges {
        cursor
        node {
          id
          Brand
          ERPMaterialCode
          VirtualProductID
          CustomerFacingProductCode
          ProductName
          ShortDescription
          LongDescription
          ProductType
          CategoryName
          CategoryID
          Application
          OnlineDate        
          objectType
          EnrichmentStatus
          LifecycleStatus
          CustomerSpecificFlag
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
 * Build validation query for SKU codes
 * @param {Array<string>} skuCodes - Array of SKU codes to validate
 * @param {string} brand - Brand code
 * @param {string} language - Language code
 * @returns {string} GraphQL query string
 */
const buildSKUValidationQuery = (skuCodes, brand = 'kendo', language = "en") => {
  const brandName = brand.toUpperCase();
  const skuConditions = skuCodes.map(skuCode => ({
    "CustomerFacingProductCode": { "$like": skuCode }
  }));

  const filterConditions = [
    { "Brand": { "$like": brandName } },
    { "objectType": { "$like": "sku" } },
    { "$or": skuConditions }
  ];

  const filterString = JSON.stringify({ "$and": filterConditions });

  return `{
    getProductListing(
      first: 20, 
      after: 0, 
      filter: "${filterString.replace(/"/g, '\\"')}",
      defaultLanguage: "${language}"
    ) {
      totalCount
      edges {
        node {
          id
          CustomerFacingProductCode
        }
      }
    }
  }`;
};

/**
 * Build validation query for model numbers (Virtual Product IDs)
 * @param {Array<string>} modelNumbers - Array of model numbers to validate
 * @param {string} brand - Brand code
 * @param {string} language - Language code
 * @returns {string} GraphQL query string
 */
const buildModelNumberValidationQuery = (modelNumbers, brand = 'kendo', language = "en") => {
  const brandName = brand.toUpperCase();
  const modelConditions = modelNumbers.map(modelNumber => ({
    "VirtualProductID": { "$like": modelNumber }
  }));

  const filterConditions = [
    { "Brand": { "$like": brandName } },
    { "objectType": { "$like": "virtual-product" } },
    { "$or": modelConditions }
  ];

  const filterString = JSON.stringify({ "$and": filterConditions });

  return `{
    getProductListing(
      first: 20, 
      after: 0, 
      filter: "${filterString.replace(/"/g, '\\"')}",
      defaultLanguage: "${language}"
    ) {
      totalCount
      edges {
        node {
          id
          VirtualProductID
        }
      }
    }
  }`;
};

/**
 * Validate SKU codes
 * @param {Array<string>} skuCodes - Array of SKU codes to validate
 * @param {string} brand - Brand code
 * @param {string} language - Language code
 * @returns {Promise<Array<string>>} Array of valid SKU codes
 */
export const validateSKUCodes = async (skuCodes, brand = 'kendo', language = "en") => {
  try {
    if (!skuCodes || skuCodes.length === 0) {
      return [];
    }

    const query = buildSKUValidationQuery(skuCodes, brand, language);
    const token = CookieService.getToken();

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
      throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    const edges = data.data?.getProductListing?.edges || [];
    const validCodes = edges
      .map(edge => edge.node.CustomerFacingProductCode)
      .filter(Boolean)
      .map(code => code.trim());
    
    return validCodes;
  } catch (error) {
    console.error('Error validating SKU codes:', error);
    return [];
  }
};

/**
 * Validate model numbers (Virtual Product IDs)
 * @param {Array<string>} modelNumbers - Array of model numbers to validate
 * @param {string} brand - Brand code
 * @param {string} language - Language code
 * @returns {Promise<Array<string>>} Array of valid model numbers
 */
export const validateModelNumbers = async (modelNumbers, brand = 'kendo', language = "en") => {
  try {
    if (!modelNumbers || modelNumbers.length === 0) {
      return [];
    }

    const query = buildModelNumberValidationQuery(modelNumbers, brand, language);
    const token = CookieService.getToken();

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
      throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    const edges = data.data?.getProductListing?.edges || [];
    const validCodes = edges
      .map(edge => edge.node.VirtualProductID)
      .filter(Boolean)
      .map(code => code.trim());
    
    return validCodes;
  } catch (error) {
    console.error('Error validating model numbers:', error);
    return [];
  }
};

/**
 * Call GraphQL API to fetch product data
 * @param {Object} params - Query parameters
 * @param {string} brand - Brand code
 * @returns {Promise<Object>} Product data
 */
export const fetchKendoProducts = async (params = {}, brand = 'kendo', language = "en") => {
  try {
    const { limit = 1, offset = 0 } = params;
    console.log('fetchKendoProducts', params, brand);
    const query = buildGraphQLQuery(params, limit, offset, brand, language);

    const token = CookieService.getToken();


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

    // Check for GraphQL errors
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return adaptGraphQLProductResponse(data);
  } catch (error) {
    // Return empty result instead of throwing error to keep UI stable
    return {
      list: [],
      totalSize: 0,
      pageIndex: 0,
      pageSize: 0,
      error: error.message
    };
  }
};

/**
 * Build GraphQL query for fetching category taxonomy
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @returns {string} GraphQL query string
 */
const buildCategoryTaxonomyQuery = (first = 100, after = 0) => {
  // 固定使用ALL品牌，获取所有分类数据
  const brandName = 'ALL';

  const filterConditions = [
    { "Brand": { "$like": `%${brandName}%` } },
    { "objectType": { "$like": "taxonomy" } }
  ];

  const filterString = JSON.stringify({ "$and": filterConditions });

  return `{
    getProductListing(
      first: ${first}
      after: ${after}
      filter: "${filterString.replace(/"/g, '\\"')}"
    ) {
      totalCount
      edges {
        cursor
        node {
          id
          Brand
          ProductType
          CategoryName
          CategoryID
          objectType
          parent {
            ... on object_Product {
              id
              CategoryName
              CategoryID
            }
          }
        }
      }
    }
  }`;
};

/**
 * Transform flat category data to tree structure
 * @param {Array} edges - GraphQL edges data
 * @returns {Array} Tree structure array (without root nodes, only subcategories)
 */
const transformCategoryToTree = (edges) => {
  if (!edges || edges.length === 0) return [];

  // Create a map of all nodes by ID
  const nodeMap = new Map();
  const rootNodes = [];

  // First pass: create all nodes
  edges.forEach(edge => {
    const node = edge.node;
    const treeNode = {
      id: node.id,
      value: node.CategoryID || node.CategoryName, // 优先使用CategoryID作为筛选值
      label: node.CategoryName, // 显示名称
      categoryID: node.CategoryID,
      categoryName: node.CategoryName,
      productType: node.ProductType,
      children: []
    };
    nodeMap.set(node.id, { treeNode, parentId: node.parent?.id });
  });

  // Second pass: build tree structure
  nodeMap.forEach(({ treeNode, parentId }) => {
    if (!parentId) {
      // This is a root node
      rootNodes.push(treeNode);
    } else {
      // Find parent and add as child
      const parentData = nodeMap.get(parentId);
      if (parentData) {
        parentData.treeNode.children.push(treeNode);
      } else {
        // If parent not found, treat as root
        rootNodes.push(treeNode);
      }
    }
  });

  // Remove empty children arrays for leaf nodes
  const cleanTree = (node) => {
    if (node.children && node.children.length === 0) {
      delete node.children;
    } else if (node.children) {
      node.children.forEach(cleanTree);
    }
    return node;
  };

  rootNodes.forEach(cleanTree);

  // 去掉根节点，只返回所有根节点的子节点（展开一层）
  const allSubCategories = [];
  rootNodes.forEach(rootNode => {
    if (rootNode.children && rootNode.children.length > 0) {
      allSubCategories.push(...rootNode.children);
    }
  });

  return allSubCategories;
};

/**
 * Fetch category taxonomy tree structure with batch loading
 * @returns {Promise<Array>} Tree structure array
 */
export const fetchCategoryTree = async () => {
  try {
    // Step 1: 先获取第一批数据和totalCount
    const batchSize = 100; // 每批加载100条
    const firstQuery = buildCategoryTaxonomyQuery(batchSize, 0);
    const token = CookieService.getToken();

    const firstResponse = await fetch(GRAPHQL_API_URL, {
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
        query: firstQuery
      })
    });

    if (!firstResponse.ok) {
      throw new Error(`HTTP error! status: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();

    if (firstData.errors) {
      throw new Error(`GraphQL error: ${firstData.errors.map(e => e.message).join(', ')}`);
    }

    const totalCount = firstData.data?.getProductListing?.totalCount || 0;
    let allEdges = firstData.data?.getProductListing?.edges || [];

    // Step 2: 如果还有更多数据，分批加载
    if (totalCount > batchSize) {
      const batches = Math.ceil(totalCount / batchSize);

      // 创建所有批次的请求
      const batchPromises = [];
      for (let i = 1; i < batches; i++) {
        const offset = i * batchSize;
        const query = buildCategoryTaxonomyQuery(batchSize, offset);

        const promise = fetch(GRAPHQL_API_URL, {
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
        })
          .then(res => res.json())
          .then(data => {
            if (data.errors) {
              return [];
            }
            return data.data?.getProductListing?.edges || [];
          })
          .catch(() => {
            return [];
          });

        batchPromises.push(promise);
      }

      // 等待所有批次完成
      const batchResults = await Promise.all(batchPromises);

      // 合并所有edges
      batchResults.forEach((edges) => {
        allEdges = allEdges.concat(edges);
      });
    }

    // Step 3: 转换为树形结构
    const tree = transformCategoryToTree(allEdges);

    return tree;
  } catch {
    return [];
  }
};

export default fetchKendoProducts; 