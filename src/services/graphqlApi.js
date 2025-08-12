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

  // Product category filtering
  if (filters['category-name'] && filters['category-name'].length > 0) {
    const categoryConditions = filters['category-name'].map(category => ({
      "CategoryName": { "$like": `%${category}%` }
    }));
    filterConditions.push({ "$or": categoryConditions });
  }

  // Online date filtering for new products (OnlineDate > 2025-01-01)
  if (filters['new-products'] === true) {
    filterConditions.push({
      "OnlineDate": { "$gt": "2025-01-01" }
    });
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
           OnlineDate
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

export default fetchKendoProducts; 