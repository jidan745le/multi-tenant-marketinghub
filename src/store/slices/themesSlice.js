import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 创建异步thunk来处理themes获取
export const fetchThemes = createAsyncThunk(
    'themes/fetchThemes',
    async (strapiResponse, { rejectWithValue }) => {
        try {
            // strapiResponse现在应该包含languageCode
            return strapiResponse;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 默认的品牌配置作为回退
const defaultBrands = [
    {
        code: 'kendo',
        name: 'KENDO',
        displayName: 'KENDO',
        description: 'KENDO China Marketing Portal'
    },
    {
        code: 'bosch',
        name: 'Bosch',
        displayName: 'Bosch',
        description: 'Bosch Portal'
    }
];

const initialState = {
    // 新的语言缓存结构: { [languageCode]: { brands, languages, pages, lastUpdated, isFromAPI } }
    languageCache: {},
    currentLanguage: 'en_GB', // 当前语言
    loading: false,
    error: null,
    // 保留默认数据作为回退
    defaultBrands: defaultBrands,
};

const themesSlice = createSlice({
    name: 'themes',
    initialState,
    reducers: {
        setThemesLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCurrentLanguage: (state, action) => {
            state.currentLanguage = action.payload;
        },
        setThemesData: (state, action) => {
            const { data, isFromAPI = true, languageCode = 'en_US' } = action.payload;

            // 原生语言名称映射表
            const nativeNameMap = {
                'en_US': 'English (US)',
                'en_GB': 'English (UK)',
                'zh_CN': '简体中文',
                'de_DE': 'Deutsch',
                'fr_FR': 'Français',
                'es_ES': 'Español',
                'ja_JP': '日本語',
                'bg-BG': 'Български',
                'ch': '中文',
                'hr-HR': 'Hrvatski',
                'cht': '繁體中文',
                'cs_CZ': 'Čeština',
                'da_DK': 'Dansk',
                'el_GR': 'Ελληνικά',
                'en_AU': 'English (AU)',
                'et-EE': 'Eesti',
                'fi_FI': 'Suomi',
                'hu_HU': 'Magyar',
                'it_IT': 'Italiano',
                'ko_KR': '한국어',
                'lt-LT': 'Lietuvių',
                'lv-LV': 'Latviešu',
                'nb_NO': 'Norsk',
                'nl-NL': 'Nederlands',
                'pl_PL': 'Polski'
            };

            // 将Strapi数据转换为应用所需的品牌格式
            const brands = data.map(theme => {
                // 处理当前主题的语言配置
                let themeLanguages = [];
                if (theme.languages && Array.isArray(theme.languages) && theme.languages.length > 0) {
                    themeLanguages = theme.languages.map(lang => ({
                        code: lang.key,
                        name: lang.label,
                        nativeName: nativeNameMap[lang.key] || lang.label,
                        isoCode: lang.iso_639_code,
                        order: lang.order || 999,
                        apiData: lang
                    })).sort((a, b) => (a.order || 999) - (b.order || 999));
                }

                return {
                    code: theme.theme_key,
                    name: theme.theme_name,
                    displayName: theme.theme_name,
                    description: `${theme.theme_name} Portal`,
                    strapiData: theme,
                    colors: theme.theme_colors,
                    logo: theme.theme_logo,
                    favicon: theme.theme_logos?.favicon,
                    onwhite_logo: theme.theme_logos?.onwhite_logo,
                    oncolor_logo: theme.theme_logos?.oncolor_logo,
                    menus: theme.menu,
                    languages: themeLanguages,
                    login: theme.login,
                    translations: theme.translations,
                    pages: theme.pages || [], // 添加页面配置数据
                    // 添加新的配置字段
                    communication: theme.communication,
                    legal: theme.legal,
                    socialprofile: theme.socialprofile
                };
            });

            // 确保品牌顺序稳定：kendo优先，然后按字母顺序
            const sortedBrands = brands.sort((a, b) => {
                if (a.code === 'kendo') return -1; // kendo排在最前面
                if (b.code === 'kendo') return 1;
                return a.code.localeCompare(b.code); // 其他按字母顺序
            });

            // 提取全局语言配置 - 找到第一个有语言配置的主题作为全局配置
            const themeWithLanguages = brands.find(brand => brand.languages && brand.languages.length > 0);
            let languages = [];
            if (themeWithLanguages) {
                languages = themeWithLanguages.languages;
                console.log('✅ 处理后的全局语言数据 (来自主题:', themeWithLanguages.code + '):',
                    languages.map(l => ({
                        code: l.code,
                        name: l.name,
                        nativeName: l.nativeName,
                        order: l.order
                    }))
                );
            } else {
                console.warn('⚠️ 未找到任何主题的语言配置数据，将使用静态配置');
            }

            // 提取全局页面配置 - 合并所有品牌的页面配置
            const allPages = [];
            brands.forEach(brand => {
                if (brand.pages && Array.isArray(brand.pages)) {
                    // 为每个页面添加brand信息
                    const brandPages = brand.pages.map(page => ({
                        ...page,
                        brandCode: brand.code,
                        brandName: brand.name
                    }));
                    allPages.push(...brandPages);
                }
            });

            // 将数据存储到语言缓存中
            state.languageCache[languageCode] = {
                brands: sortedBrands,
                languages: languages,
                pages: allPages,
                lastUpdated: new Date().toISOString(),
                isFromAPI: isFromAPI
            };

            // 更新当前语言
            state.currentLanguage = languageCode;

            console.log(`✅ 处理后的${languageCode}语言品牌数据:`, sortedBrands.map(b => ({
                code: b.code,
                displayName: b.displayName,
                hasColors: !!b.colors,
                hasLogo: !!b.logo,
                hasFavicon: !!b.favicon,
                hasMenus: !!b.menus,
                menuCount: b.menus?.length || 0,
                hasLanguages: !!b.languages && b.languages.length > 0,
                languageCount: b.languages?.length || 0,
                hasTranslations: !!b.translations,
                translationKeys: b.translations ? Object.keys(b.translations) : [],
                hasPages: !!b.pages && b.pages.length > 0,
                pageCount: b.pages?.length || 0
            })));

            console.log(`✅ 处理后的${languageCode}语言页面数据:`, allPages.map(p => ({
                id: p.id,
                name: p.name,
                pageTemplate: p.page_template,
                brandCode: p.brandCode,
                contentAreaCount: p.content_area?.length || 0
            })));

            state.loading = false;
            state.error = null;
        },
        setThemesError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetThemes: (state) => {
            state.languageCache = {};
            state.currentLanguage = 'en_US';
            state.loading = false;
            state.error = null;
        },
        clearLanguageCache: (state, action) => {
            const { languageCode } = action.payload;
            if (languageCode) {
                delete state.languageCache[languageCode];
            } else {
                state.languageCache = {};
            }
        },
        // 新增：设置页面数据的action
        setPagesData: (state, action) => {
            const { languageCode = state.currentLanguage, pages } = action.payload;
            if (state.languageCache[languageCode]) {
                state.languageCache[languageCode].pages = pages;
            }
        },
        // 新增：添加单个页面的action
        addPage: (state, action) => {
            const { page, languageCode = state.currentLanguage } = action.payload;
            if (state.languageCache[languageCode]) {
                const existingIndex = state.languageCache[languageCode].pages.findIndex(p => p.id === page.id && p.brandCode === page.brandCode);
                if (existingIndex >= 0) {
                    state.languageCache[languageCode].pages[existingIndex] = page;
                } else {
                    state.languageCache[languageCode].pages.push(page);
                }
            }
        },
        // 新增：删除页面的action
        removePage: (state, action) => {
            const { id, brandCode, languageCode = state.currentLanguage } = action.payload;
            if (state.languageCache[languageCode]) {
                state.languageCache[languageCode].pages = state.languageCache[languageCode].pages.filter(p => !(p.id === id && p.brandCode === brandCode));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchThemes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchThemes.fulfilled, (state, action) => {
                // 处理获取成功的情况，使用现有的setThemesData逻辑
                const { data, languageCode } = action.payload;
                if (data && Array.isArray(data)) {
                    // 复用现有的setThemesData逻辑
                    themesSlice.caseReducers.setThemesData(state, {
                        payload: { data, isFromAPI: true, languageCode: languageCode || 'en_US' }
                    });
                }
            })
            .addCase(fetchThemes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch themes';
            });
    }
});

export const {
    setThemesLoading,
    setCurrentLanguage,
    setThemesData,
    setThemesError,
    resetThemes,
    clearLanguageCache,
    setPagesData,
    addPage,
    removePage
} = themesSlice.actions;

// Selectors
export const selectCurrentLanguage = (state) => state.themes.currentLanguage;
export const selectLanguageCache = (state) => state.themes.languageCache;
export const selectThemesLoading = (state) => state.themes.loading;
export const selectIsLoading = (state) => state.themes.loading; // 新增，现代命名
export const selectThemesError = (state) => state.themes.error;

// 当前语言的数据selectors
export const selectBrands = (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    return currentLangData?.brands || state.themes.defaultBrands;
};

export const selectLanguages = (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    return currentLangData?.languages || [];
};

export const selectPages = (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    return currentLangData?.pages || [];
};

export const selectIsFromAPI = (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    return currentLangData?.isFromAPI || false;
};

export const selectLastUpdated = (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    return currentLangData?.lastUpdated || null;
};

// 特定语言的数据selectors
export const selectBrandsByLanguage = (languageCode) => (state) => {
    const langData = state.themes.languageCache[languageCode];
    return langData?.brands || state.themes.defaultBrands;
};

export const selectLanguagesByLanguage = (languageCode) => (state) => {
    const langData = state.themes.languageCache[languageCode];
    return langData?.languages || [];
};

export const selectPagesByLanguage = (languageCode) => (state) => {
    const langData = state.themes.languageCache[languageCode];
    return langData?.pages || [];
};

// 检查语言缓存状态
export const selectHasLanguageCache = (languageCode) => (state) =>
    !!state.themes.languageCache[languageCode];

// 页面相关的selectors
export const selectPagesByBrand = (brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.filter(page => page.brandCode === brandCode);
};

export const selectPageByName = (pageName, brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.find(page => page.name === pageName && (!brandCode || page.brandCode === brandCode));
};

export const selectPageById = (pageId, brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.find(page => page.id === pageId && (!brandCode || page.brandCode === brandCode));
};

export const selectHomePagesByBrand = (brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.filter(page => page.page_template === 'homepage' && (!brandCode || page.brandCode === brandCode));
};

export const selectBrandBookPagesByBrand = (brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const pages = currentLangData?.pages || [];
    return pages.filter(page => page.page_template === 'brandbook' && (!brandCode || page.brandCode === brandCode));
};

// Legal configuration selectors
export const selectLegalByBrand = (brandCode) => (state) => {
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    const brands = currentLangData?.brands || state.themes.defaultBrands;
    const brand = brands.find(b => b.code === brandCode);

    if (!brand || !brand.legal) {
        return {
            hasLegal: false,
            legal: null,
            error: `No legal configuration found for brand: ${brandCode}`
        };
    }

    return {
        hasLegal: true,
        legal: {
            id: brand.legal.id || null,
            termsCondition: brand.legal.termsCondition || null,
            privayPolicy: brand.legal.privayPolicy || null,
            // Raw legal data for custom processing
            rawData: brand.legal
        },
        error: null
    };
};


export default themesSlice.reducer; 