import CookieService from '../utils/cookieService';

const API_BASE_URL = '/api/email-api/base-email';
const EMAIL_TEMPLATE_API_URL = '/api/email-api/email-template';

class EmailApiService {
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
        return response.json();
    }

    /**
     * Create a new email template
     * @param {Object} emailData - Email template data
     * @returns {Promise} API response
     */
    async createEmailTemplate(emailData) {
        try {
            // Validate required fields
            this.validateEmailData(emailData);

            // Transform data to match API schema
            const apiData = this.transformToApiFormat(emailData);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(apiData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating email template:', error);
            throw new Error(error.message || 'Failed to create email template');
        }
    }

    /**
     * Update an existing email template
     * @param {string|number} templateId - Email template ID
     * @param {Object} emailData - Updated email template data
     * @returns {Promise} API response
     */
    async updateEmailTemplate(templateId, emailData) {
        try {
            // Validate required fields
            this.validateEmailData(emailData);

            // Transform data to match API schema
            const apiData = this.transformToApiFormat(emailData);

            const response = await fetch(`${this.baseURL}/${templateId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(apiData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error updating email template:', error);
            throw new Error(error.message || 'Failed to update email template');
        }
    }

    /**
     * Get email template by theme and tenant
     * @param {string} theme - Theme parameter
     * @param {string} tenant - Tenant parameter
     * @returns {Promise} API response
     */
    async getEmailTemplate(theme, tenant) {
        try {
            const response = await fetch(`${this.baseURL}/${theme}/${tenant}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching email template:', error);
            throw new Error(error.message || 'Failed to fetch email template');
        }
    }

    /**
     * Delete an email template
     * @param {string|number} templateId - Email template ID
     * @returns {Promise} API response
     */
    async deleteEmailTemplate(templateId) {
        try {
            const response = await fetch(`${this.baseURL}/${templateId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error deleting email template:', error);
            throw new Error(error.message || 'Failed to delete email template');
        }
    }

    /**
     * Get all email templates with pagination and search
     * @param {number} page - Page number (0-based)
     * @param {number} limit - Number of items per page
     * @param {string} search - Search query
     * @param {string} theme - Theme filter
     * @param {string} tenant - Tenant filter
     * @returns {Promise} API response
     */
    async getEmailTemplates(page = 0, limit = 10, search = '', theme = '', tenant = '') {
        try {
            const params = new URLSearchParams();

            if (theme) params.append('theme', theme);
            if (tenant) params.append('tenant', tenant);
            if (search) params.append('q', search);
            if (page > 0) params.append('page', page.toString());
            if (limit !== 10) params.append('limit', limit.toString());

            const url = `${this.baseURL}${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response);

            // Return data in expected format
            return {
                templates: Array.isArray(data) ? data : (data?.data || []),
                pagination: {
                    total: Array.isArray(data) ? data.length : (data?.total || 0),
                    pages: Math.ceil((Array.isArray(data) ? data.length : (data?.total || 0)) / limit),
                    currentPage: page,
                    limit: limit
                }
            };
        } catch (error) {
            console.error('Error fetching email templates:', error);
            throw new Error(error.message || 'Failed to fetch email templates');
        }
    }

    /**
     * Test email configuration
     * @param {Object} emailConfig - Email configuration to test
     * @returns {Promise} API response
     */
    async testEmailConfiguration(emailConfig) {
        try {
            const response = await fetch(`${this.baseURL}/test`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(emailConfig),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error testing email configuration:', error);
            throw new Error(error.message || 'Failed to test email configuration');
        }
    }

    /**
     * Transform internal data format to API format
     * @param {Object} emailData - Internal email data
     * @returns {Object} API-formatted data
     */
    transformToApiFormat(emailData) {
        const userInfo = CookieService.getUserInfo();
        const tenantName = userInfo?.tenant?.name || userInfo?.tenantName || 'default';

        return {
            theme: String(emailData.theme || ''),
            tenant: String(tenantName || ''),
            fromEmail: String(emailData.fromEmail || ''),
            port: Number(emailData.port || 0),
            ssl: Boolean(emailData.ssl || false),
            authRequired: Boolean(emailData.authRequired || false),
            username: String(emailData.username || ''),
            password: String(emailData.password || ''),
            host: String(emailData.host || '')
        };
    }

    /**
     * Validate email template data before submission
     * @param {Object} emailData - Email data to validate
     * @throws {Error} Validation error
     */
    validateEmailData(emailData) {
        const requiredFields = [
            'theme',
            'fromEmail',
            'host'
        ];

        const missingFields = requiredFields.filter(field => !emailData[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailData.fromEmail && !emailRegex.test(emailData.fromEmail)) {
            throw new Error('Invalid email format for fromEmail');
        }

        // Validate port number
        if (emailData.port && (parseInt(emailData.port) <= 0 || parseInt(emailData.port) > 65535)) {
            throw new Error('Port must be between 1 and 65535');
        }
    }

    /**
     * Get default email template data structure
     * @returns {Object} Default email data
     */
    getDefaultEmailData() {
        return {
            theme: '',
            tenant: '',
            fromEmail: '',
            port: 587,
            ssl: false,
            authRequired: false,
            username: '',
            password: '',
            host: ''
        };
    }

    /**
     * Get common email providers with default settings
     * @returns {Array} Email provider options
     */
    getEmailProviders() {
        return [
            {
                name: 'Gmail',
                host: 'smtp.gmail.com',
                port: 587,
                ssl: true,
                authRequired: true
            },
            {
                name: 'Outlook',
                host: 'smtp.live.com',
                port: 587,
                ssl: true,
                authRequired: true
            },
            {
                name: 'Yahoo',
                host: 'smtp.mail.yahoo.com',
                port: 587,
                ssl: true,
                authRequired: true
            },
            {
                name: 'Custom',
                host: '',
                port: 587,
                ssl: false,
                authRequired: false
            }
        ];
    }

    /**
     * Create a new email template (v2)
     * @param {Object} templateData - Email template data
     * @returns {Promise} API response
     */
    async createEmailTemplateV2(templateData) {
        try {
            const response = await fetch(EMAIL_TEMPLATE_API_URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(templateData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating email template:', error);
            throw new Error(error.message || 'Failed to create email template');
        }
    }

    /**
     * Get email template by ID
     * @param {string|number} templateId - Email template ID
     * @returns {Promise} API response
     */
    async getEmailTemplateById(templateId) {
        try {
            const response = await fetch(`${EMAIL_TEMPLATE_API_URL}/${templateId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching email template:', error);
            throw new Error(error.message || 'Failed to fetch email template');
        }
    }

    /**
     * Update email template by ID
     * @param {string|number} templateId - Email template ID
     * @param {Object} templateData - Updated template data
     * @returns {Promise} API response
     */
    async updateEmailTemplateById(templateId, templateData) {
        try {
            const response = await fetch(`${EMAIL_TEMPLATE_API_URL}/${templateId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(templateData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error updating email template:', error);
            throw new Error(error.message || 'Failed to update email template');
        }
    }

    /**
     * Get email templates by tenant
     * @param {string} tenant - Tenant name
     * @param {string} theme - Theme name
     * @param {string} lang - Language code
     * @returns {Promise} API response
     */
    async getEmailTemplatesByTenant(tenant, theme, lang) {
        try {
            // Build query parameters
            const params = new URLSearchParams();
            params.append('tenant', tenant);
            params.append('theme', theme);
            params.append('lang', lang);

            const response = await fetch(`${EMAIL_TEMPLATE_API_URL}/tenant-detail?${params.toString()}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching email templates by tenant:', error);
            throw new Error(error.message || 'Failed to fetch email templates');
        }
    }

    /**
     * Delete email template by ID
     * @param {string|number} templateId - Email template ID
     * @returns {Promise} API response
     */
    async deleteEmailTemplateById(templateId) {
        try {
            const response = await fetch(`${EMAIL_TEMPLATE_API_URL}/${templateId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error deleting email template:', error);
            throw new Error(error.message || 'Failed to delete email template');
        }
    }
}

export default new EmailApiService();
