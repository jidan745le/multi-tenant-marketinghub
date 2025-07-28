import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 创建异步thunk来处理themes获取
export const fetchThemes = createAsyncThunk(
    'themes/fetchThemes',
    async (strapiResponse, { rejectWithValue }) => {
        try {
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
    brands: defaultBrands,
    languages: [], // 存储动态语言配置
    loading: false,
    error: null,
    lastUpdated: null,
    isFromAPI: false, // 标识数据是否来自API
};

const themesSlice = createSlice({
    name: 'themes',
    initialState,
    reducers: {
        setThemesLoading: (state, action) => {
            state.loading = action.payload;
        },
        setThemesData: (state, action) => {
            const { data, isFromAPI = true } = action.payload;

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
                    translations: theme.translations
                };
            });

            // 确保品牌顺序稳定：kendo优先，然后按字母顺序
            state.brands = brands.sort((a, b) => {
                if (a.code === 'kendo') return -1; // kendo排在最前面
                if (b.code === 'kendo') return 1;
                return a.code.localeCompare(b.code); // 其他按字母顺序
            });

            // 提取全局语言配置 - 找到第一个有语言配置的主题作为全局配置
            const themeWithLanguages = brands.find(brand => brand.languages && brand.languages.length > 0);
            if (themeWithLanguages) {
                state.languages = themeWithLanguages.languages;
                console.log('✅ 处理后的全局语言数据 (来自主题:', themeWithLanguages.code + '):',
                    state.languages.map(l => ({
                        code: l.code,
                        name: l.name,
                        nativeName: l.nativeName,
                        order: l.order
                    }))
                );
            } else {
                console.warn('⚠️ 未找到任何主题的语言配置数据，将使用静态配置');
                state.languages = [];
            }

            console.log('✅ 处理后的品牌数据:', state.brands.map(b => ({
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
                translationKeys: b.translations ? Object.keys(b.translations) : []
            })));

            state.loading = false;
            state.error = null;
            state.lastUpdated = new Date().toISOString();
            state.isFromAPI = isFromAPI;
        },
        setThemesError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // 出错时保持默认品牌配置
            if (!state.isFromAPI) {
                state.brands = defaultBrands;
            }
        },
        resetThemes: (state) => {
            state.brands = defaultBrands;
            state.languages = [];
            state.loading = false;
            state.error = null;
            state.lastUpdated = null;
            state.isFromAPI = false;
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
                const { data } = action.payload;
                if (data && Array.isArray(data)) {
                    // 复用现有的setThemesData逻辑
                    themesSlice.caseReducers.setThemesData(state, {
                        payload: { data, isFromAPI: true }
                    });
                }
            })
            .addCase(fetchThemes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch themes';
                // 出错时保持默认品牌配置
                if (!state.isFromAPI) {
                    state.brands = defaultBrands;
                }
            });
    }
});

export const {
    setThemesLoading,
    setThemesData,
    setThemesError,
    resetThemes
} = themesSlice.actions;

// Selectors
export const selectBrands = (state) => state.themes.brands;
export const selectLanguages = (state) => state.themes.languages;
export const selectThemesLoading = (state) => state.themes.loading;
export const selectIsLoading = (state) => state.themes.loading; // 新增，现代命名
export const selectThemesError = (state) => state.themes.error;
export const selectIsFromAPI = (state) => state.themes.isFromAPI;
export const selectLastUpdated = (state) => state.themes.lastUpdated;

export default themesSlice.reducer; 