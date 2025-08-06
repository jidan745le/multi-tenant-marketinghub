// 语言代码映射测试工具
// 在浏览器控制台中运行: testLocaleMapping()

export const testLocaleMapping = () => {
    console.group('🧪 语言代码映射测试');

    try {
        // 检查Redux store是否可用
        if (typeof window === 'undefined' || !window.store) {
            console.error('❌ Redux store 不可用');
            return;
        }

        const state = window.store.getState();
        console.log('📊 当前Redux状态:', {
            currentLanguage: state.themes.currentLanguage,
            cacheLanguages: Object.keys(state.themes.languageCache),
            cacheCount: Object.keys(state.themes.languageCache).length
        });

        // 测试当前语言缓存中的语言数据
        const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
        if (currentLangData?.languages) {
            console.log('🗂️ 当前语言缓存中的语言配置:');
            currentLangData.languages.forEach(lang => {
                console.log(`  ${lang.code} -> ${lang.isoCode} (${lang.name})`);
            });

            // 测试映射函数
            console.log('\n🔍 测试映射功能:');
            currentLangData.languages.forEach(lang => {
                const testResult = testSingleMapping(lang.code);
                console.log(`  ${lang.code} -> ${testResult} ${testResult === lang.isoCode ? '✅' : '❌'}`);
            });
        } else {
            console.warn('⚠️ 当前语言缓存中没有语言数据');
        }

        // 测试所有缓存中的语言
        console.log('\n📚 所有缓存中的语言:');
        Object.entries(state.themes.languageCache).forEach(([cacheKey, cacheData]) => {
            if (cacheData.languages) {
                console.log(`  缓存 ${cacheKey}:`);
                cacheData.languages.forEach(lang => {
                    console.log(`    ${lang.code} -> ${lang.isoCode} (${lang.name})`);
                });
            }
        });

    } catch (error) {
        console.error('❌ 测试过程中出错:', error);
    }

    console.groupEnd();
};

// 测试单个语言代码映射
const testSingleMapping = (languageCode) => {
    try {
        const state = window.store.getState();
        const currentLangData = state.themes.languageCache[state.themes.currentLanguage];

        if (currentLangData?.languages) {
            const languageInfo = currentLangData.languages.find(lang => lang.code === languageCode);
            if (languageInfo?.isoCode) {
                return languageInfo.isoCode;
            }
        }

        // 回退检查所有缓存
        for (const langCache of Object.values(state.themes.languageCache)) {
            if (langCache.languages) {
                const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
                if (languageInfo?.isoCode) {
                    return languageInfo.isoCode;
                }
            }
        }

        return '未找到';
    } catch (error) {
        return '错误';
    }
};

// 注册到全局
if (typeof window !== 'undefined') {
    window.testLocaleMapping = testLocaleMapping;
    console.log('🔧 已注册测试函数: window.testLocaleMapping()');
}

export default testLocaleMapping;