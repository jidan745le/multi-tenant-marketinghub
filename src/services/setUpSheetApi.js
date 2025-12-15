import CookieService from '../utils/cookieService';

/**
 * SetupSheet API 服务类
 */
class SetUpSheetApiService {
    constructor() {
        this.baseURL = '/srv/v1.0/main/setupsheet';
    }

    /**
     * 获取租户
     * @returns {string} 租户
     */
    getTenantName() {
        const userInfo = CookieService.getUserInfo();
        return userInfo?.tenant?.name || userInfo?.tenantName || '';
    }

    /**
     * 获取主题
     * @returns {string} 主题
     */
    getThemeFromUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 2) {
            // Format: /:lang/:brand/:page
            return pathSegments[1] || 'kendo';
        } else if (pathSegments.length === 1) {
            const segment = pathSegments[0];
            if (segment.length !== 2) {
                return segment.toLowerCase();
            }
        }

        return 'kendo'; // 默认主题
    }

    /**
     * 构建请求头
     * @param {boolean} includeContentType - 是否包含 Content-Type
     * @returns {Object} 请求头对象
     */
    getHeaders(includeContentType = true) {
        const token = CookieService.getToken();
        const headers = {
            'accept': 'application/hal+json',
            'Authorization': `Bearer ${token}`,
        };
        
        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }
        
        return headers;
    }

    /**
     * 处理 API 响应错误
     * @param {Response} response - fetch 响应对象
     * @returns {Promise<Error>} 错误对象
     */
    async handleError(response) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            // 尝试多种可能的错误消息字段
            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData.message) {
                // 确保 message 是字符串
                errorMessage = typeof errorData.message === 'string' 
                    ? errorData.message 
                    : JSON.stringify(errorData.message);
            } else if (errorData.error) {
                errorMessage = typeof errorData.error === 'string' 
                    ? errorData.error 
                    : JSON.stringify(errorData.error);
            } else if (errorData.errors && Array.isArray(errorData.errors)) {
                errorMessage = errorData.errors.map(e => 
                    typeof e === 'string' ? e : (typeof e === 'object' && e.message ? e.message : JSON.stringify(e))
                ).join(', ');
            } else if (errorData.detail) {
                errorMessage = typeof errorData.detail === 'string'
                    ? errorData.detail
                    : JSON.stringify(errorData.detail);
            } else if (Object.keys(errorData).length > 0) {
                errorMessage = JSON.stringify(errorData);
            }
        } catch {
            try {
                const text = await response.text();
                if (text) {
                    errorMessage = text;
                }
            } catch (textError) {
                console.error('Failed to parse error response:', textError);
            }
        }
        return new Error(errorMessage);
    }

    /**
     * 创建渠道
     * @param {Object} channelData - 渠道数据
     * @param {string} channelData.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} channelData.theme - 主题（可选，默认从 URL 获取）
     * @param {string} channelData.name - 渠道名称（必需）
     * @param {string} channelData.iconId - 图标ID（可选）
     * @param {string} channelData.description - 描述（可选）
     * @param {string[]} channelData.usage - 使用方式数组，如 ["internal", "external"]（可选）
     * @param {string} channelData.templateType - 模板类型，如 "Global" 或 "Specific"（可选）
     * @returns {Promise<Object>} 创建的渠道对象
     * @example
     * await setUpSheetApi.createChannel({
     *   name: "Alibaba Updated",
     *   iconId: "fc6e5675-8f5c-4e6d-8fbb-653a803ba478",
     *   description: "Some description",
     *   usage: ["internal", "external"],
     *   templateType: "Global"
     * });
     */
    async createChannel(channelData) {
        try {
            if (!channelData || !channelData.name) {
                throw new Error('Channel name is required');
            }

            const tenant = channelData.tenant || this.getTenantName();
            const theme = channelData.theme || this.getThemeFromUrl();

            // 构建请求数据
            const requestData = {
                tenant: tenant,
                theme: theme,
                name: channelData.name,
            };

            // 添加可选字段
            if (channelData.iconId) {
                requestData.iconId = channelData.iconId;
            }

            if (channelData.description) {
                requestData.description = channelData.description;
            }

            if (channelData.usage && Array.isArray(channelData.usage)) {
                requestData.usage = channelData.usage;
            }

            if (channelData.templateType) {
                requestData.templateType = channelData.templateType;
            }

            const url = `${this.baseURL}/channel`;

            console.log('🔍 Creating channel with data:', requestData);

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ Channel created successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error creating channel:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 更新渠道
     * @param {Object} channelData - 渠道数据
     * @param {number|string} channelData.id - 渠道ID（必需）
     * @param {string} channelData.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} channelData.theme - 主题（可选，默认从 URL 获取）
     * @param {string} channelData.name - 渠道名称（可选）
     * @param {string} channelData.iconId - 图标ID（可选）
     * @param {string} channelData.description - 描述（可选）
     * @param {string|null} channelData.channelType - 渠道类型（可选）
     * @param {string} channelData.channelUsage - 渠道使用方式，如 "internal,external"（可选）
     * @param {string} channelData.templateType - 模板类型，如 "Global" 或 "Specific"（可选）
     * @returns {Promise<Object>} 更新后的渠道对象
     * @example
     * await setUpSheetApi.updateChannel({
     *   id: 3,
     *   name: "Alibaba Updated1",
     *   iconId: "fc6e5675-8f5c-4e6d-8fbb-653a803ba478",
     *   description: "Some description",
     *   channelType: null,
     *   channelUsage: "internal,external",
     *   templateType: "Global"
     * });
     */
    async updateChannel(channelData) {
        try {
            if (!channelData || channelData.id === undefined || channelData.id === null) {
                throw new Error('Channel ID is required');
            }

            const tenant = channelData.tenant || this.getTenantName();
            const theme = channelData.theme || this.getThemeFromUrl();

            // 构建请求数据
            const requestData = {
                id: channelData.id,
                tenant: tenant,
                theme: theme,
            };

            // 添加可选字段
            if (channelData.name !== undefined) {
                requestData.name = channelData.name;
            }

            if (channelData.iconId !== undefined) {
                requestData.iconId = channelData.iconId;
            }

            if (channelData.description !== undefined) {
                requestData.description = channelData.description;
            }

            if (channelData.channelType !== undefined) {
                requestData.channelType = channelData.channelType;
            }

            if (channelData.channelUsage !== undefined) {
                requestData.channelUsage = channelData.channelUsage;
            }

            if (channelData.templateType !== undefined) {
                requestData.templateType = channelData.templateType;
            }

            const url = `${this.baseURL}/channel`;

            console.log('🔍 Updating channel with data:', requestData);

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ Channel updated successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error updating channel:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 获取渠道列表
     * @param {Object} options - 查询选项
     * @param {string} options.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} options.theme - 主题（可选，默认从 URL 获取）
     * @returns {Promise<Array>} 渠道数组
     * @example
     * await setUpSheetApi.getChannels();
     * await setUpSheetApi.getChannels({ tenant: 'Kendo', theme: 'Kendo' });
     */
    async getChannels(options = {}) {
        try {
            const tenant = options.tenant || this.getTenantName();
            const theme = options.theme || this.getThemeFromUrl();
            
            const params = new URLSearchParams();
            if (tenant) params.append('tenant', tenant);
            if (theme) params.append('theme', theme);

            const url = `${this.baseURL}/channel?${params.toString()}`;

            console.log('🔍 Fetching channels with params:', { tenant, theme, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            
            // 处理返回的数据：可能是数组或对象
            const channels = Array.isArray(data) ? data : (data._embedded?.channels || data.content || []);
            
            console.log('✅ Channels fetched successfully:', channels.length);

            return channels;
        } catch (error) {
            console.error('❌ Error fetching channels:', error);
            throw error;
        }
    }

    /**
     * 获取渠道类型列表
     * @param {Object} options - 查询选项
     * @param {string} options.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} options.theme - 主题（可选，默认从 URL 获取）
     * @param {string} options.language - 语言（可选，默认 'en_GB'）
     * @returns {Promise<Array>} 渠道类型数组
     * @example
     * await setUpSheetApi.getChannelTypes();
     * await setUpSheetApi.getChannelTypes({ tenant: 'Kendo', theme: 'Kendo', language: 'en_GB' });
     */
    async getChannelTypes(options = {}) {
        try {
            const tenant = options.tenant || this.getTenantName();
            const theme = options.theme || this.getThemeFromUrl();
            const language = options.language || 'en_GB';
            
            const params = new URLSearchParams();
            if (tenant) params.append('tenant', tenant);
            if (theme) params.append('theme', theme);
            if (language) params.append('language', language);

            const url = `${this.baseURL}/channel/types?${params.toString()}`;

            console.log('🔍 Fetching channel types with params:', { tenant, theme, language, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            
            // 处理返回的数据：可能是数组或对象
            const channelTypes = Array.isArray(data) ? data : (data._embedded?.channelTypes || data.content || []);
            
            console.log('✅ Channel types fetched successfully:', channelTypes.length);

            return channelTypes;
        } catch (error) {
            console.error('❌ Error fetching channel types:', error);
            throw error;
        }
    }

    /**
     * 创建设置表模板
     * @param {Object} templateData - 模板数据
     * @param {string} templateData.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} templateData.theme - 主题（可选，默认从 URL 获取）
     * @param {number} templateData.channelId - 渠道ID（必需）
     * @param {string} templateData.name - 模板名称（必需）
     * @param {string} templateData.description - 描述（可选）
     * @param {string} templateData.templateType - 模板类型，如 "Flat"（可选）
     * @param {Array<Object>} templateData.templateDataDetails - 模板数据详情数组（可选）
     * @param {number} templateData.templateDataDetails[].worksheet - 工作表编号
     * @param {number} templateData.templateDataDetails[].firstDataColumn - 第一个数据列
     * @param {number} templateData.templateDataDetails[].firstDataRow - 第一个数据行
     * @param {number} templateData.templateDataDetails[].lastDataColumn - 最后一个数据列
     * @param {string} templateData.fileId - 文件ID（可选）
     * @returns {Promise<Object>} 创建的模板对象
     * @example
     * await setUpSheetApi.createTemplate({
     *   channelId: 2,
     *   name: "Kendo_Setup_Sheet_Flat",
     *   description: "Flat set up sheet template for kendo theme",
     *   templateType: "Flat",
     *   templateDataDetails: [{
     *     worksheet: 1,
     *     firstDataColumn: 0,
     *     firstDataRow: 2,
     *     lastDataColumn: 50
     *   }],
     *   fileId: "fef6d728-c2c0-4585-9285-ab8087e8267f"
     * });
     */
    async createTemplate(templateData) {
        try {
            if (!templateData || !templateData.name) {
                throw new Error('Template name is required');
            }

            if (templateData.channelId === undefined || templateData.channelId === null) {
                throw new Error('Channel ID is required');
            }

            const tenant = templateData.tenant || this.getTenantName();
            const theme = templateData.theme || this.getThemeFromUrl();

            // 构建请求数据
            const requestData = {
                tenant: tenant,
                theme: theme,
                channelId: templateData.channelId,
                name: templateData.name,
            };

            // 添加可选字段
            if (templateData.description) {
                requestData.description = templateData.description;
            }

            if (templateData.templateType) {
                requestData.templateType = templateData.templateType;
            }

            if (templateData.templateDataDetails && Array.isArray(templateData.templateDataDetails)) {
                requestData.templateDataDetails = templateData.templateDataDetails;
            }

            if (templateData.fileId) {
                requestData.fileId = templateData.fileId;
            }

            const url = `${this.baseURL}/template`;

            console.log('🔍 Creating template with data:', requestData);

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ Template created successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error creating template:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 更新设置表模板
     * @param {Object} templateData - 模板数据
     * @param {string} templateData.id - 模板ID（必需）
     * @param {string} templateData.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} templateData.theme - 主题（可选，默认从 URL 获取）
     * @param {number} templateData.channelId - 渠道ID（可选）
     * @param {string} templateData.name - 模板名称（可选）
     * @param {string} templateData.description - 描述（可选）
     * @param {string} templateData.templateType - 模板类型，如 "Flat"（可选）
     * @param {Array<Object>} templateData.templateDataDetails - 模板数据详情数组（可选）
     * @param {number} templateData.templateDataDetails[].worksheet - 工作表编号
     * @param {number} templateData.templateDataDetails[].firstDataColumn - 第一个数据列
     * @param {number} templateData.templateDataDetails[].firstDataRow - 第一个数据行
     * @param {number} templateData.templateDataDetails[].lastDataColumn - 最后一个数据列
     * @param {string} templateData.fileId - 文件ID（可选）
     * @returns {Promise<Object>} 更新后的模板对象
     * @example
     * await setUpSheetApi.updateTemplate({
     *   id: "a75d1866-8ed7-48a5-a06f-6643326559a5",
     *   channelId: 2,
     *   name: "Kendo_Setup_Sheet_Flat",
     *   description: "Flat set up sheet template for kendo theme",
     *   templateType: "Flat",
     *   templateDataDetails: [{
     *     worksheet: 1,
     *     firstDataColumn: 0,
     *     firstDataRow: 2,
     *     lastDataColumn: 50
     *   }],
     *   fileId: "351d2144-f2df-43fd-9447-09af9a15d226"
     * });
     */
    async updateTemplate(templateData) {
        try {
            if (!templateData || !templateData.id) {
                throw new Error('Template ID is required');
            }

            const tenant = templateData.tenant || this.getTenantName();
            const theme = templateData.theme || this.getThemeFromUrl();

            // 构建请求数据
            const requestData = {
                id: templateData.id,
                tenant: tenant,
                theme: theme,
            };

            // 添加可选字段
            if (templateData.channelId !== undefined) {
                requestData.channelId = templateData.channelId;
            }

            if (templateData.name !== undefined) {
                requestData.name = templateData.name;
            }

            if (templateData.description !== undefined) {
                requestData.description = templateData.description;
            }

            if (templateData.templateType !== undefined) {
                requestData.templateType = templateData.templateType;
            }

            if (templateData.templateDataDetails !== undefined && Array.isArray(templateData.templateDataDetails)) {
                requestData.templateDataDetails = templateData.templateDataDetails;
            }

            if (templateData.fileId !== undefined) {
                requestData.fileId = templateData.fileId;
            }

            const url = `${this.baseURL}/template`;

            console.log('🔍 Updating template with data:', requestData);

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ Template updated successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error updating template:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 获取设置表模板列表
     * @param {Object} options - 查询选项
     * @param {string} options.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} options.theme - 主题（可选，默认从 URL 获取）
     * @param {number} options.channelId - 渠道ID（可选，筛选特定渠道的模板）
     * @returns {Promise<Array>} 模板数组
     * @example
     * await setUpSheetApi.getTemplates();
     * await setUpSheetApi.getTemplates({ theme: 'Kendo' });
     * await setUpSheetApi.getTemplates({ tenant: 'Kendo', theme: 'Kendo', channelId: 2 });
     */
    async getTemplates(options = {}) {
        try {
            const tenant = options.tenant || this.getTenantName();
            const theme = options.theme || this.getThemeFromUrl();
            
            const params = new URLSearchParams();
            if (tenant) params.append('tenant', tenant);
            if (theme) params.append('theme', theme);
            if (options.channelId !== undefined && options.channelId !== null) {
                params.append('channelId', options.channelId);
            }

            const url = `${this.baseURL}/template?${params.toString()}`;

            console.log('🔍 Fetching templates with params:', { tenant, theme, channelId: options.channelId, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            
            // 处理返回的数据：可能是数组或对象
            const templates = Array.isArray(data) ? data : (data._embedded?.templates || data.content || []);
            
            console.log('✅ Templates fetched successfully:', templates.length);

            return templates;
        } catch (error) {
            console.error('❌ Error fetching templates:', error);
            throw error;
        }
    }

    /**
     * 删除渠道
     * @param {number|string} id - 渠道ID（必需）
     * @returns {Promise<void>}
     * @example
     * await setUpSheetApi.deleteChannel(1);
     */
    async deleteChannel(id) {
        try {
            if (id === undefined || id === null) {
                throw new Error('Channel ID is required');
            }

            const url = `${this.baseURL}/channel/${id}`;

            console.log('🔍 Deleting channel:', id);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            // DELETE 请求可能没有响应体，尝试解析 JSON，如果失败则忽略
            try {
                const data = await response.json();
                console.log('✅ Channel deleted successfully:', data);
                return data;
            } catch {
                // 如果没有响应体，只记录成功消息
                console.log('✅ Channel deleted successfully:', id);
            }
        } catch (error) {
            console.error('❌ Error deleting channel:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 删除设置表模板
     * @param {string} id - 模板ID（必需）
     * @returns {Promise<void>}
     * @example
     * await setUpSheetApi.deleteTemplate("a75d1866-8ed7-48a5-a06f-6643326559a5");
     */
    async deleteTemplate(id) {
        try {
            if (id === undefined || id === null) {
                throw new Error('Template ID is required');
            }

            const url = `${this.baseURL}/template/${id}`;

            console.log('🔍 Deleting template:', id);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw await this.handleError(response);
            }

            // DELETE 请求可能没有响应体，尝试解析 JSON，如果失败则忽略
            try {
                const data = await response.json();
                console.log('✅ Template deleted successfully:', data);
                return data;
            } catch {
                // 如果没有响应体，只记录成功消息
                console.log('✅ Template deleted successfully:', id);
            }
        } catch (error) {
            console.error('❌ Error deleting template:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
}

export default new SetUpSheetApiService();

