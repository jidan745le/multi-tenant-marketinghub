// Strapi API 配置更新服务

const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
const token = import.meta.env.VITE_STRAPI_TOKEN;

/**
 * 通用的Strapi API请求函数
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} API响应
 */
const strapiRequest = async (endpoint, options = {}) => {
    try {
        if (!baseUrl || !token) {
            throw new Error('Strapi配置缺失：请检查环境变量');
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Strapi API request failed:', error);
        throw error;
    }
};

/**
 * 刷新Redux中的主题数据
 * @param {Function} dispatch - Redux dispatch函数
 * @returns {Promise<void>}
 */
export const refreshThemeData = async (dispatch) => {
    try {
        if (!baseUrl || !token) {
            console.warn('Strapi配置缺失，跳过数据刷新');
            return;
        }

        const response = await fetch(`${baseUrl}/api/themes?populate[0]=theme_colors&populate[1]=theme_logo&populate[2]=menu&populate[3]=menu.menu_l2&populate[4]=languages&populate[5]=theme_logos.favicon&populate[6]=theme_logos.onwhite_logo&populate[7]=theme_logos.oncolor_logo&populate[8]=login&populate[9]=pages.content_area&populate[10]=pages.content_area.home_page_widget_list.image&populate[11]=pages.content_area.link_list&populate[12]=pages.content_area.contact&populate[13]=pages.content_area.link_list.link_icon&populate[14]=pages.content_area.contact.profile_pic&populate[15]=fallback_image&populate[16]=legal&populate[17]=communication&populate[18]=socialprofile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            // 动态导入fetchThemes action
            const { fetchThemes } = await import('../store/slices/themesSlice');
            dispatch(fetchThemes.fulfilled(result));
        }
    } catch (error) {
        console.error('刷新主题数据失败:', error);
    }
};

/**
 * 获取指定主题的数据
 * @param {string} documentId - 主题documentId
 * @returns {Promise<Object>} 主题数据
 */
export const getTheme = async (documentId) => {
    return await strapiRequest(`/api/themes/${documentId}?populate[0]=communication&populate[1]=legal&populate[2]=socialprofile`);
};

/**
 * 更新主题的communication配置
 * @param {string} documentId - 主题documentId
 * @param {Object} communicationData - 通信配置数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateCommunication = async (documentId, communicationData) => {
    return await strapiRequest(`/api/themes/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: {
                communication: communicationData
            }
        })
    });
};

/**
 * 更新主题的legal配置
 * @param {string} documentId - 主题documentId
 * @param {Object} legalData - 法律文档数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateLegal = async (documentId, legalData) => {
    return await strapiRequest(`/api/themes/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: {
                legal: legalData
            }
        })
    });
};

/**
 * 更新主题的socialprofile配置
 * @param {string} documentId - 主题documentId
 * @param {Object} socialProfileData - 社交媒体配置数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateSocialProfile = async (documentId, socialProfileData) => {
    return await strapiRequest(`/api/themes/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: {
                socialprofile: socialProfileData
            }
        })
    });
};

/**
 * 批量更新主题配置
 * @param {string} documentId - 主题documentId
 * @param {Object} updateData - 需要更新的数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateThemeConfig = async (documentId, updateData) => {
    return await strapiRequest(`/api/themes/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            data: updateData
        })
    });
};

/**
 * 获取当前品牌的主题documentId
 * @param {Object} currentBrand - 当前品牌对象
 * @returns {string|null} 主题documentId
 */
export const getThemeDocumentIdFromBrand = (currentBrand) => {
    // 从品牌的strapiData中获取documentId
    return currentBrand?.strapiData?.documentId || null;
};

export default {
    getTheme,
    updateCommunication,
    updateLegal,
    updateSocialProfile,
    updateThemeConfig,
    getThemeDocumentIdFromBrand,
    refreshThemeData
}; 