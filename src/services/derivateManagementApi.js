import CookieService from '../utils/cookieService';

// Use the new derivate API proxy path
const API_BASE_URL = '/api/derivate-api/derivatelist';

class DerivateManagementApiService {
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

    // 处理API响应
    async handleResponse(response) {
        if (!response.ok) {
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
        // Note: The OpenAPI spec doesn't support pagination, so page and limit are not used
        try {
            // According to OpenAPI spec, tenant-id and theme are required parameters
            const params = new URLSearchParams({
                'tenant-id': tenantId,
                'theme': theme || 'default'
            });

            // Add search functionality if needed (not in OpenAPI spec but might be supported)
            if (search) {
                params.append('q', search);
            }

            const url = `${this.baseURL}?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);

            // Return data in expected format
            return {
                derivates: Array.isArray(data) ? data : (data?.data || []),
                pagination: {
                    total: Array.isArray(data) ? data.length : (data?.total || 0),
                    pages: 1, // API doesn't seem to support pagination
                    currentPage: 0,
                    limit: Array.isArray(data) ? data.length : (data?.data?.length || 0)
                }
            };
        } catch (error) {
            console.error('Error fetching derivates:', error);
            throw new Error(error.message || 'Failed to fetch derivates');
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
     * Transform internal data format to API format
     * According to OpenAPI spec, all fields are strings
     * @param {Object} derivateData - Internal derivate data
     * @returns {Object} API-formatted data
     */
    transformToApiFormat(derivateData) {
        const userInfo = CookieService.getUserInfo();
        const tenantName = userInfo?.tenant?.name || 'default';
        return {
            derivateSourceId: String(derivateData.derivateSourceId || ''),
            source: String(derivateData.source || ''),
            customerId: String(tenantName || ''),
            themeId: String(derivateData.themeId || ''),
            label: String(derivateData.label || ''),
            derivateGroup: String(derivateData.derivateGroup || ''),
            prefix: String(derivateData.prefix || ''),
            postfix: String(derivateData.postfix || ''),
            width: String(derivateData.width || ''),
            height: String(derivateData.height || ''),
            dpi: String(derivateData.dpi || ''),
            derivateType: String(derivateData.derivateType || ''),
            crop: String(derivateData.crop || ''),
            fill: String(derivateData.fill || ''),
            ratio: String(derivateData.ratio || ''),
            compression: String(derivateData.compression || ''),
            publicLink: String(derivateData.publicLink ? 'true' : 'false'),
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

        const missingFields = requiredFields.filter(field => !derivateData[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // PNG + CMYK validation
        if (derivateData.targetFormat === 'png' && derivateData.targetColorSpace === 'CMYK') {
            throw new Error('CMYK PNG is not supported');
        }

        // Width and height should be positive numbers
        if (parseInt(derivateData.width) <= 0 || parseInt(derivateData.height) <= 0) {
            throw new Error('Width and height must be positive numbers');
        }

        // DPI should be valid
        const validDpis = ['72', '150', '300'];
        if (!validDpis.includes(derivateData.dpi)) {
            throw new Error('DPI must be one of: 72, 150, 300');
        }
    }

    /**
     * Get default derivate data structure
     * @returns {Object} Default derivate data
     */
    getDefaultDerivateData() {
        return {
            derivateSourceId: '',
            source: 'PIM',
            themeId: '',
            label: '',
            derivateGroup: 'Standard',
            prefix: '',
            postfix: '',
            width: '',
            height: '',
            dpi: '72',
            ratio: null,
            compression: null,
            publicLink: false,
            allowedFileType: ['eps', 'psd', 'jpg', 'png', 'tiff'],
            mediaType: ['Main'],
            preserveAlpha: true,
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
            'Main', 'On White', 'Lifestyle', 'Action',
            'In Scene', 'Logo', 'Icon', 'Picto'
        ];
    }
}

export default new DerivateManagementApiService();
