import CookieService from '../utils/cookieService';

/**
 * 模板 API 服务类
 * 处理所有与模板相关的 API 调用
 */
class TemplateApiService {
    constructor() {
        this.baseURL = '/srv/v1/main/publication/templates';
    }

    /**
     * 获取租户名称
     * @returns {string} 租户名称
     */
    getTenantName() {
        const userInfo = CookieService.getUserInfo();
        return userInfo?.tenant?.name || userInfo?.tenantName || '';
    }

    /**
     * 从 URL 路径获取主题
     * @returns {string} 主题名称
     */
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

        return 'kendo'; // 默认主题
    }

    /**
     * 获取当前用户信息
     * @returns {string} 用户名
     */
    getCurrentUser() {
        const userInfo = CookieService.getUserInfo();
        return userInfo?.username || userInfo?.name || userInfo?.email || 'system';
    }

    /**
     * 标准化 usage 数组（首字母大写）
     * @param {string[]} usage - usage 数组
     * @returns {string[]} 标准化后的数组
     */
    normalizeUsage(usage) {
        if (!Array.isArray(usage)) {
            return [];
        }
        return usage.map(item => {
            if (typeof item === 'string') {
                return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
            }
            return item;
        });
    }

    /**
     * 构建请求头
     * @param {boolean} includeContentType - 是否包含 Content-Type（multipart/form-data 时不应包含）
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
                // 如果 errorData 是对象但没有常见字段，尝试序列化整个对象
                errorMessage = JSON.stringify(errorData);
            }
        } catch {
            // 如果响应不是 JSON，尝试获取文本
            try {
                const text = await response.text();
                if (text) {
                    errorMessage = text;
                }
            } catch (textError) {
                // 忽略，使用默认错误消息
                console.error('Failed to parse error response:', textError);
            }
        }
        return new Error(errorMessage);
    }

    /**
     * 获取模板列表
     * @param {Object} options - 查询选项
     * @param {string} options.tenant - 租户名称（可选，默认从 Cookie 获取）
     * @param {string} options.theme - 主题（可选，默认从 URL 获取）
     * @param {number} options.templateTypeId - 模板类型ID（可选，筛选特定类型）
     * @returns {Promise<Array>} 模板数组
     */
    async getTemplates(options = {}) {
        try {
            const tenant = options.tenant || this.getTenantName();
            const theme = options.theme || this.getThemeFromUrl();
            
            const params = new URLSearchParams();
            if (tenant) params.append('tenant', tenant);
            if (theme) params.append('theme', theme);
            if (options.templateTypeId) params.append('templateTypeId', options.templateTypeId);

            const url = `${this.baseURL}?${params.toString()}`;

            console.log('🔍 Fetching templates with params:', { tenant, theme, url });

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
     * 根据ID获取模板详情
     * @param {string|number} id - 模板ID
     * @returns {Promise<Object>} 模板详情对象
     * @example
     * {
     *   id: 1,
     *   name: "Template Name",
     *   description: "Template description",
     *   usage: ["internal", "external"],
     *   typeId: 1,
     *   typeName: "Catalog",
     *   templateTypeId: 1,
     *   templateTypeName: "Specific",
     *   tenant: "Kendo",
     *   theme: "Kendo",
     *   ...
     * }
     */
    async getTemplateById(id) {
        try {
            if (!id) {
                throw new Error('Template ID is required');
            }

            const url = `${this.baseURL}/${id}`;

            console.log('🔍 Fetching template by ID:', id);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ Template details fetched:', data);

            return data;
        } catch (error) {
            console.error('❌ Error fetching template by ID:', error);
            throw error;
        }
    }

    /**
     * 创建模板
     * @param {Object} metadata - 模板元数据
     * @param {string} metadata.name - 模板名称（必需）
     * @param {string} metadata.description - 描述
     * @param {string[]} metadata.usage - 使用方式数组，如 ["internal", "external"] 或 ["Internal", "External"]
     * @param {number} metadata.typeId - 类型ID（如 Catalog=1, Shelfcard=2, DataSheet=3, Flyer=4）
     * @param {string} metadata.typeName - 类型名称（如 "Catalog", "Shelfcard"）
     * @param {number} metadata.templateTypeId - 模板类型ID（1=Specific, 2=Global）
     * @param {string} metadata.templateId - 模板ID（可选，系统可自动生成）
     * @param {string} metadata.html - HTML内容
     * @param {string} metadata.css - CSS样式
     * @param {number} metadata.parentId - 父模板ID（用于复制模板）
     * @param {boolean} metadata.pdfPerModel - PDF是否按模型生成
     * @param {string} metadata.tenant - 租户名称（可选，自动填充）
     * @param {string} metadata.theme - 主题（可选，自动填充）
     * @param {File} pdfExample - PDF示例文件 (可选)
     * @param {File} icon - 图标文件 (可选)
     * @returns {Promise<Object>} 创建的模板对象
     */
    async createTemplate(metadata, pdfExample = null, icon = null) {
        try {
            if (!metadata || !metadata.name) {
                throw new Error('Template name is required');
            }

            const tenant = this.getTenantName();
            const theme = this.getThemeFromUrl();
            const currentUser = this.getCurrentUser();

            // 标准化 usage 数组
            const normalizedUsage = this.normalizeUsage(metadata.usage || []);

            // 构建完整的元数据
            const fullMetadata = {
                name: metadata.name,
                description: metadata.description || '',
                usage: normalizedUsage,
                typeId: metadata.typeId || null,
                typeName: metadata.typeName || null,
                templateTypeId: metadata.templateTypeId,
                templateId: metadata.templateId || null,
                html: metadata.html || '',
                css: metadata.css || '',
                parentId: metadata.parentId || null,
                pdfPerModel: metadata.pdfPerModel || false,
                tenant: metadata.tenant || tenant,
                theme: metadata.theme || theme,
                createdBy: metadata.createdBy || currentUser,
                updatedBy: metadata.updatedBy || currentUser,
            };

            // 创建 FormData
            const formData = new FormData();


            console.log('🔍 Full metadata:', fullMetadata);
            
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
            console.log('📎 Files:', { 
                pdfExample: pdfExample ? pdfExample.name : null, 
                icon: icon ? icon.name : null 
            });

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.getHeaders(false), // multipart/form-data 不需要 Content-Type
                body: formData
            });

            console.log('🔍 Response:', response);

            if (!response.ok) {
                // 记录详细的错误信息
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
     * 更新模板
     * @param {string|number} id - 模板ID
     * @param {Object} metadata - 模板元数据（只包含需要更新的字段）
     * @param {File} pdfExample - PDF示例文件 (可选，传入 null 表示不更新)
     * @param {File} icon - 图标文件 (可选，传入 null 表示不更新)
     * @returns {Promise<Object>} 更新后的模板对象
     */
    async updateTemplate(id, metadata, pdfExample = null, icon = null) {
        try {
            if (!id) {
                throw new Error('Template ID is required');
            }

            const url = `${this.baseURL}/${id}`;
            const currentUser = this.getCurrentUser();

            // 标准化 usage 数组（如果提供）
            if (metadata.usage) {
                metadata.usage = this.normalizeUsage(metadata.usage);
            }

            // 添加更新者信息
            const updateMetadata = {
                ...metadata,
                updatedBy: metadata.updatedBy || currentUser,
            };

            // 创建 FormData
            const formData = new FormData();
            
            // 添加 metadata (JSON 字符串)
            formData.append('metadata', JSON.stringify(updateMetadata));

            // 添加可选文件（如果提供）
            if (pdfExample !== null) {
                if (pdfExample instanceof File) {
                    formData.append('pdfExample', pdfExample);
                }
            }

            if (icon !== null) {
                if (icon instanceof File) {
                    formData.append('icon', icon);
                }
            }

            console.log('🔍 Updating template:', { id, metadata: updateMetadata });

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(false), // multipart/form-data 不需要 Content-Type
                body: formData
            });

            if (!response.ok) {
                throw await this.handleError(response);
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
     * 删除模板
     * @param {string|number} id - 模板ID
     * @returns {Promise<void>}
     */
    async deleteTemplate(id) {
        try {
            if (!id) {
                throw new Error('Template ID is required');
            }

            const url = `${this.baseURL}/${id}`;

            console.log('🔍 Deleting template:', id);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            console.log('✅ Template deleted successfully:', id);
        } catch (error) {
            console.error('❌ Error deleting template:', error);
            throw error;
        }
    }

    /**
     * 复制模板（基于现有模板创建新模板）
     * @param {string|number} sourceId - 源模板ID
     * @param {Object} overrides - 要覆盖的字段（如新的名称、描述等）
     * @param {File} pdfExample - 新的PDF示例文件 (可选)
     * @param {File} icon - 新的图标文件 (可选)
     * @returns {Promise<Object>} 新创建的模板对象
     */
    async copyTemplate(sourceId, overrides = {}, pdfExample = null, icon = null) {
        try {
            // 获取源模板
            const sourceTemplate = await this.getTemplateById(sourceId);

            // 构建新模板的元数据
            const newMetadata = {
                name: overrides.name || `${sourceTemplate.name} (Copy)`,
                description: overrides.description || sourceTemplate.description,
                usage: overrides.usage || sourceTemplate.usage || [],
                typeId: overrides.typeId || sourceTemplate.typeId,
                typeName: overrides.typeName || sourceTemplate.typeName,
                templateTypeId: overrides.templateTypeId || sourceTemplate.templateTypeId,
                templateId: overrides.templateId || null,
                html: overrides.html || sourceTemplate.html || '',
                css: overrides.css || sourceTemplate.css || '',
                parentId: sourceId, // 设置父模板ID
                pdfPerModel: overrides.pdfPerModel !== undefined ? overrides.pdfPerModel : sourceTemplate.pdfPerModel,
            };

            // 如果没有提供新的文件，尝试下载源模板的文件
            let pdfFile = pdfExample;
            let iconFile = icon;

            // 下载逻辑已注释
            // if (!pdfFile && sourceTemplate.pdfFileId) {
            //     try {
            //         const pdfBlob = await this.downloadTemplateAsset(sourceId, 'pdf-example');
            //         pdfFile = new File([pdfBlob], `template-${sourceId}-pdf.pdf`, { type: 'application/pdf' });
            //     } catch (e) {
            //         console.warn('Could not download source PDF:', e);
            //     }
            // }

            // if (!iconFile && sourceTemplate.iconFileId) {
            //     try {
            //         const iconBlob = await this.downloadTemplateAsset(sourceId, 'icon');
            //         iconFile = new File([iconBlob], `template-${sourceId}-icon.png`, { type: 'image/png' });
            //     } catch (e) {
            //         console.warn('Could not download source icon:', e);
            //     }
            // }

            // 创建新模板
            return await this.createTemplate(newMetadata, pdfFile, iconFile);
        } catch (error) {
            console.error('❌ Error copying template:', error);
            throw error;
        }
    }

    /**
     * 下载模板资源
     * @param {string|number} id - 模板ID
     * @param {string} assetType - 资源类型 ('pdf-example', 'css', 'html', 'icon')
     * @returns {Promise<Blob>} 文件 Blob 对象
     */
    // async downloadTemplateAsset(id, assetType) {
    //     try {
    //         if (!id) {
    //             throw new Error('Template ID is required');
    //         }

    //         const validAssetTypes = ['pdf-example', 'css', 'html', 'icon'];
    //         if (!validAssetTypes.includes(assetType)) {
    //             throw new Error(`Invalid asset type. Must be one of: ${validAssetTypes.join(', ')}`);
    //         }

    //         const url = `${this.baseURL}/${id}/assets/${assetType}`;

    //         console.log('🔍 Downloading template asset:', { id, assetType });

    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: this.getHeaders(),
    //         });

    //         if (!response.ok) {
    //             throw await this.handleError(response);
    //         }

    //         const blob = await response.blob();
    //         console.log('✅ Asset downloaded successfully:', { assetType, size: blob.size });

    //         return blob;
    //     } catch (error) {
    //         console.error('❌ Error downloading template asset:', error);
    //         throw error;
    //     }
    // }

    /**
     * 下载模板资源并触发浏览器下载
     * @param {string|number} id - 模板ID
     * @param {string} assetType - 资源类型 ('pdf-example', 'css', 'html', 'icon')
     * @param {string} filename - 保存的文件名 (可选，默认根据模板ID和资源类型生成)
     */
    // async downloadTemplateAssetAsFile(id, assetType, filename = null) {
    //     try {
    //         const blob = await this.downloadTemplateAsset(id, assetType);
            
    //         // 生成默认文件名
    //         if (!filename) {
    //             const extensionMap = {
    //                 'pdf-example': 'pdf',
    //                 'css': 'css',
    //                 'html': 'html',
    //                 'icon': 'png'
    //             };
    //             const extension = extensionMap[assetType] || 'file';
    //             filename = `template-${id}-${assetType}.${extension}`;
    //         }

    //         // 创建下载链接
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = filename;
    //         link.style.display = 'none';
    //         document.body.appendChild(link);
    //         link.click();
            
    //         // 清理
    //         setTimeout(() => {
    //             document.body.removeChild(link);
    //             window.URL.revokeObjectURL(url);
    //         }, 100);

    //         console.log('✅ File download triggered:', filename);
    //     } catch (error) {
    //         console.error('❌ Error triggering file download:', error);
    //         throw error;
    //     }
    // }

    /**
     * 获取模板类型映射
     * @returns {Object} 类型ID到名称的映射
     */
    getTypeMap() {
        return {
            1: 'Catalog',
            2: 'Shelfcard',
            3: 'DataSheet',
            4: 'Flyer',
        };
    }

    /**
     * 获取模板类型名称
     * @param {number} typeId - 类型ID
     * @returns {string} 类型名称
     */
    getTypeName(typeId) {
        const typeMap = this.getTypeMap();
        return typeMap[typeId] || 'Unknown';
    }

    /**
     * 获取模板类型ID
     * @param {string} typeName - 类型名称
     * @returns {number|null} 类型ID
     */
    getTypeId(typeName) {
        const typeMap = this.getTypeMap();
        for (const [id, name] of Object.entries(typeMap)) {
            if (name.toLowerCase() === typeName.toLowerCase()) {
                return parseInt(id, 10);
            }
        }
        return null;
    }
}

export default new TemplateApiService();

