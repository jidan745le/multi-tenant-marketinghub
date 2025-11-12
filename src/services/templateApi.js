import CookieService from '../utils/cookieService';

class TemplateApiService {
    constructor() {
        this.baseURL = '/srv/v1/main/publication/templates';
    }

    // 获取租户名称
    getTenantName() {
        const userInfo = CookieService.getUserInfo();
        return userInfo?.tenant?.name || '';
    }

    // 从 URL 路径获取主题
    getThemeFromUrl() {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 2) {
            // Format: /:lang/:brand/:page
            return pathSegments[1] || 'kendo';
        } else if (pathSegments.length === 1) {
            const segment = pathSegments[0];
            // 如果不是语言代码（长度为2），则可能是主题
            if (segment.length !== 2) {
                return segment.toLowerCase();
            }
        }

        return ''; // 默认主题
    }

    // 获取模板列表
    async getTemplates() {
        try {
            const token = CookieService.getToken();
            const tenant = this.getTenantName();
            const theme = this.getThemeFromUrl();

            const url = `${this.baseURL}?tenant=${encodeURIComponent(tenant)}&theme=${encodeURIComponent(theme)}`;

            console.log('🔍 Fetching templates with params:', { tenant, theme, url });

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
            console.log('✅ Templates API response:', data);

            return data;
        } catch (error) {
            console.error('❌ Error fetching templates:', error);
            throw error;
        }
    }
}

export default new TemplateApiService();

