import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

export const useTranslationLoader = () => {
    const { i18n } = useTranslation();
    const params = useParams();
    const location = useLocation();
    const brands = useSelector(state => state.themes.brands);

    // 获取当前品牌
    const getCurrentBrand = useCallback(() => {
        const pathSegments = location.pathname.split('/');
        const brandFromPath = pathSegments[2] || params.brand || 'kendo';
        return brands.find(brand => brand.code === brandFromPath);
    }, [brands, location.pathname, params.brand]);

    // 从Redux加载翻译数据并更新i18n
    const loadTranslationsFromRedux = useCallback(() => {
        const currentBrand = getCurrentBrand();

        if (!currentBrand || !currentBrand.translations) {
            console.log('⚠️ 无法获取品牌翻译数据:', currentBrand?.code);
            return;
        }

        const translations = currentBrand.translations;
        console.log('🌐 从Redux加载翻译数据:', Object.keys(translations));

        // 为每种语言动态添加翻译资源到i18n
        Object.keys(translations).forEach(languageCode => {
            const translationData = translations[languageCode];

            if (translationData && typeof translationData === 'object') {
                // 检查i18n是否已有该语言的资源
                if (!i18n.hasResourceBundle(languageCode, 'translation')) {
                    i18n.addResourceBundle(languageCode, 'translation', translationData);
                    console.log(`✅ 添加语言资源: ${languageCode}`);
                } else {
                    // 更新现有资源
                    i18n.addResourceBundle(languageCode, 'translation', translationData, true, true);
                    console.log(`🔄 更新语言资源: ${languageCode}`);
                }
            }
        });

        return translations;
    }, [getCurrentBrand, i18n]);

    // 当品牌数据变化时加载翻译
    useEffect(() => {
        if (brands.length > 0) {
            loadTranslationsFromRedux();
        }
    }, [brands, loadTranslationsFromRedux]);

    // 获取当前品牌支持的语言列表
    const getSupportedLanguages = useCallback(() => {
        const currentBrand = getCurrentBrand();

        if (!currentBrand || !currentBrand.translations) {
            return [];
        }

        const supportedLanguageCodes = Object.keys(currentBrand.translations);

        // 从品牌的languages配置中获取完整信息
        if (currentBrand.languages && currentBrand.languages.length > 0) {
            return currentBrand.languages.filter(lang =>
                supportedLanguageCodes.includes(lang.code) // 使用lang.code进行匹配
            ).map(lang => ({
                code: lang.code, // 保持使用code字段
                name: lang.name,
                nativeName: lang.nativeName || lang.name
            }));
        }

        // 如果没有完整的语言配置，返回基本信息
        return supportedLanguageCodes.map(code => ({
            code,
            name: code,
            nativeName: code
        }));
    }, [getCurrentBrand]);

    return {
        loadTranslationsFromRedux,
        getSupportedLanguages,
        getCurrentBrand
    };
}; 