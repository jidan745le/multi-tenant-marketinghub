// SKU Products GraphQL API service
import CookieService from '../utils/cookieService';

const GRAPHQL_API_URL = '/apis/kendo/products';
const API_KEY = '4fe5b9cb2dc6015250c46f9332c195ae';

/**
 * Build GraphQL query to fetch SKU products by VirtualProductID
 * @param {string} virtualProductId - Virtual Product ID to search for
 * @param {number} first - Number of items to fetch
 * @param {number} after - Offset
 * @returns {string} GraphQL query string
 */
const buildSKUQuery = (virtualProductId, first = 12, after = 0) => {
    // Build filter for SKU products with specific VirtualProductID
    const filter = {
        "VirtualProductID": { "$like": virtualProductId },
        "objectType": { "$like": "sku" }
    };

    const filterString = JSON.stringify(filter);

    console.log('🔍 SKU Query Filter:', {
        virtualProductId,
        filter,
        filterString
    });

    return `{
    getProductListing(first: ${first}, after: ${after}, filter: "${filterString.replace(/"/g, '\\"')}") {
      totalCount
      edges {
        cursor
        __typename
        node {
          id
          Brand
          VirtualProductID
          CustomerFacingProductCode
          objectType
        }
      }
    }
  }`;
};

/**
 * Fetch SKU products by VirtualProductID
 * @param {string} virtualProductId - Virtual Product ID to search for
 * @returns {Promise<Object>} SKU products data
 */
export const fetchSKUProducts = async (virtualProductId) => {
    try {
        console.log(`🔍 Fetching SKU products for VirtualProductID: ${virtualProductId}`);

        const query = buildSKUQuery(virtualProductId);
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

        console.log('✅ SKU products GraphQL response received:', data);

        // Extract SKU products from response
        const skuProducts = data?.data?.getProductListing?.edges || [];

        console.log(`📦 Found ${skuProducts.length} SKU products for VirtualProductID: ${virtualProductId}`);

        return {
            skuProducts: skuProducts.map(edge => edge.node),
            totalCount: data?.data?.getProductListing?.totalCount || 0
        };

    } catch (error) {
        console.error('❌ Error fetching SKU products:', error);

        // Return empty result instead of throwing error to keep UI stable
        return {
            skuProducts: [],
            totalCount: 0,
            error: error.message
        };
    }
};

export default fetchSKUProducts;
