import CookieService from '../utils/cookieService';

const API_BASE_URL = '/api/derivate-api/download';

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
     * Download media files with derivates
     * @param {Array} mediaIds - Array of media IDs
     * @param {string} derivates - Comma-separated derivate names
     * @param {Object} customConfig - Optional custom configuration
     * @returns {Promise<Blob>} File blob for download
     */
    async massDownload(mediaIds, derivates, customConfig = null) {
        try {
            // Build the download request payload
            const downloadRequests = mediaIds.map(mediaId => ({
                mediaId: mediaId,
                prefix: customConfig?.prefix || "",
                postfix: customConfig?.postfix || "",
                width: customConfig?.width || "",
                height: customConfig?.height || "",
                density: customConfig?.dpi || "",
                crop: customConfig?.crop || "",
                background: customConfig?.background || "",
                alpha: customConfig?.preserveAlpha || "",
                format: customConfig?.format || "",
                colorSpace: customConfig?.colorSpace || "",
                gravity: customConfig?.gravity || "",
                ratio: customConfig?.ratio || "",
                compression: customConfig?.compression || ""
            }));

            // For mass download, we'll use the first media ID and include derivates
            const requestPayload = {
                ...downloadRequests[0], // Use first media config as base
                derivates: derivates
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Return the blob for download
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
}

export default new DownloadApiService();
