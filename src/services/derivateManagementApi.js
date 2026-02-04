import CookieService from '../utils/cookieService';

// Use the new derivate API proxy path
const API_BASE_URL = '/srv/v1/derivate/derivatelist';
const API_DERIVATE_BY_MODEL_URL = '/srv/v1/derivate/derivatelist/derivate-by-model-number';

class DerivateManagementApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.derivateByModelNumberURL = API_DERIVATE_BY_MODEL_URL;
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

            // Clear authentication data
            CookieService.clearAuth();

            // Build login redirect URL
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/').filter(Boolean);

            // Get tenant info from user data before clearing
            const userInfo = CookieService.getUserInfo();
            const tenantName = userInfo?.tenant?.name || userInfo?.tenantName || 'Kendo';

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
        return response.json();
    }

    /**
     * Get all derivates with pagination and search
     * @param {number} page - Page number (0-based)
     * @param {number} limit - Number of items per page
     * @param {string} search - Search query
     * @param {string} tenantId - Tenant ID (required by API)
     * @param {string} theme - Theme filter (required by API)
     * @returns {Promise} API response
     */
    // eslint-disable-next-line no-unused-vars
    async getDerivates(page = 0, limit = 10, search = '', tenantId = 'default', theme = '') {
        // Note: The API doesn't support pagination, so page and limit are not used
        try {
            // According to API spec, tenant and theme are required parameters
            const params = new URLSearchParams({
                'tenant': tenantId,
                'theme': theme || 'default'
            });

            // Add search functionality if needed (not in API spec but might be supported)
            if (search) {
                params.append('q', search);
            }

            const url = `${this.baseURL}?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);

            // Transform API response to match component expectations
            const derivatesWithMappedFields = Array.isArray(data) ? data.map((item) => this.mapApiResponseToComponent(item)) : [];

            // Return data in expected format
            return {
                derivates: derivatesWithMappedFields,
                pagination: {
                    total: derivatesWithMappedFields.length,
                    pages: 1, // API doesn't support pagination
                    currentPage: 0,
                    limit: derivatesWithMappedFields.length
                }
            };
        } catch (error) {
            console.error('Error fetching derivates:', error);
            throw new Error(error.message || 'Failed to fetch derivates');
        }
    }

    /**
     * Get derivates by model number - specifically for getting Adhoc derivates
     * @param {string} tenantId - Tenant ID
     * @param {string} theme - Theme
     * @param {string|Array} modelNumbers - Model number/ID or array of model numbers
     * @returns {Promise} API response with derivates
     */
    async getDerivatesByModelNumber(tenantId, theme, modelNumbers) {
        try {
            // Support both single model number and array of model numbers
            const idsString = Array.isArray(modelNumbers)
                ? modelNumbers.join(',')
                : String(modelNumbers);

            const params = new URLSearchParams({
                'tenant': tenantId,
                'theme': theme,
                'ids': idsString
            });

            const url = `${this.derivateByModelNumberURL}?${params.toString()}`;

            console.log('Calling derivate-by-model-number API with IDs:', idsString);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);

            // Transform API response to match component expectations
            const derivatesWithMappedFields = Array.isArray(data) ? data.map((item) => this.mapApiResponseToComponent(item)) : [];

            return derivatesWithMappedFields;
        } catch (error) {
            console.error('Error fetching derivates by model number:', error);
            // For 500 errors or other server issues, we should let the calling code handle fallback
            // Don't change the error message, let the caller decide what to do
            throw error;
        }
    }

    /**
     * Get a single derivate by ID
     * @param {string|number} derivateId - Derivate ID (integer according to OpenAPI)
     * @returns {Promise} API response
     */
    async getDerivateById(derivateId) {
        try {
            // Use the correct path parameter name as per OpenAPI spec
            const response = await fetch(`${this.baseURL}/${derivateId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching derivate:', error);
            throw new Error(error.message || 'Failed to fetch derivate');
        }
    }

    /**
     * Create a new derivate
     * @param {Object} derivateData - Derivate data
     * @returns {Promise} API response
     */
    async createDerivate(derivateData) {
        try {
            // Validate required fields
            this.validateDerivateData(derivateData);

            // Transform data to match API schema
            const apiData = this.transformToApiFormat(derivateData);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(apiData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating derivate:', error);
            throw new Error(error.message || 'Failed to create derivate');
        }
    }

    /**
     * Update an existing derivate
     * @param {string|number} derivateId - Derivate ID (integer according to OpenAPI)
     * @param {Object} derivateData - Updated derivate data
     * @returns {Promise} API response
     */
    async updateDerivate(derivateId, derivateData) {
        try {
            // Validate required fields
            this.validateDerivateData(derivateData);

            // Transform data to match API schema
            const apiData = this.transformToApiFormat(derivateData);

            const response = await fetch(`${this.baseURL}/${derivateId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(apiData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error updating derivate:', error);
            throw new Error(error.message || 'Failed to update derivate');
        }
    }

    /**
     * Delete a derivate
     * @param {string|number} derivateId - Derivate ID (integer according to OpenAPI)
     * @returns {Promise} API response
     */
    async deleteDerivate(derivateId) {
        try {
            // Use correct path parameter as per OpenAPI spec
            const response = await fetch(`${this.baseURL}/${derivateId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error deleting derivate:', error);
            throw new Error(error.message || 'Failed to delete derivate');
        }
    }

    /**
     * Copy/duplicate a derivate
     * @param {string} derivateId - Source derivate ID
     * @param {Object} overrideData - Data to override in the copy
     * @returns {Promise} API response
     */
    async copyDerivate(derivateId, overrideData = {}) {
        try {
            // First get the original derivate
            const originalDerivate = await this.getDerivateById(derivateId);

            // Create a copy with override data
            const copyData = {
                ...originalDerivate,
                ...overrideData,
                identifier: undefined, // Let backend generate new ID
                label: `${originalDerivate.label} (Copy)`,
            };

            return await this.createDerivate(copyData);
        } catch (error) {
            console.error('Error copying derivate:', error);
            throw new Error(error.message || 'Failed to copy derivate');
        }
    }

    /**
     * Get available themes
     * @returns {Promise} List of themes
     */
    async getAvailableThemes() {
        try {
            const response = await fetch('/apis/themes', {
                method: 'GET',
                headers: this.getHeaders(),
            });
            const data = await this.handleResponse(response);
            return data?.data?.map(theme => ({
                id: theme.id,
                name: theme.theme_name,
                key: theme.theme_key
            })) || [];
        } catch (error) {
            console.error('Error fetching themes:', error);
            throw new Error('Failed to fetch themes');
        }
    }

    /**
     * Map API response fields to component-expected fields
     * @param {Object} apiData - API response data
     * @returns {Object} Component-formatted data
     */
    mapApiResponseToComponent(apiData) {
        return {
            id: apiData.identifier, // Map identifier to id
            identifier: apiData.identifier,
            tenant: apiData.tenant,
            theme: apiData.theme,
            themeId: apiData.theme, // Map theme to themeId for compatibility
            label: apiData.label,
            derivateGroup: apiData.derivateGroup,
            prefix: apiData.prefix,
            postfix: apiData.postfix,
            width: apiData.width,
            height: apiData.height,
            dpi: apiData.dpi,
            derivateType: apiData.derivateType,
            crop: apiData.crop,
            fill: apiData.fill,
            ratio: apiData.ratio,
            compression: apiData.compression,
            publicLink: apiData.publicLink === 'true' || apiData.publicLink === true,
            allowedFileType: apiData.allowedFileType,
            preserveAlpha: apiData.preserveAlpha === 'true' || apiData.preserveAlpha === true,
            targetFormat: apiData.targetFormat,
            targetColorSpace: apiData.targetColorSpace,
            gravity: apiData.gravity,
            mediaType: apiData.mediaType,
            // Additional fields from API that might be needed
            // derivateSourceId: apiData.derivateSourceId,
            source: apiData.source || 'PIM' // Default to PIM if not provided
        };
    }

    /**
     * Transform internal data format to API format
     * According to API spec, all fields are strings
     * @param {Object} derivateData - Internal derivate data
     * @returns {Object} API-formatted data
     */
    transformToApiFormat(derivateData) {
        const userInfo = CookieService.getUserInfo();
        const tenantName = userInfo?.tenant?.name || 'default';
        return {
            // Use the exact field names from the API response
            tenant: String(tenantName || ''),
            theme: String(derivateData.themeId || derivateData.theme || ''),
            label: String(derivateData.label || ''),
            derivateGroup: String(derivateData.derivateGroup || ''),
            prefix: String(derivateData.prefix || ''),
            postfix: String(derivateData.postfix || ''),
            width: String(derivateData.width || ''),
            height: String(derivateData.height || ''),
            dpi: String(derivateData.dpi || ''),
            derivateType: derivateData.derivateType || null,
            crop: derivateData.crop || null,
            fill: derivateData.fill || null,
            ratio: derivateData.ratio || null,
            compression: derivateData.compression || null,
            publicLink: derivateData.publicLink || null,
            allowedFileType: Array.isArray(derivateData.allowedFileType)
                ? derivateData.allowedFileType.join(',')
                : String(derivateData.allowedFileType || ''),
            preserveAlpha: String(derivateData.preserveAlpha ? 'true' : 'false'),
            targetFormat: String(derivateData.targetFormat || ''),
            targetColorSpace: String(derivateData.targetColorSpace || ''),
            gravity: String(derivateData.gravity || ''),
            mediaType: Array.isArray(derivateData.mediaType)
                ? derivateData.mediaType.join(',')
                : String(derivateData.mediaType || '')
        };
    }

    /**
     * Validate derivate data before submission
     * @param {Object} derivateData - Derivate data to validate
     * @throws {Error} Validation error
     */
    validateDerivateData(derivateData) {
        const requiredFields = [
            'themeId',
            'label',
            'derivateGroup',
            'width',
            'height',
            'dpi',
            'targetFormat',
            'targetColorSpace',
            'gravity',
            'mediaType'
        ];

        const missingFields = requiredFields.filter(field => {
            const value = derivateData[field];
            return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // PNG + CMYK validation
        if (derivateData.targetFormat === 'png' && derivateData.targetColorSpace === 'CMYK') {
            throw new Error('CMYK PNG is not supported');
        }

        // Width and height should be positive numbers
        const width = parseInt(derivateData.width);
        const height = parseInt(derivateData.height);
        if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
            throw new Error('Width and height must be positive numbers');
        }

        // DPI should be valid
        const validDpis = ['72', '150', '300'];
        if (!validDpis.includes(String(derivateData.dpi))) {
            throw new Error('DPI must be one of: 72, 150, 300');
        }
    }

    /**
     * Get default derivate data structure
     * @returns {Object} Default derivate data
     */
    getDefaultDerivateData() {
        const userInfo = CookieService.getUserInfo();
        const tenantName = userInfo?.tenant?.name || 'default';

        return {
            tenant: tenantName,
            theme: '',
            themeId: '', // Keep for compatibility
            label: '',
            derivateGroup: 'Adhoc',
            prefix: '',
            postfix: '',
            width: '1800',
            height: '1800',
            dpi: '72',
            derivateType: null,
            crop: null,
            fill: null,
            ratio: null,
            compression: null,
            publicLink: null,
            allowedFileType: 'jpg,psd,eps,tiff,png',
            mediaType: 'Main,On White',
            preserveAlpha: 'true',
            targetFormat: 'png',
            targetColorSpace: 'RGB',
            gravity: 'Center',
        };
    }

    /**
     * Get source options
     * @returns {Array} Source options
     */
    getSourceOptions() {
        return ['PIM', 'DAM', 'Adhoc'];
    }

    /**
     * Get group options
     * @returns {Array} Group options
     */
    getGroupOptions() {
        return ['Standard', 'Adhoc'];
    }

    /**
     * Get DPI options
     * @returns {Array} DPI options
     */
    getDpiOptions() {
        return ['72', '150', '300'];
    }

    /**
     * Get ratio options
     * @returns {Array} Ratio options
     */
    getRatioOptions() {
        return [
            { value: null, label: 'Original' },
            { value: 'crop', label: 'Crop' },
            { value: 'fill', label: 'Fill' },
            { value: 'adjust-transparent', label: 'Adjust - Transparent' }
        ];
    }

    /**
     * Get compression options
     * @returns {Array} Compression options
     */
    getCompressionOptions() {
        return [
            { value: null, label: 'No Compression' },
            { value: 'lzw', label: 'LZW Compression' }
        ];
    }

    /**
     * Get target format options
     * @returns {Array} Target format options
     */
    getTargetFormatOptions() {
        return ['png', 'jpeg', 'tiff'];
    }

    /**
     * Get target color space options
     * @returns {Array} Color space options
     */
    getTargetColorSpaceOptions() {
        return ['RGB', 'CMYK'];
    }

    /**
     * Get gravity options
     * @returns {Array} Gravity options
     */
    getGravityOptions() {
        return [
            'NorthWest', 'North', 'NorthEast',
            'West', 'Center', 'East',
            'SouthWest', 'South', 'SouthEast'
        ];
    }

    /**
     * Get allowed file type options
     * @returns {Array} File type options
     */
    getAllowedFileTypeOptions() {
        return ['eps', 'psd', 'jpg', 'png', 'tiff'];
    }

    /**
     * Get media type options
     * @returns {Array} Media type options
     */
    getMediaTypeOptions() {
        return [
            'Main', 'OnWhite', 'Lifestyle', 'Action',
            'InScene', 'Logo', 'Icon', 'Picto'
        ];
    }
}

export default new DerivateManagementApiService();
