import i18n from '../i18n/i18n';
import CookieService from '../utils/cookieService';

class CompareApiService {
    constructor() {
        this.baseURL = '/srv/v1/main/api/compare';
    }

    // 获取当前语言
    getCurrentLanguage() {
        // 从 i18n 获取当前语言
        const currentLang = i18n.language || 'en_US';

        // 转换为 API 需要的格式（例如：en_US -> en）
        // 根据实际 API 需求调整格式
        const langMap = {
            'en_GB': 'en',
            'en_US': 'en',
            'zh_CN': 'zh',
            'de_DE': 'de',
            'fr_FR': 'fr',
            'es_ES': 'es',
            'ja_JP': 'ja',
        };

        return langMap[currentLang] || currentLang.split('_')[0] || 'en';
    }

    /**
     * 比较多个产品
     * @param {Array<string|number>} ids - 产品ID数组，例如 [10101, 10102]
     * @param {string} language - 可选，语言参数，不传则自动获取
     * @returns {Promise<Object>} 比较结果数据
     */
    async compareProducts(ids, language = null) {
        try {
            const token = CookieService.getToken();

            // 如果没有传入语言参数，则自动获取
            const lang = language || this.getCurrentLanguage();

            // 将 ID 数组转换为逗号分隔的字符串
            const idsString = Array.isArray(ids) ? ids.join(',') : ids;

            const url = `${this.baseURL}?id=${encodeURIComponent(idsString)}&language=${encodeURIComponent(lang)}`;

            console.log('🔍 Fetching product comparison with params:', { ids: idsString, language: lang, url });

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/hal+json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Compare API response:', data);

            return data;
        } catch (error) {
            console.error('❌ Error comparing products:', error);
            throw error;
        }
    }
}

export default new CompareApiService();

