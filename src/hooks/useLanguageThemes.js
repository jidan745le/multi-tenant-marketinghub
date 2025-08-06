import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThemesWithCache } from '../services/strapiApi';
import {
    selectBrands,
    selectCurrentLanguage,
    selectHasLanguageCache,
    selectLanguages,
    selectPages
} from '../store/slices/themesSlice';

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
                    console.log(`🗂️ useLanguageThemes从Redux获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
                    return languageInfo.isoCode;
                }
            }

            // 回退：检查所有语言缓存中的数据
            for (const langCache of Object.values(state.themes.languageCache)) {
                if (langCache.languages) {
                    const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
                    if (languageInfo?.isoCode) {
                        console.log(`🗂️ useLanguageThemes从其他缓存获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
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
        console.log(`⚠️ useLanguageThemes使用静态映射回退: ${languageCode} -> ${locale}`);
        return locale;

    } catch (error) {
        console.error('❌ useLanguageThemes getLocaleForAPI错误:', error);
        return languageCode.split('_')[0] || 'en';
    }
};

/**
 * 多语言主题数据管理的自定义Hook
 * 提供语言切换和主题数据获取功能
 */
export const useLanguageThemes = () => {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();

    // 获取当前语言和主题数据
    const currentLanguage = useSelector(selectCurrentLanguage);
    const brands = useSelector(selectBrands);
    const languages = useSelector(selectLanguages);
    const pages = useSelector(selectPages);

    // 检查当前语言是否有缓存
    const hasCurrentCache = useSelector(selectHasLanguageCache(currentLanguage));

    /**
     * 切换语言并获取对应的主题数据
     * @param {string} newLanguageCode - 新的语言代码
     */
    const switchLanguage = useCallback(async (newLanguageCode) => {
        try {
            const locale = getLocaleForAPI(newLanguageCode);
            console.log(`🌐 开始切换语言: ${currentLanguage} → ${newLanguageCode} (locale=${locale})`);

            // 1. 切换i18n语言
            await i18n.changeLanguage(newLanguageCode);

            // 2. 检查是否有该语言的缓存，如果没有则请求
            const state = () => ({ themes: { ...window.store.getState().themes } });
            await fetchThemesWithCache(dispatch, state, newLanguageCode);

            console.log(`✅ 语言切换完成: ${newLanguageCode} (locale=${locale})`);
        } catch (error) {
            console.error(`❌ 语言切换失败: ${error.message}`);
        }
    }, [dispatch, i18n, currentLanguage]);

    /**
     * 预加载指定语言的主题数据
     * @param {string} languageCode - 语言代码
     */
    const preloadLanguage = useCallback(async (languageCode) => {
        try {
            const locale = getLocaleForAPI(languageCode);
            console.log(`🔄 预加载${languageCode}语言数据 (locale=${locale})`);
            const state = () => ({ themes: { ...window.store.getState().themes } });
            await fetchThemesWithCache(dispatch, state, languageCode);
            console.log(`✅ 预加载${languageCode}语言数据完成 (locale=${locale})`);
        } catch (error) {
            console.error(`❌ 预加载${languageCode}语言数据失败: ${error.message}`);
        }
    }, [dispatch]);

    /**
     * 刷新当前语言的主题数据
     */
    const refreshCurrentLanguageData = useCallback(async () => {
        try {
            const locale = getLocaleForAPI(currentLanguage);
            console.log(`🔄 刷新${currentLanguage}语言数据 (locale=${locale})`);
            // 清除当前语言缓存并重新获取
            const { clearLanguageCache } = await import('../store/slices/themesSlice');
            dispatch(clearLanguageCache({ languageCode: currentLanguage }));

            const state = () => ({ themes: { ...window.store.getState().themes } });
            await fetchThemesWithCache(dispatch, state, currentLanguage);
            console.log(`✅ 刷新${currentLanguage}语言数据完成 (locale=${locale})`);
        } catch (error) {
            console.error(`❌ 刷新${currentLanguage}语言数据失败: ${error.message}`);
        }
    }, [dispatch, currentLanguage]);

    return {
        // 当前状态
        currentLanguage,
        brands,
        languages,
        pages,
        hasCurrentCache,

        // 操作函数
        switchLanguage,
        preloadLanguage,
        refreshCurrentLanguageData,

        // i18n相关
        i18nLanguage: i18n.language,
        changeI18nLanguage: i18n.changeLanguage
    };
};

export default useLanguageThemes;