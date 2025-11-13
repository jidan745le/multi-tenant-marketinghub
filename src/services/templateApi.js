import CookieService from '../utils/cookieService';

class TemplateApiService {
    constructor() {
        this.baseURL = '/srv/v1/main/publication/templates';
    }

    // 获取租户名称
    getTenantName() {
        const userInfo = CookieService.getUserInfo();
        return userInfo?.tenant?.name || '';
    }

    // 从 URL 路径获取主题
    getThemeFromUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 2) {
            // Format: /:lang/:brand/:page
            return pathSegments[1] || 'kendo';
        } else if (pathSegments.length === 1) {
            const segment = pathSegments[0];
            // 如果不是语言代码（长度为2），则可能是主题
            if (segment.length !== 2) {
                return segment.toLowerCase();
            }
        }

        return ''; // 默认主题
    }

    // 获取模板列表
    async getTemplates() {
        try {
            const token = CookieService.getToken();
            const tenant = this.getTenantName();
            const theme = this.getThemeFromUrl();

            const url = `${this.baseURL}?tenant=${encodeURIComponent(tenant)}&theme=${encodeURIComponent(theme)}`;

            console.log('🔍 Fetching templates with params:', { tenant, theme, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Templates API response:', data);

            return data;
        } catch (error) {
            console.error('❌ Error fetching templates:', error);
            throw error;
        }
    }

    /**
     * 根据ID获取模板详情
     * @param {string|number} id - 模板ID
     * @returns {Promise<Object>} 模板详情
     */
    async getTemplateById(id) {
        try {
            const token = CookieService.getToken();
            const url = `${this.baseURL}/${id}`;

            console.log('🔍 Fetching template by ID:', id);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Template details:', data);

            return data;
        } catch (error) {
            console.error('❌ Error fetching template by ID:', error);
            throw error;
        }
    }

    /**
     * 创建模板
     * @param {Object} metadata - 模板元数据
     * @param {string} metadata.name - 模板名称
     * @param {string} metadata.label - 模板标签
     * @param {string} metadata.type - 模板类型 (如 "REPORT")
     * @param {number} metadata.templateTypeId - 模板类型ID
     * @param {string} metadata.templateId - 模板ID
     * @param {string} metadata.html - HTML内容
     * @param {string} metadata.css - CSS样式
     * @param {string} metadata.description - 描述
     * @param {boolean} metadata.usageInternal - 内部使用
     * @param {boolean} metadata.usageExternal - 外部使用
     * @param {string} metadata.createdBy - 创建者
     * @param {string} metadata.updatedBy - 更新者
     * @param {File} pdfExample - PDF示例文件 (可选)
     * @param {File} icon - 图标文件 (可选)
     * @returns {Promise<Object>} 创建结果
     */
    async createTemplate(metadata, pdfExample = null, icon = null) {
        try {
            const token = CookieService.getToken();
            const tenant = this.getTenantName();
            const theme = this.getThemeFromUrl();

            // 自动填充 tenant 和 theme
            const fullMetadata = {
                ...metadata,
                tenant: metadata.tenant || tenant,
                theme: metadata.theme || theme,
            };

            // 创建 FormData
            const formData = new FormData();
            
            // 添加 metadata (JSON 字符串)
            formData.append('metadata', JSON.stringify(fullMetadata));

            // 添加可选文件
            if (pdfExample) {
                formData.append('pdfExample', pdfExample);
            }

            if (icon) {
                formData.append('icon', icon);
            }

            console.log('🔍 Creating template with metadata:', fullMetadata);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                    // 注意：不要手动设置 Content-Type，让浏览器自动设置 multipart/form-data 边界
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Template created successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error creating template:', error);
            throw error;
        }
    }

    /**
     * 更新模板
     * @param {string|number} id - 模板ID
     * @param {Object} metadata - 模板元数据
     * @param {File} pdfExample - PDF示例文件 (可选)
     * @param {File} icon - 图标文件 (可选)
     * @returns {Promise<Object>} 更新结果
     */
    async updateTemplate(id, metadata, pdfExample = null, icon = null) {
        try {
            const token = CookieService.getToken();
            const url = `${this.baseURL}/${id}`;

            // 创建 FormData
            const formData = new FormData();
            
            // 添加 metadata (JSON 字符串)
            formData.append('metadata', JSON.stringify(metadata));

            // 添加可选文件
            if (pdfExample) {
                formData.append('pdfExample', pdfExample);
            }

            if (icon) {
                formData.append('icon', icon);
            }

            console.log('🔍 Updating template:', { id, metadata });

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                    // 注意：不要手动设置 Content-Type，让浏览器自动设置 multipart/form-data 边界
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Template updated successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error updating template:', error);
            throw error;
        }
    }

    /**
     * 下载模板资源
     * @param {string|number} id - 模板ID
     * @param {string} assetType - 资源类型 ('pdf-example', 'css', 'html', 'icon')
     * @returns {Promise<Blob>} 文件 Blob 对象
     */
    async downloadTemplateAsset(id, assetType) {
        try {
            const token = CookieService.getToken();
            const url = `${this.baseURL}/${id}/assets/${assetType}`;

            console.log('🔍 Downloading template asset:', { id, assetType });

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            console.log('✅ Asset downloaded successfully:', { assetType, size: blob.size });

            return blob;
        } catch (error) {
            console.error('❌ Error downloading template asset:', error);
            throw error;
        }
    }

    /**
     * 下载模板资源并触发浏览器下载
     * @param {string|number} id - 模板ID
     * @param {string} assetType - 资源类型 ('pdf-example', 'css', 'html', 'icon')
     * @param {string} filename - 保存的文件名 (可选)
     */
    async downloadTemplateAssetAsFile(id, assetType, filename = null) {
        try {
            const blob = await this.downloadTemplateAsset(id, assetType);
            
            // 生成默认文件名
            if (!filename) {
                const extension = {
                    'pdf-example': 'pdf',
                    'css': 'css',
                    'html': 'html',
                    'icon': 'png'
                }[assetType] || 'file';
                filename = `template-${id}-${assetType}.${extension}`;
            }

            // 创建下载链接
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('✅ File download triggered:', filename);
        } catch (error) {
            console.error('❌ Error triggering file download:', error);
            throw error;
        }
    }
}

export default new TemplateApiService();

