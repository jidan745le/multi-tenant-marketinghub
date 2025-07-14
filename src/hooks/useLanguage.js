import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supportedLanguages } from '../i18n/i18n';

export const useLanguage = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [currentLanguage, setCurrentLanguage] = useState(() => {
        // 从 URL 参数中获取当前语言
        const langFromParams = params.lang;
        const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);

        if (supportedLanguageCodes.includes(langFromParams)) {
            return langFromParams;
        }

        return 'en_GB'; // 默认语言
    });

    // 同步 i18n 语言设置
    useEffect(() => {
        if (currentLanguage && i18n.language !== currentLanguage) {
            i18n.changeLanguage(currentLanguage);
        }
    }, [currentLanguage, i18n]);

    // 当路由参数变化时更新当前语言
    useEffect(() => {
        const langFromParams = params.lang;
        const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);

        if (supportedLanguageCodes.includes(langFromParams) && langFromParams !== currentLanguage) {
            setCurrentLanguage(langFromParams);
        }
    }, [params.lang, currentLanguage]);

    // 切换语言函数
    const changeLanguage = useCallback((newLanguage) => {
        if (!newLanguage || newLanguage === currentLanguage) return;

        const supportedLanguageCodes = supportedLanguages.map(lang => lang.code);
        if (!supportedLanguageCodes.includes(newLanguage)) {
            console.warn(`Unsupported language: ${newLanguage}`);
            return;
        }

        // 构建新的路径：${language}/${brand}/${page}
        const pathSegments = location.pathname.split('/').filter(Boolean);

        // 从URL路径或params中获取当前品牌，确保不会丢失
        let currentBrand = params.brand;
        if (!currentBrand && pathSegments.length >= 2) {
            currentBrand = pathSegments[1]; // 从路径中提取品牌
        }
        if (!currentBrand) {
            currentBrand = 'kendo-china'; // 最后的默认值
        }

        const currentPage = pathSegments[2] || 'products'; // 默认页面

        // 构建新路径
        const newPath = `/${newLanguage}/${currentBrand}/${currentPage}`;

        // 保留查询参数
        const search = location.search;

        // 导航到新路径
        navigate(newPath + search);

        // 更新状态
        setCurrentLanguage(newLanguage);
    }, [currentLanguage, location, navigate, params]);

    // 获取当前语言信息
    const getCurrentLanguageInfo = useCallback(() => {
        return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
    }, [currentLanguage]);

    return {
        currentLanguage,
        supportedLanguages,
        changeLanguage,
        getCurrentLanguageInfo,
    };
}; 