// API client for handling HTTP requests with authentication
import CookieService from './cookieService';

class ApiClient {
    constructor() {
        this.baseURL = '/apis'; // This will be proxied to the actual API server
    }

    /**
     * Handle 401 Unauthorized errors by redirecting to login page
     * @param {Error} error - The error object
     */
    handleUnauthorizedError(error) {
        if (error.response?.status === 401) {
            console.warn('🚨 Token expired or unauthorized access detected, redirecting to login...');

            // Clear authentication data
            CookieService.clearAuth();

            // Build login redirect URL
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(Boolean);

            let tenantName = 'Kendo';
            let theme = 'kendo';
            let locale = 'en';

            // Try to extract tenant/theme info from current path
            if (pathSegments.length >= 2) {
                // Format: /:lang/:brand/:page
                locale = pathSegments[0] || 'en';
                theme = pathSegments[1] || 'kendo';
                tenantName = pathSegments[1]?.charAt(0).toUpperCase() + pathSegments[1]?.slice(1) || 'Kendo';
            } else if (pathSegments.length === 1) {
                // Format: /:tenant or /:lang
                const segment = pathSegments[0];
                if (segment.length === 2) {
                    // Likely a language code
                    locale = segment;
                } else {
                    // Likely a tenant name
                    tenantName = segment.charAt(0).toUpperCase() + segment.slice(1);
                    theme = segment.toLowerCase();
                }
            }

            // Redirect to login page
            const loginUrl = `/${tenantName}/Login?theme=${theme}&locale=${locale}`;
            console.log('🔄 Redirecting to login:', loginUrl);
            window.location.href = loginUrl;

            return true; // Indicates the error was handled
        }
        return false; // Error was not handled
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
            // If it's already our custom error, check for 401 and handle it
            if (error.response) {
                // Handle 401 Unauthorized errors
                if (this.handleUnauthorizedError(error)) {
                    // Error was handled (redirect initiated), don't re-throw
                    return Promise.reject(error);
                }
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
