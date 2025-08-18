// Tenant validation service for login page

/**
 * Strapi API request function for tenant validation
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} API response
 */
const strapiRequest = async (endpoint) => {
    const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
    const token = import.meta.env.VITE_STRAPI_TOKEN;

    if (!baseUrl || !token) {
        throw new Error('Strapi configuration missing: please check environment variables');
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

/**
 * Validates if a tenant exists and returns theme information
 * @param {string} tenantName - The tenant name from URL
 * @param {string} languageCode - Language code (e.g., 'en_gb')
 * @returns {Promise<Object>} Tenant validation result
 */
export const validateTenant = async (tenantName, languageCode = 'en_GB') => {
    try {
        // Convert language code to locale format for Strapi
        const locale = getLocaleForStrapi(languageCode);

        const endpoint = `/api/tenants?locale=${locale}&populate[0]=themes&populate[1]=themes.login&populate[2]=themes.login.background&populate[3]=themes.theme_colors&populate[4]=themes.theme_logo&populate[5]=themes.languages&filters[tenant_name]=${tenantName}`;

        console.log(`🔍 Validating tenant: ${tenantName} with locale: ${locale}`);

        const response = await strapiRequest(endpoint);

        if (!response.data || response.data.length === 0) {
            console.warn(`❌ Tenant not found: ${tenantName}`);
            return {
                isValid: false,
                error: 'Tenant not found',
                tenant: null,
                selectedTheme: null
            };
        }

        const tenant = response.data[0];
        console.log(`✅ Tenant found: ${tenant.tenant_name}`);

        // Select the best theme (prefer themes with background)
        const selectedTheme = selectBestTheme(tenant.themes);

        return {
            isValid: true,
            tenant,
            selectedTheme,
            locale: locale, // 添加 locale 信息
            error: null
        };

    } catch (error) {
        console.error('❌ Error validating tenant:', error);
        return {
            isValid: false,
            error: error.message || 'Failed to validate tenant',
            tenant: null,
            selectedTheme: null
        };
    }
};

/**
 * Selects the best theme from available themes
 * Prefers themes with background images
 * @param {Array} themes - Array of theme objects
 * @returns {Object|null} Selected theme or null
 */
export const selectBestTheme = (themes) => {
    if (!themes || themes.length === 0) {
        return null;
    }

    console.log('🔍 Available themes:', themes.map(t => ({
        name: t.theme_name,
        hasLogin: !!t.login,
        backgroundType: typeof t.login?.background,
        isArray: Array.isArray(t.login?.background),
        backgroundLength: t.login?.background?.length || 0,
        hasBackground: !!(t.login?.background && Array.isArray(t.login.background) && t.login.background.length > 0)
    })));

    // First, try to find a theme with a background image
    const themeWithBackground = themes.find(theme => {
        const hasBackground = theme.login?.background &&
            Array.isArray(theme.login.background) &&
            theme.login.background.length > 0;
        console.log(`  Checking theme ${theme.theme_name}: hasBackground = ${hasBackground}`);
        return hasBackground;
    });

    if (themeWithBackground) {
        console.log(`🎨 Selected theme with background: ${themeWithBackground.theme_name}`);
        return themeWithBackground;
    }

    // If no theme with background, return the first available theme
    console.log(`🎨 Selected first available theme: ${themes[0].theme_name}`);
    return themes[0];
};

/**
 * Converts language code to Strapi locale format
 * @param {string} languageCode - Language code (e.g., 'en_gb', 'zh_cn')
 * @returns {string} Strapi locale (e.g., 'en', 'zh')
 */
const getLocaleForStrapi = (languageCode) => {
    const staticMapping = {
        'en_gb': 'en', 'en_us': 'en', 'en_au': 'en',
        'zh_cn': 'zh', 'zh_tw': 'zh', 'cht': 'zh', 'ch': 'zh',
        'de_de': 'de', 'fr_fr': 'fr', 'es_es': 'es', 'ja_jp': 'ja',
        'ko_kr': 'ko', 'it_it': 'it', 'pt_pt': 'pt', 'ru_ru': 'ru',
        'ar_sa': 'ar', 'nl_nl': 'nl', 'pl_pl': 'pl', 'cs_cz': 'cs',
        'da_dk': 'da', 'fi_fi': 'fi', 'hu_hu': 'hu', 'nb_no': 'no',
        'sv_se': 'sv', 'bg_bg': 'bg', 'hr_hr': 'hr', 'et_ee': 'et',
        'el_gr': 'el', 'lt_lt': 'lt', 'lv_lv': 'lv'
    };

    const normalizedCode = languageCode.toLowerCase();
    return staticMapping[normalizedCode] || normalizedCode.split('_')[0] || 'en';
};

/**
 * Extracts login configuration from selected theme
 * @param {Object} theme - Selected theme object
 * @returns {Object} Login configuration
 */
export const getLoginConfig = (theme) => {
    if (!theme || !theme.login) {
        return {
            pretitle: 'Welcome to the',
            title: 'Marketing Hub',
            subtitle: 'Get access to our brand content',
            background: null,
            primaryColor: '#e53935', // default red color
            secondaryColor: '#d32f2f'
        };
    }

    const login = theme.login;
    const background = login.background && login.background.length > 0 ? login.background[0] : null;

    // Extract theme colors
    const themeColors = theme.theme_colors || {};
    const primaryColor = themeColors.primary_color || '#e53935';
    const secondaryColor = themeColors.secondary_color || '#d32f2f';

    // Extract theme logo
    const themeLogo = theme.theme_logo || null;
    const logoUrl = themeLogo ? getBackgroundImageUrl(themeLogo) : null;

    console.log('🎨 Theme colors:', { primaryColor, secondaryColor });
    console.log('🖼️ Theme logo:', { themeLogo, logoUrl });

    return {
        pretitle: login.pretitle || 'Welcome to the',
        title: login.title || `${theme.theme_name} Marketing Hub`,
        subtitle: login.subtitle || 'Get access to our brand content and build personalized marketing collaterals',
        background,
        primaryColor,
        secondaryColor,
        logoUrl
    };
};

/**
 * Gets the full background image URL
 * @param {Object} background - Background image object from Strapi
 * @returns {string|null} Full image URL or null
 */
export const getBackgroundImageUrl = (background) => {
    if (!background || !background.url) {
        return null;
    }

    const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || 'https://strapi-test.rg-experience.com';

    // If URL is already absolute, return as is
    if (background.url.startsWith('http')) {
        return background.url;
    }

    // Otherwise, prepend base URL
    return `${baseUrl}${background.url}`;
};

export default {
    validateTenant,
    selectBestTheme,
    getLoginConfig,
    getBackgroundImageUrl
};
