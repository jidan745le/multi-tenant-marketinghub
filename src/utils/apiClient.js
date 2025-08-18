// API client for handling HTTP requests with authentication
import CookieService from './cookieService';

class ApiClient {
    constructor() {
        this.baseURL = '/apis'; // This will be proxied to the actual API server
    }

    /**
     * Make an HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Response>} Fetch response
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = CookieService.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authorization header if token exists
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);

            // Handle non-OK responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const error = new Error(errorData?.message || `HTTP ${response.status}`);
                error.response = {
                    status: response.status,
                    data: errorData
                };
                throw error;
            }

            return response;
        } catch (error) {
            // If it's already our custom error, re-throw it
            if (error.response) {
                throw error;
            }

            // For network errors or other fetch failures
            const networkError = new Error('Network error or server unavailable');
            networkError.response = {
                status: 0,
                data: { message: error.message }
            };
            throw networkError;
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    async get(endpoint, options = {}) {
        const response = await this.request(endpoint, {
            method: 'GET',
            ...options,
        });
        return response.json();
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {any} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    async post(endpoint, data, options = {}) {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
        return response.json();
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {any} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    async put(endpoint, data, options = {}) {
        const response = await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        });
        return response.json();
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    async delete(endpoint, options = {}) {
        const response = await this.request(endpoint, {
            method: 'DELETE',
            ...options,
        });
        return response.json();
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
