import CookieService from '../utils/cookieService';

const API_BASE_URL = '/srv/v1/derivate/download';

class DownloadApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // 获取请求头
    getHeaders() {
        const token = CookieService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    // 处理401错误 - 重定向到登录页
    handleUnauthorizedError(status) {
        if (status === 401) {
            console.warn('🚨 Token expired or unauthorized access detected, redirecting to login...');

            // Get tenant info from user data before clearing
            const userInfo = CookieService.getUserInfo();
            const tenantName = userInfo?.tenant?.name || userInfo?.tenantName || 'Kendo';

            // Clear authentication data
            CookieService.clearAuth();

            // Build login redirect URL
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(Boolean);

            let theme = 'kendo';
            let locale = 'en';

            // Try to extract theme/locale info from current path
            if (pathSegments.length >= 2) {
                // Format: /:lang/:brand/:page
                locale = pathSegments[0] || 'en';
                theme = pathSegments[1] || 'kendo';
            } else if (pathSegments.length === 1) {
                // Format: /:tenant or /:lang
                const segment = pathSegments[0];
                if (segment.length === 2) {
                    // Likely a language code
                    locale = segment;
                } else {
                    // Likely a theme
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

    // 处理API响应
    async handleResponse(response) {
        if (!response.ok) {
            // Handle 401 Unauthorized errors
            if (this.handleUnauthorizedError(response.status)) {
                // Error was handled (redirect initiated)
                const error = new Error('Unauthorized - redirecting to login');
                error.status = 401;
                throw error;
            }

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // For download API, we return the response itself since it's a blob/buffer
        return response;
    }

    /**
     * Download media files with derivates using new API structure
     * @param {Array} mediaIds - Array of media IDs
     * @param {string} derivates - Comma-separated derivate names
     * @param {Object} customConfig - Optional custom configuration
     * @param {boolean} isAsync - Whether to send via email (true) or download directly (false)
     * @param {string} toEmail - Email address for async downloads
     * @param {string} ccEmail - CC email address
     * @returns {Promise<Blob>} File blob for download (if not async)
     */
    async massDownload(mediaIds, derivates, customConfig = null, isAsync = false, toEmail = '', ccEmail = '') {
        try {
            // Get user info for tenant and theme
            const userInfo = CookieService.getUserInfo();
            const tenant = userInfo?.tenant?.name || 'Kendo';

            // Get theme from current path or default
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(Boolean);
            let theme = 'kendo';
            if (pathSegments.length >= 2) {
                theme = pathSegments[1] || 'kendo';
            }

            // Build the new request payload structure
            const requestPayload = {
                tenant: tenant,
                theme: theme,
                mediaids: Array.isArray(mediaIds) ? mediaIds.join(',') : String(mediaIds),
                derivates: derivates,
                async: isAsync, // Convert boolean to string
                tomail: toEmail,
                ccemail: ccEmail,
                customConfiguration: customConfig ? true : false,
                // Custom configuration parameters
                height: customConfig?.height || '',
                width: customConfig?.width || '',
                ratio: customConfig?.ratio || '',
                colorSpace: customConfig?.colorSpace || '',
                format: customConfig?.format || '',
                dpi: customConfig?.dpi || '',
                compression: customConfig?.compression === 'none' ? '' : (customConfig?.compression || '')
            };

            const response = await fetch(`${this.baseURL}/mass-download`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                // Handle 401 Unauthorized errors
                if (this.handleUnauthorizedError(response.status)) {
                    throw new Error('Unauthorized - redirecting to login');
                }

                // Try to get error details from response
                try {
                    const errorData = await response.json();
                    const errorMessage = errorData.msg || errorData.message || `HTTP error! status: ${response.status}`;
                    throw new Error(errorMessage);
                } catch {
                    // If can't parse JSON, throw generic HTTP error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            // For async downloads, return success message instead of blob
            if (isAsync) {
                const result = await response.json().catch(() => ({}));
                return { success: true, message: 'Email will be sent with download link', result };
            }

            // For direct downloads, return the blob
            const blob = await response.blob();

            // Extract filename from content-disposition header if available
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'download.zip';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=(.+)/);
                if (filenameMatch) {
                    filename = filenameMatch[1].replace(/"/g, '');
                }
            }

            return { blob, filename };
        } catch (error) {
            console.error('Error downloading media:', error);
            throw new Error(error.message || 'Failed to download media');
        }
    }


    /**
     * Trigger browser download for a blob
     * @param {Blob} blob - File blob
     * @param {string} filename - Filename for download
     */
    triggerDownload(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Product Mass Download API
     * @param {Object} params - Download parameters
     * @param {string|string[]} params.modelNumber - Model number(s), can be string (comma-separated) or array
     * @param {string} params.tenant - Tenant name (defaults to user's tenant)
     * @param {string} params.theme - Theme name (defaults to current theme)
     * @param {string|string[]|number[]} params.publicationTemplates - Publication template IDs, can be string (comma-separated) or array
     * @param {string|string[]|number[]} params.setupsheetTemplates - Setup sheet template IDs, can be string (comma-separated) or array
     * @param {string|string[]|number[]} params.derivateList - Derivate IDs, can be string (comma-separated) or array
     * @param {string} params.language - Language name (e.g., "English UK")
     * @param {string} params.outputQuality - Output quality (web, print, etc.)
     * @param {string} params.tomail - Recipient email address
     * @param {string} params.ccemail - CC email address
     * @param {boolean} params.async - Whether to send via email (true) or download directly (false)
     * @returns {Promise<Object>} Download result
     */
    async productMassDownload(params) {
        try {
            const userInfo = CookieService.getUserInfo();
            const tenant = params.tenant || userInfo?.tenant?.name || 'Kendo';
            
            // Get theme from current path or params
            let theme = params.theme;
            if (!theme) {
                const currentPath = window.location.pathname;
                const pathSegments = currentPath.split('/').filter(Boolean);
                if (pathSegments.length >= 2) {
                    theme = pathSegments[1] || 'Kendo';
                } else {
                    theme = 'Kendo';
                }
            }

            // Helper function to convert array or string to comma-separated string
            const toCommaSeparated = (value) => {
                if (Array.isArray(value)) {
                    return value.join(',');
                }
                return String(value || '');
            };

            const requestPayload = {
                tenant: tenant,
                theme: theme,
                modelNumber: toCommaSeparated(params.modelNumber),
                publicationTemplates: toCommaSeparated(params.publicationTemplates),
                setupsheetTemplates: toCommaSeparated(params.setupsheetTemplates),
                derivateList: toCommaSeparated(params.derivateList),
                language: params.language || '',
                outputQuality: params.outputQuality || 'web',
                tomail: params.tomail || '',
                ccemail: params.ccemail || '',
                async: params.async || false
            };

            console.log('📦 Product Mass Download Request:', requestPayload);

            const response = await fetch('/srv/v1.0/main/mass-download/product', {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                // Handle 401 Unauthorized errors
                if (this.handleUnauthorizedError(response.status)) {
                    throw new Error('Unauthorized - redirecting to login');
                }

                // Try to get error details from response
                try {
                    const errorData = await response.json();
                    const errorMessage = errorData.msg || errorData.message || `HTTP error! status: ${response.status}`;
                    throw new Error(errorMessage);
                } catch {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            // For async downloads, return success message
            if (params.async) {
                const result = await response.json().catch(() => ({}));
                return { success: true, message: 'Email will be sent with download link', result };
            }

            // For direct downloads, return the blob
            const blob = await response.blob();

            // Extract filename from content-disposition header if available
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'product-mass-download.zip';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=(.+)/);
                if (filenameMatch) {
                    filename = filenameMatch[1].replace(/"/g, '');
                }
            }

            return { blob, filename };
        } catch (error) {
            console.error('❌ Error in product mass download:', error);
            throw new Error(error.message || 'Failed to download products');
        }
    }
}

export default new DownloadApiService();
