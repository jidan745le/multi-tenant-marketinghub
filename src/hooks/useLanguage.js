import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslationLoader } from './useTranslationLoader';

export const useLanguage = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // 使用新的翻译加载器
    const { getSupportedLanguages, getCurrentBrand } = useTranslationLoader();

    // 获取当前品牌支持的语言
    const currentSupportedLanguages = getSupportedLanguages();

    // 从URL解析语言
    const getLanguageFromURL = useCallback(() => {
        const pathSegments = location.pathname.split('/');
        const langFromPath = pathSegments[1];
        const supportedCodes = currentSupportedLanguages.map(lang => lang.code);

        if (params.lang && supportedCodes.includes(params.lang)) {
            return params.lang;
        }

        if (supportedCodes.includes(langFromPath)) {
            return langFromPath;
        }

        // 如果当前品牌有支持的语言，使用第一个，否则使用默认语言
        return supportedCodes.length > 0 ? supportedCodes[0] : 'en_GB';
    }, [location.pathname, params.lang, currentSupportedLanguages]);

    const [currentLanguage, setCurrentLanguage] = useState(() => getLanguageFromURL());

    // 同步语言状态和i18n
    useEffect(() => {
        const urlLang = getLanguageFromURL();

        console.log('🔍 useLanguage - 语言状态同步:', {
            urlLang,
            currentLanguage,
            supportedLanguages: currentSupportedLanguages.length,
            brand: getCurrentBrand()?.code
        });

        // 更新语言状态
        if (currentLanguage !== urlLang) {
            setCurrentLanguage(urlLang);
        }

        // 同步i18n（现在直接使用Redux中的翻译数据）
        if (i18n.language !== urlLang) {
            i18n.changeLanguage(urlLang);
        }

    }, [location.pathname, getLanguageFromURL, currentLanguage, i18n, currentSupportedLanguages, getCurrentBrand]);

    // 手动切换语言
    const changeLanguage = useCallback((newLanguage) => {
        if (!newLanguage || newLanguage === currentLanguage) return;

        const supportedCodes = currentSupportedLanguages.map(lang => lang.code);
        if (!supportedCodes.includes(newLanguage)) {
            console.warn('⚠️ 不支持的语言代码:', newLanguage);
            return;
        }

        const pathSegments = location.pathname.split('/').filter(Boolean);
        const currentBrand = params.brand || pathSegments[1] || 'kendo';
        const currentPage = pathSegments[2] || 'category';
        const newPath = `/${newLanguage}/${currentBrand}/${currentPage}`;

        console.log('🌐 切换语言:', {
            from: currentLanguage,
            to: newLanguage,
            path: newPath
        });

        navigate(`${newPath}${location.search}`);
    }, [currentLanguage, location, navigate, params, currentSupportedLanguages]);

    const getCurrentLanguageInfo = useCallback(() => {
        return currentSupportedLanguages.find(lang => lang.code === currentLanguage) ||
            (currentSupportedLanguages.length > 0 ? currentSupportedLanguages[0] : { code: 'en_GB', name: 'English (UK)', nativeName: 'English (UK)' });
    }, [currentLanguage, currentSupportedLanguages]);

    return {
        currentLanguage,
        supportedLanguages: currentSupportedLanguages,
        changeLanguage,
        getCurrentLanguageInfo,
    };
}; 