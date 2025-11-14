/**
 * Product List REST API Service
 * 
 * 这个service将GraphQL实现迁移到REST API
 * 保持与原有fetchKendoProductsAPI完全相同的接口
 */

import CookieService from '../utils/cookieService';

const API_BASE_URL = "/srv/v1/main";

/**
 * Fetch product list from backend REST API
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Page size (默认20)
 * @param {number} params.offset - Offset (默认0)
 * @param {string} params.product-name - Product name filter
 * @param {string} params.model-number - Model numbers (semicolon separated)
 * @param {string} params.ean - EAN codes (semicolon separated)
 * @param {string[]} params.product-type - Product type array
 * @param {string[]} params.product-category - Category ID array
 * @param {string[]} params.application - Application array
 * @param {string[]} params.created - Created date range array
 * @param {boolean} params.new-products - New products only
 * 
 * @param {string} brand - Brand code (kendo, ego, milwaukee, etc.)
 * 
 * @returns {Promise<Object>} Product list response
 * @returns {number} return.startIndex - Start index
 * @returns {number} return.totalSize - Total count
 * @returns {number} return.pageSize - Page size
 * @returns {Array} return.list - Product array
 */
export const fetchProductList = async (params = {}, brand = 'kendo') => {
    try {
        // 从params中提取分页和筛选参数
        const { limit = 20, offset = 0, ...filters } = params;

        // 构建请求体（完全兼容后端API schema）
        const requestBody = {
            brand: brand,
            pagination: {
                limit: limit,
                offset: offset
            },
            filters: filters
        };

        // 获取认证token
        const token = CookieService.getToken();

        // 调用REST API
        const response = await fetch(`${API_BASE_URL}/products/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(requestBody)
        });

        // 处理HTTP错误
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                // 无法解析错误响应，使用默认错误消息
            }

            throw new Error(errorMessage);
        }

        // 解析成功响应
        const result = await response.json();

        // 验证响应格式
        if (!result.list || !Array.isArray(result.list)) {
            return {
                startIndex: 0,
                totalSize: 0,
                pageSize: 0,
                list: []
            };
        }

        // 返回标准格式（与GraphQL实现完全一致）
        return {
            startIndex: result.startIndex || 0,
            totalSize: result.totalSize || 0,
            pageSize: result.pageSize || limit,
            list: result.list || []
        };
    } catch (error) {
        // 返回空结果，保持UI稳定（与GraphQL实现一致）
        return {
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: [],
            error: error.message
        };
    }
};

/**
 * 批量获取产品（按型号）
 * 
 * @param {string[]} modelNumbers - Model number array
 * @param {string} brand - Brand code
 * @returns {Promise<Object>} Product list response
 */
export const fetchProductsByModelNumbers = async (modelNumbers = [], brand = 'kendo') => {
    if (!modelNumbers || modelNumbers.length === 0) {
        return {
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: []
        };
    }

    // 将数组转换为分号分隔的字符串
    const modelNumberString = modelNumbers.join(';');

    return fetchProductList({
        limit: modelNumbers.length, // 设置足够大的limit
        offset: 0,
        'model-number': modelNumberString
    }, brand);
};

/**
 * 批量获取产品（按EAN）
 * 
 * @param {string[]} eanCodes - EAN code array
 * @param {string} brand - Brand code
 * @returns {Promise<Object>} Product list response
 */
export const fetchProductsByEAN = async (eanCodes = [], brand = 'kendo') => {
    if (!eanCodes || eanCodes.length === 0) {
        return {
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: []
        };
    }

    // 将数组转换为分号分隔的字符串
    const eanString = eanCodes.join(';');

    return fetchProductList({
        limit: eanCodes.length,
        offset: 0,
        'ean': eanString
    }, brand);
};

export default fetchProductList;

