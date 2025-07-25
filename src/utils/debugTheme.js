// 主题调试工具
export const debugCurrentTheme = () => {
    console.group('🎨 动态主题调试');

    // 获取当前主题（如果可用）
    const themeElement = document.querySelector('[data-mui-theme]');

    // 检查Redux中的品牌数据
    const state = window.store?.getState();
    if (state?.themes) {
        console.log('📊 Redux中的品牌数据:');
        state.themes.brands.forEach(brand => {
            const colors = brand.strapiData?.theme_colors;
            const logo = brand.strapiData?.theme_logo;
            const menus = brand.strapiData?.menu;

            console.log(`  ${brand.code} (${brand.displayName}):`, {
                hasColors: !!colors,
                primary: colors?.primary_color,
                secondary: colors?.secondary_color,
                hasLogo: !!logo,
                logoUrl: logo?.url,
                hasMenus: !!menus,
                menuCount: menus?.length || 0,
                isFromAPI: !!brand.strapiData
            });
        });
    }

    // 检查当前路径品牌
    const path = window.location.pathname;
    const segments = path.split('/');
    const currentBrand = segments[2];
    console.log('🎯 当前URL品牌:', currentBrand);

    // 检查CSS变量（如果主题有应用到DOM）
    if (themeElement) {
        const computedStyle = getComputedStyle(themeElement);
        console.log('🎨 应用的主题颜色:');
        console.log('  Primary:', computedStyle.getPropertyValue('--mui-palette-primary-main'));
        console.log('  Secondary:', computedStyle.getPropertyValue('--mui-palette-secondary-main'));
    }

    console.groupEnd();
};

// 检查主题变化
export const checkThemeChange = (brandCode) => {
    console.log(`🔄 主题切换测试: 切换到 ${brandCode}`);

    const state = window.store?.getState();
    if (state?.themes) {
        const targetBrand = state.themes.brands.find(b => b.code === brandCode);
        if (targetBrand && targetBrand.strapiData) {
            console.log('✅ 目标品牌完整数据:', {
                brand: targetBrand.displayName,
                colors: targetBrand.strapiData.theme_colors ? {
                    primary: targetBrand.strapiData.theme_colors.primary_color,
                    secondary: targetBrand.strapiData.theme_colors.secondary_color
                } : null,
                logo: targetBrand.strapiData.theme_logo ? {
                    url: targetBrand.strapiData.theme_logo.url
                } : null,
                menus: targetBrand.strapiData.menu ? {
                    count: targetBrand.strapiData.menu.length,
                    items: targetBrand.strapiData.menu.map(m => m.title || m.name)
                } : null
            });
        } else {
            console.log('⚠️ 目标品牌无完整数据，将使用默认值');
        }
    }
};

// 调试菜单数据
export const debugMenus = () => {
    console.group('📋 动态菜单调试');

    const state = window.store?.getState();
    if (state?.themes) {
        console.log('📊 品牌菜单数据:');
        state.themes.brands.forEach(brand => {
            const menus = brand.strapiData?.menu;
            console.log(`  ${brand.code}:`, {
                hasMenus: !!menus,
                count: menus?.length || 0,
                menuItems: menus?.map(menu => ({
                    title: menu.title || menu.name,
                    key: menu.key,
                    path: menu.path,
                    hasSubMenus: !!(menu.menu_l2 && menu.menu_l2.length > 0),
                    subMenuCount: menu.menu_l2?.length || 0
                })) || []
            });
        });
    }

    console.groupEnd();
};

// 注册到全局
if (typeof window !== 'undefined') {
    window.debugCurrentTheme = debugCurrentTheme;
    window.checkThemeChange = checkThemeChange;
    window.debugMenus = debugMenus;
    console.log('🔧 已注册主题调试函数: window.debugCurrentTheme(), window.checkThemeChange(brandCode), window.debugMenus()');
} 