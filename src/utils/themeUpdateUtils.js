// 通用的主题更新工具函数
// 用于处理locale-aware的API更新和Redux状态刷新

import { refreshThemeData } from '../services/strapiApi';

// 动态从Redux获取语言代码到Strapi locale的映射
const getLocaleForAPI = (languageCode) => {
    try {
        // 检查是否有window.store可用
        if (typeof window !== 'undefined' && window.store) {
            const state = window.store.getState();
            const currentLangData = state.themes.languageCache[state.themes.currentLanguage];

            if (currentLangData?.languages) {
                // 在当前品牌的语言配置中查找对应的iso_639_code
                const languageInfo = currentLangData.languages.find(lang => lang.code === languageCode);
                if (languageInfo?.isoCode) {
                    console.log(`🗂️ themeUpdateUtils从Redux获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
                    return languageInfo.isoCode;
                }
            }

            // 回退：检查所有语言缓存中的数据
            for (const langCache of Object.values(state.themes.languageCache)) {
                if (langCache.languages) {
                    const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
                    if (languageInfo?.isoCode) {
                        console.log(`🗂️ themeUpdateUtils从其他缓存获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
                        return languageInfo.isoCode;
                    }
                }
            }
        }

        // 最后回退：使用静态映射
        const staticMapping = {
            'en_GB': 'en', 'en_US': 'en', 'en_AU': 'en',
            'zh_CN': 'zh', 'zh_TW': 'zh', 'cht': 'zh', 'ch': 'zh',
            'de_DE': 'de', 'fr_FR': 'fr', 'es_ES': 'es', 'ja_JP': 'ja',
            'ko_KR': 'ko', 'it_IT': 'it', 'pt_PT': 'pt', 'ru_RU': 'ru',
            'ar_SA': 'ar', 'nl_NL': 'nl', 'pl_PL': 'pl', 'cs_CZ': 'cs',
            'da_DK': 'da', 'fi_FI': 'fi', 'hu_HU': 'hu', 'nb_NO': 'no',
            'sv_SE': 'sv', 'bg_BG': 'bg', 'hr_HR': 'hr', 'et_EE': 'et',
            'el_GR': 'el', 'lt_LT': 'lt', 'lv_LV': 'lv'
        };

        const locale = staticMapping[languageCode] || languageCode.split('_')[0] || 'en';
        console.log(`⚠️ themeUpdateUtils使用静态映射回退: ${languageCode} -> ${locale}`);
        return locale;

    } catch (error) {
        console.error('❌ themeUpdateUtils getLocaleForAPI错误:', error);
        return languageCode.split('_')[0] || 'en';
    }
};

/**
 * 通用的主题配置更新函数
 * 支持locale参数并自动刷新Redux状态
 * 
 * @param {Object} params - 更新参数
 * @param {string} params.documentId - 主题的documentId
 * @param {Object} params.updateData - 要更新的数据
 * @param {string} params.currentLanguage - 当前语言代码
 * @param {Function} params.dispatch - Redux dispatch函数
 * @param {string} [params.description] - 操作描述，用于日志和消息
 * @returns {Promise<Object>} API响应结果
 */
export const updateThemeWithLocale = async ({
    documentId,
    updateData,
    currentLanguage,
    dispatch,
    description = '配置'
}) => {
    try {
        const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
        const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;

        if (!strapiBaseUrl || !strapiToken) {
            throw new Error('Strapi 配置缺失');
        }

        if (!documentId) {
            throw new Error('未找到品牌的 documentId');
        }

        // 获取当前语言对应的locale
        const locale = getLocaleForAPI(currentLanguage);
        console.log(`🌐 更新${description}: ${currentLanguage} -> locale=${locale}`);
        console.log(`📝 更新数据:`, updateData);

        // 调用 Strapi API 更新 themes - 带locale参数
        const response = await fetch(`${strapiBaseUrl}/api/themes/${documentId}?locale=${locale}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${strapiToken}`
            },
            body: JSON.stringify({ data: updateData })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ ${description}保存成功:`, result);

        // 刷新Redux中的主题数据
        console.log(`🔄 刷新${currentLanguage}语言的主题数据 (locale=${locale})`);
        await refreshThemeData(dispatch, currentLanguage);
        console.log(`✅ 刷新${currentLanguage}语言的主题数据完成`);

        return result;
    } catch (error) {
        console.error(`❌ 保存${description}失败:`, error);
        throw error;
    }
};

/**
 * 处理图片背景关系字段的格式化
 * 将图片ID转换为Strapi期望的关系数组格式
 * 
 * @param {string|number|null} newImageId - 新上传的图片ID
 * @param {Object} existingData - 现有的图片数据
 * @returns {Array|null} 格式化后的背景数组
 */
export const formatImageRelation = (newImageId, existingData) => {
    if (newImageId) {
        // 如果有新上传的图片，使用新上传的图片ID
        return [newImageId];
    } else if (existingData?.id) {
        // 如果有现有的图片，保持现有的ID
        return [existingData.id];
    } else if (existingData?.[0]?.id) {
        // 如果现有数据是数组格式，提取第一个的ID
        return [existingData[0].id];
    }
    // 没有图片数据
    return null;
};

/**
 * 批量处理多个图片关系字段
 * 
 * @param {Object} uploadedIds - 新上传的图片ID映射 {logoType: imageId}
 * @param {Object} existingData - 现有的图片数据映射 {logoType: imageData}
 * @param {Array} logoTypes - 需要处理的logo类型数组
 * @returns {Object} 处理后的图片关系数据
 */
export const formatMultipleImageRelations = (uploadedIds, existingData, logoTypes) => {
    const result = {};

    logoTypes.forEach(logoType => {
        const formattedRelation = formatImageRelation(
            uploadedIds[logoType],
            existingData[logoType]
        );

        if (formattedRelation) {
            result[logoType] = formattedRelation[0]; // Strapi通常需要单个ID而不是数组
        }
    });

    return result;
};

/**
 * 验证品牌数据的完整性
 * 
 * @param {Object} currentBrand - 当前品牌对象
 * @returns {Object} 验证结果 {isValid: boolean, error: string}
 */
export const validateBrandData = (currentBrand) => {
    if (!currentBrand) {
        return { isValid: false, error: '未找到当前品牌数据' };
    }

    if (!currentBrand.strapiData?.documentId) {
        return { isValid: false, error: '未找到品牌的 documentId' };
    }

    return { isValid: true, error: null };
};

/**
 * 创建标准的成功/错误通知对象
 * 
 * @param {boolean} success - 是否成功
 * @param {string} message - 消息内容
 * @returns {Object} 通知对象
 */
export const createNotification = (success, message) => ({
    open: true,
    message,
    severity: success ? 'success' : 'error'
});

export default {
    updateThemeWithLocale,
    formatImageRelation,
    formatMultipleImageRelations,
    validateBrandData,
    createNotification,
    getLocaleForAPI
};
