// GraphQL API service for KENDO PIM
import { adaptGraphQLProductResponse } from '../adapters/kendoProductAdapter';

const GRAPHQL_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';

/**
 * Build GraphQL query
 * @param {Object} filters - Filter conditions
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @param {string} brand - Brand code
 * @returns {string} GraphQL query string
 */
const buildGraphQLQuery = (filters = {}, first = 100, after = 0, brand = 'kendo') => {
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

  // Product name filtering
  if (filters['product-name']) {
    filterConditions.push({
      "ProductName": { "$like": `%${filters['product-name']}%` }
    });
  }

  // Virtual product ID filtering (equivalent to model number)
  if (filters['model-number']) {
    const modelNumbers = filters['model-number'].split(';').map(s => s.trim()).filter(Boolean);
    const modelConditions = modelNumbers.map(modelNumber => ({
      "VirtualProductID": { "$like": `%${modelNumber}%` }
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
    console.log('🏷️ Product category filter applied:', filters['product-category']);
    const categoryConditions = filters['product-category'].map(category => ({
      "CategoryID": { "$like": `%${category}%` }
    }));
    filterConditions.push({ "$or": categoryConditions });
    console.log('🔍 Category filter conditions (CategoryID):', categoryConditions);
  }

  // Application filtering (by Trade)
  if (filters['application'] && filters['application'].length > 0) {
    console.log('🔧 Application filter applied:', filters['application']);
    const applicationConditions = filters['application'].map(app => ({
      "Application": { "$like": `%${app}%` }
    }));
    filterConditions.push({ "$or": applicationConditions });
  }

  // Created date filtering
  if (filters['created'] && filters['created'].length > 0) {
    const now = new Date();
    const dateConditions = filters['created'].map(period => {
      let startDate;
      switch (period) {
        case 'last-week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last-month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last-3-months':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'last-6-months':
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case 'this-year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          return null;
      }
      if (startDate) {
        return { "OnlineDate": { "$gte": startDate.toISOString().split('T')[0] } };
      }
      return null;
    }).filter(Boolean);

    if (dateConditions.length > 0) {
      filterConditions.push({ "$or": dateConditions });
    }
  }

  // Online date filtering for new products (OnlineDate > 2025-01-01)
  if (filters['new-products'] === true) {
    filterConditions.push({
      "OnlineDate": { "$gt": "2025-01-01" }
    });
  }

  const filterString = JSON.stringify({ "$and": filterConditions });

  // Debug log for all filters
  console.log('🔍 GraphQL buildProductQuery filters:', {
    rawFilters: filters,
    filterConditions: filterConditions,
    finalFilterString: filterString
  });

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
          CustomerFacingProductCode
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
          OnlineDate        
          objectType
          EnrichmentStatus
          LifecycleStatus
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
 * Call GraphQL API to fetch product data
 * @param {Object} params - Query parameters
 * @param {string} brand - Brand code
 * @returns {Promise<Object>} Product data
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

    // Check for GraphQL errors
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return adaptGraphQLProductResponse(data);
  } catch (error) {
    console.error('Error fetching KENDO products:', error);

    // Return empty result instead of throwing error to keep UI stable
    return {
      list: [],
      totalSize: 0,
      startIndex: 0,
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

  console.log(`🌲 Category tree: Removed ${rootNodes.length} root nodes, returning ${allSubCategories.length} subcategories`);

  return allSubCategories;
};

/**
 * Fetch category taxonomy tree structure with batch loading
 * @returns {Promise<Array>} Tree structure array
 */
export const fetchCategoryTree = async () => {
  try {
    console.log(`🌳 Fetching category tree for ALL brands`);

    // Step 1: 先获取第一批数据和totalCount
    const batchSize = 100; // 每批加载100条
    const firstQuery = buildCategoryTaxonomyQuery(batchSize, 0);

    const firstResponse = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Pragma': 'no-cache',
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
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

    console.log('firstData', firstData);

    const totalCount = firstData.data?.getProductListing?.totalCount || 0;
    let allEdges = firstData.data?.getProductListing?.edges || [];

    console.log(`📊 Total category count: ${totalCount}, first batch: ${allEdges.length}`);

    // Step 2: 如果还有更多数据，分批加载
    if (totalCount > batchSize) {
      const batches = Math.ceil(totalCount / batchSize);
      console.log(`📦 Loading ${batches} batches...`);

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
              console.error(`GraphQL error in batch ${i}:`, data.errors);
              return [];
            }
            return data.data?.getProductListing?.edges || [];
          })
          .catch(error => {
            console.error(`Error loading batch ${i}:`, error);
            return [];
          });

        batchPromises.push(promise);
      }

      // 等待所有批次完成
      const batchResults = await Promise.all(batchPromises);

      // 合并所有edges
      batchResults.forEach((edges, index) => {
        console.log(`📦 Batch ${index + 2} loaded: ${edges.length} items`);
        allEdges = allEdges.concat(edges);
      });
    }

    console.log(`✅ Total edges loaded: ${allEdges.length}`);

    // Step 3: 转换为树形结构
    const tree = transformCategoryToTree(allEdges);
    console.log(`🌲 Built category tree with ${tree.length} subcategories`);

    return tree;
  } catch (error) {
    console.error('❌ Error fetching category tree:', error);
    return [];
  }
};

export default fetchKendoProducts; 