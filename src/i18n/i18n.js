import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入静态翻译文件作为回退
import de_DE from './translations/de_DE.js';
import en_GB from './translations/en_GB.js';
import en_US from './translations/en_US.js';
import es_ES from './translations/es_ES.js';
import fr_FR from './translations/fr_FR.js';
import ja_JP from './translations/ja_JP.js';
import zh_CN from './translations/zh_CN.js';

// 静态翻译资源配置（作为回退）
const staticResources = {
    'en_GB': { translation: en_GB },
    'en_US': { translation: en_US },
    'zh_CN': { translation: zh_CN },
    'de_DE': { translation: de_DE },
    'fr_FR': { translation: fr_FR },
    'es_ES': { translation: es_ES },
    'ja_JP': { translation: ja_JP },
};

// 语言映射（用于 Strapi 或其他服务的语言代码转换）
export const languageMap = {
    'en_GB': 'en',
    'en_US': 'en-US',
    'zh_CN': 'zh',
    'de_DE': 'de',
    'fr_FR': 'fr',
    'es_ES': 'es',
    'ja_JP': 'ja',
};

// 静态支持的语言列表（作为回退）
export const supportedLanguages = [
    { code: 'en_GB', name: 'English (UK)', nativeName: 'English (UK)' },
    { code: 'en_US', name: 'English (US)', nativeName: 'English (US)' },
    { code: 'zh_CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'de_DE', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr_FR', name: 'French', nativeName: 'Français' },
    { code: 'es_ES', name: 'Spanish', nativeName: 'Español' },
    { code: 'ja_JP', name: 'Japanese', nativeName: '日本語' },
];

// 获取当前语言（从 URL 路径中获取）
const getCurrentLanguage = () => {
    const pathSegments = window.location.pathname.split('/');
    const langFromPath = pathSegments[1];

    // 检查是否是支持的语言代码
    if (supportedLanguages.some(lang => lang.code === langFromPath)) {
        return langFromPath;
    }

    return 'en_GB'; // 默认语言
};

// 初始化 i18n
i18n
    .use(initReactI18next)
    .init({
        resources: staticResources,
        lng: getCurrentLanguage(),
        fallbackLng: 'en_GB',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

export default i18n; 