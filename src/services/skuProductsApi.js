// SKU Products GraphQL API service

const GRAPHQL_API_URL = 'https://pim-test.kendo.com/pimcore-graphql-webservices/ProductList';
const API_KEY = '2e853497a0d1269aa7bb493d241c91a2';

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

        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Accept-Language': 'en,zh;q=0.9,zh-CN;q=0.8',
                'Connection': 'keep-alive',
                'Origin': 'https://pim-test.kendo.com',
                'Referer': 'https://pim-test.kendo.com/pimcore-datahub-webservices/explorer/ProductList?apikey=2e853497a0d1269aa7bb493d241c91a2',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                'X-API-Key': API_KEY,
                'accept': '*/*',
                'content-type': 'application/json',
                'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
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
