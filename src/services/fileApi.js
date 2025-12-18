import CookieService from '../utils/cookieService';

/**
 * 文件 API 服务类
 * 处理所有与文件相关的 API 调用
 */
class FileApiService {
    constructor() {
        this.baseURL = '/srv/v1.0/main/files';
    }

    /**
     * 构建请求头
     * @param {boolean} includeContentType 
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
     * 上传文件
     * @param {File} file - 要上传的文件对象
     * @param {string} uploadUrl - 上传接口URL
     * @returns {Promise<Object>} 上传响应对象，通常包含文件ID等信息
     */
    async uploadFile(file, uploadUrl = '/srv/v1.0/main/files/upload') {
        try {
            if (!file) {
                throw new Error('File is required');
            }

            if (!(file instanceof File)) {
                throw new Error('Invalid file object. Expected File instance.');
            }

            // 创建 FormData
            const formData = new FormData();
            formData.append('file', file);

            console.log('🔍 Uploading file:', { 
                name: file.name, 
                size: file.size, 
                type: file.type,
                url: uploadUrl 
            });

            // 获取请求头
            const token = CookieService.getToken();
            const headers = {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ File uploaded successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 更新文件
     * @param {string} fileId - 文件ID
     * @param {File} file - 要更新的文件对象
     * @param {string} baseUrl - 文件服务基础URL
     * @returns {Promise<Object>} 更新响应对象
     */
    async updateFile(fileId, file, baseUrl = '/srv/v1.0/main/files') {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            if (!file) {
                throw new Error('File is required');
            }

            if (!(file instanceof File)) {
                throw new Error('Invalid file object. Expected File instance.');
            }

            // 创建 FormData
            const formData = new FormData();
            formData.append('file', file);

            const url = `${baseUrl}/${fileId}`;

            console.log('🔍 Updating file:', { 
                fileId,
                name: file.name, 
                size: file.size, 
                type: file.type,
                url: url 
            });

            // 获取请求头
            const token = CookieService.getToken();
            const headers = {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${token}`,
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ File updated successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error updating file:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 获取文件元数据和预览URL
     * @param {string} fileId - 文件ID
     * @param {string} endpoint - API端点
     * @returns {Promise<{previewUrl: string, fileName: string}>} 如果是图片，返回预览URL和文件名；否则返回空的预览URL和文件名
     */
    async getFileMetadata(fileId, endpoint = '/srv/v1.0/main/files/') {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            console.log('🔍 Downloading file:', fileId);

            const response = await fetch(`${endpoint}${fileId}`, {
                method: 'GET',
                headers: this.getHeaders(false), // 不包含 Content-Type
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            // 从 Content-Disposition 头提取文件名
            const disposition = response.headers.get('Content-Disposition');
            let fileName = 'downloaded-file'; // 默认文件名
            
            if (disposition) {
                if (disposition.includes('attachment') || disposition.includes('inline')) {
                    const matches = /filename="?([^"]*)"?.*?/i.exec(disposition);
                    if (matches?.[1]) {
                        fileName = matches[1];
                    }
                }
            }

            const contentType = response.headers.get('Content-Type') || '';
            
            // 直接返回文件的实际URL，而不是创建blob URL
            const fileUrl = `${endpoint}${fileId}`;

            // 判断是否为图片
            if (contentType.startsWith('image/')) {
                console.log('✅ Image preview ready:', { fileName, contentType });
                return { previewUrl: fileUrl, fileName };
            } else {
                // 对于非图片，返回空的预览URL
                console.log('✅ Non-image file processed:', { fileName, contentType });
                return { previewUrl: "", fileName };
            }
        } catch (error) {
            console.error('❌ Error downloading/previewing file:', error);
            throw error;
        }
    }

    /**
     * 获取文件详情
     * @param {string} fileId - 文件ID
     * @param {string} baseUrl - 文件服务基础URL
     * @returns {Promise<Object>} 文件详情对象
     */
    async getFileDetails(fileId, baseUrl = '/srv/v1.0/main/files') {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            const url = `${baseUrl}/${fileId}/details`;

            console.log('🔍 Fetching file details:', { fileId, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const data = await response.json();
            console.log('✅ File details fetched successfully:', data);

            return data;
        } catch (error) {
            console.error('❌ Error fetching file details:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * 下载文件
     * @param {string} fileId - 文件ID
     * @param {string} baseUrl - 文件服务基础URL
     * @returns {Promise<Blob>} 文件 Blob 对象
     */
    async downloadFile(fileId, baseUrl = '/srv/v1.0/main/files') {
        try {
            if (!fileId) {
                throw new Error('File ID is required');
            }

            const url = `${baseUrl}/${fileId}`;

            console.log('🔍 Downloading file:', { fileId, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(false), // 不包含 Content-Type
            });

            if (!response.ok) {
                throw await this.handleError(response);
            }

            const blob = await response.blob();
            console.log('✅ File downloaded successfully:', { 
                fileId, 
                size: blob.size, 
                type: blob.type 
            });

            return blob;
        } catch (error) {
            console.error('❌ Error downloading file:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
}

export default new FileApiService();

