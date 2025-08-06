// 品牌使用调试工具
export const debugBrandUsage = () => {
    console.group('🔍 品牌对象使用调试');

    // 检查Redux状态
    const state = window.store?.getState();
    if (state?.themes) {
        // 使用新的语言缓存结构
        const currentLang = state.themes.currentLanguage;
        const brands = state.themes.languageCache[currentLang]?.brands || state.themes.defaultBrands || [];
        console.log('📊 Redux品牌数据:', {
            currentLanguage: currentLang,
            brandsCount: brands.length,
            brands: brands.map(b => ({
                code: b.code,
                displayName: b.displayName
            })),
            cacheLanguages: Object.keys(state.themes.languageCache)
        });
    }

    // 检查当前URL
    const path = window.location.pathname;
    const segments = path.split('/');
    console.log('🗺️ 当前路径解析:');
    console.log('  完整路径:', path);
    console.log('  语言 (segments[1]):', segments[1]);
    console.log('  品牌 (segments[2]):', segments[2]);
    console.log('  页面 (segments[3]):', segments[3]);

    console.groupEnd();
};

// 检查对象渲染问题
export const checkObjectRendering = () => {
    console.warn('🚨 如果看到此消息，说明仍有对象被直接渲染的问题');
    console.trace('调用堆栈');
};

// 注册到全局
if (typeof window !== 'undefined') {
    window.debugBrandUsage = debugBrandUsage;
    window.checkObjectRendering = checkObjectRendering;
    console.log('🔧 已注册调试函数: window.debugBrandUsage(), window.checkObjectRendering()');
} 