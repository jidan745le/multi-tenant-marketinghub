// Redux Themes 测试工具
import store from '../store';
import { selectBrands, selectIsFromAPI, selectLastUpdated, selectThemesLoading } from '../store/slices/themesSlice';

// 测试Redux状态
export const testReduxThemes = () => {
    const state = store.getState();

    console.group('🧪 Redux Themes 测试');
    console.log('📋 当前状态:', {
        brands: selectBrands(state),
        loading: selectThemesLoading(state),
        isFromAPI: selectIsFromAPI(state),
        lastUpdated: selectLastUpdated(state),
        brandsCount: selectBrands(state).length
    });

    console.log('🎯 品牌详情:');
    selectBrands(state).forEach((brand, index) => {
        console.log(`  ${index + 1}. ${brand.code} - ${brand.displayName}`, {
            hasApiData: !!brand.strapiData,
            description: brand.description
        });
    });

    console.groupEnd();

    return state.themes;
};

// 在浏览器控制台中可用的全局函数
if (typeof window !== 'undefined') {
    window.testReduxThemes = testReduxThemes;
    console.log('🔧 已注册全局测试函数: window.testReduxThemes()');
} 