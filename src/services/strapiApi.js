// Strapi API 配置更新服务
import CookieService from '../utils/cookieService';

const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
const token = import.meta.env.VITE_STRAPI_TOKEN;

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
                    console.log(`🗂️ strapiApi从Redux获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
                    return languageInfo.isoCode;
                }
            }

            // 回退：检查所有语言缓存中的数据
            for (const langCache of Object.values(state.themes.languageCache)) {
                if (langCache.languages) {
                    const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
                    if (languageInfo?.isoCode) {
                        console.log(`🗂️ strapiApi从其他缓存获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
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
        console.log(`⚠️ strapiApi使用静态映射回退: ${languageCode} -> ${locale}`);
        return locale;

    } catch (error) {
        console.error('❌ strapiApi getLocaleForAPI错误:', error);
        return languageCode.split('_')[0] || 'en';
    }
};

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
 * 刷新Redux中的主题数据 - 支持语言参数
 * @param {Function} dispatch - Redux dispatch函数
 * @param {string} languageCode - 语言代码
 * @returns {Promise<void>}
 */
export const refreshThemeData = async (dispatch, languageCode = 'en_GB') => {
    // 检查是否是登录页面且用户未认证，如果是则不进行主题数据请求
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.endsWith('/Login');
    const isAuthenticated = !!CookieService.getToken();

    if (isLoginPage && !isAuthenticated) {
        console.log('🚫 登录页面且未认证，跳过主题数据刷新');
        return;
    }

    // 将应用语言代码转换为API locale
    const locale = getLocaleForAPI(languageCode);

    try {
        if (!baseUrl || !token) {
            console.warn('Strapi配置缺失，跳过数据刷新');
            return;
        }

        console.log(`🔄 refreshThemeData: ${languageCode} -> locale=${locale}`);

        // 从localStorage读取租户并添加过滤条件
        let tenantFilterParam = '';
        try {
            const storedTenant = localStorage.getItem('mh_tenant');
            if (storedTenant) {
                const parsed = JSON.parse(storedTenant);
                if (parsed && parsed.tenant) {
                    tenantFilterParam = `&filters[tenant][tenant_name][$eq]=${encodeURIComponent(parsed.tenant)}`;
                }
            }
        } catch { /* ignore malformed localStorage content */ }

        // Get auth token from cookies for authenticated requests
        const authToken = CookieService.getToken();
        // 构建payload，包含locale参数
        const payloadObj = {
            locale: locale
        };
        const payloadParam = encodeURIComponent(JSON.stringify(payloadObj));

        const apiEndpoint = authToken
            ? `/apis/app-config?appcode=marketinghub&payload=${payloadParam}`
            : `${baseUrl}/api/themes?locale=${locale}${tenantFilterParam}&populate[0]=theme_colors&populate[1]=theme_logo&populate[2]=menu&populate[3]=menu.menu_l2&populate[4]=languages&populate[5]=theme_logos.favicon&populate[6]=theme_logos.onwhite_logo&populate[7]=theme_logos.oncolor_logo&populate[8]=login&populate[9]=pages.content_area&populate[10]=pages.content_area.home_page_widget_list.image&populate[11]=pages.content_area.link_list&populate[12]=pages.content_area.contact&populate[13]=pages.content_area.link_list.link_icon&populate[14]=pages.content_area.contact.profile_pic&populate[15]=fallback_image&populate[16]=legal&populate[17]=communication&populate[18]=socialprofile&populate[19]=login.background&populate[20]=pages.content_area.colors&populate[21]=pages.content_area.fonts&populate[22]=pages.content_area.view_button.button_link&populate[23]=pages.content_area.download_button.button_link&populate[24]=pages.content_area.book_logo&populate[25]=pages.content_area.book_cover&populate[26]=pages.content_area.book_file`;

        const headers = {
            'Content-Type': 'application/json',
        };

        // Use appropriate authorization header based on endpoint
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        } else if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers,
        });

        if (response.ok) {
            const result = await response.json();

            // 检查API是否返回有效数据
            const hasValidData = result.data && Array.isArray(result.data) && result.data.length > 0;

            if (!hasValidData) {
                console.warn(`⚠️ ${languageCode}语言的主题数据为空 (locale=${locale}), 数据:`, result);

                // 如果当前不是默认语言，尝试回退到默认语言
                if (languageCode !== 'en_GB') {
                    console.log(`🔄 回退到默认语言 en_GB`);
                    await refreshThemeData(dispatch, 'en_GB');
                    return;
                } else {
                    // 如果连默认语言都没有数据，记录错误但不抛出异常
                    console.error(`❌ 默认语言${languageCode}也没有主题数据`);
                    return;
                }
            }

            // 动态导入fetchThemes action
            const { fetchThemes } = await import('../store/slices/themesSlice');
            dispatch(fetchThemes.fulfilled({ ...result, languageCode }));
            console.log(`✅ 刷新${languageCode}语言的主题数据成功 (locale=${locale})`);
        }
    } catch (error) {
        console.error(`❌ 刷新${languageCode}语言的主题数据失败 (locale=${locale}):`, error);
    }
};

/**
 * 带缓存检查的主题数据获取
 * @param {Function} dispatch - Redux dispatch函数
 * @param {Function} getState - Redux getState函数
 * @param {string} languageCode - 语言代码
 * @returns {Promise<Object|null>}
 */
export const fetchThemesWithCache = async (dispatch, getState, languageCode = 'en_GB') => {
    // 检查是否是登录页面且用户未认证，如果是则不进行主题数据请求
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.endsWith('/Login');
    const isAuthenticated = !!CookieService.getToken();

    if (isLoginPage && !isAuthenticated) {
        console.log('🚫 登录页面且未认证，跳过主题数据缓存检查');
        return null;
    }

    const state = getState();
    const cachedData = state.themes.languageCache[languageCode];

    // 检查缓存数据是否有效（不为空且包含实际数据）
    const hasValidCache = cachedData &&
        cachedData.brands &&
        Array.isArray(cachedData.brands) &&
        cachedData.brands.length > 0;

    // 调试信息：显示缓存状态
    const cacheKeys = Object.keys(state.themes.languageCache);
    console.log(`🔍 缓存检查: 查找语言=${languageCode}, 现有缓存键=[${cacheKeys.join(', ')}], 找到缓存=${!!cachedData}, 缓存有效=${hasValidCache}`);

    if (cachedData) {
        console.log(`🔍 缓存数据详情 ${languageCode}:`, {
            hasBrands: !!cachedData.brands,
            brandsLength: cachedData.brands?.length || 0,
            hasLanguages: !!cachedData.languages,
            languagesLength: cachedData.languages?.length || 0,
            hasPages: !!cachedData.pages,
            pagesLength: cachedData.pages?.length || 0,
            lastUpdated: cachedData.lastUpdated,
            isFromAPI: cachedData.isFromAPI
        });
    }

    if (hasValidCache) {
        console.log(`✅ 使用${languageCode}语言的有效缓存数据`);
        // 如果有有效缓存，直接设置当前语言
        const { setCurrentLanguage } = await import('../store/slices/themesSlice');
        dispatch(setCurrentLanguage(languageCode));
        return cachedData;
    } else if (cachedData && !hasValidCache) {
        console.warn(`⚠️ ${languageCode}语言的缓存数据无效，将重新请求`);
        // 清除无效缓存
        const { clearLanguageCache } = await import('../store/slices/themesSlice');
        dispatch(clearLanguageCache(languageCode));
    }

    console.log(`🔄 请求${languageCode}语言的新数据`);
    await refreshThemeData(dispatch, languageCode);
    return null;
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
    refreshThemeData,
    fetchThemesWithCache
}; 