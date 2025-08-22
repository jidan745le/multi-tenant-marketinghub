import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectBrands, selectIsFromAPI, selectThemesLoading } from '../store/slices/themesSlice';

// 支持的品牌配置 - 作为回退使用
export const supportedBrands = [


];

export function useBrand() {
    const params = useParams();
    const navigate = useNavigate();

    // 从Redux获取品牌数据
    const brandsFromRedux = useSelector(selectBrands);
    const themesLoading = useSelector(selectThemesLoading);
    const isFromAPI = useSelector(selectIsFromAPI);

    // 使用Redux中的品牌数据，如果没有则使用默认配置
    const brands = brandsFromRedux && brandsFromRedux.length > 0 ? brandsFromRedux : supportedBrands;

    // 获取当前品牌
    const getCurrentBrand = useCallback(() => {
        if (params.brand) {
            return params.brand;
        }

        // 从URL路径获取当前品牌 - 与apiTranslations.js保持一致
        const pathSegments = window.location.pathname.split('/');
        const brandFromPath = pathSegments[2] || 'kendo'; // 与apiTranslations.js一致
        return brandFromPath;
    }, [params.brand]);

    const currentBrandCode = getCurrentBrand();

    // 智能匹配品牌：首先尝试精确匹配，然后尝试kendo，最后使用第一个可用品牌
    const findBrand = useCallback((brandCode) => {
        // 1. 尝试精确匹配
        let brand = brands.find(brand => brand.code === brandCode);
        if (brand) {
            return brand;
        }

        // 2. 如果没找到，尝试使用kendo
        brand = brands.find(brand => brand.code === 'kendo');
        if (brand) {
            return brand;
        }

        // 3. 最后使用第一个可用品牌
        brand = brands[0];
        return brand;
    }, [brands]);

    const currentBrand = findBrand(currentBrandCode);

    // 切换品牌
    const switchBrand = useCallback((brandCode) => {
        if (brandCode === currentBrandCode) {
            console.log(`已经是当前品牌: ${brandCode}`);
            return;
        }

        console.log('🔄 切换品牌:', brandCode);

        const targetBrand = brands.find(brand => brand.code === brandCode);
        if (targetBrand) {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');

            // 替换品牌部分 - pathSegments[2] 是品牌位置
            if (pathSegments[2]) {
                pathSegments[2] = brandCode;
            } else {
                pathSegments[2] = brandCode;
            }

            const newPath = pathSegments.join('/');

            // 导航到新路径 (翻译加载将由useLanguage hook处理)
            navigate(newPath);
        } else {
            console.warn('❌ 未找到目标品牌:', brandCode);
        }
    }, [brands, currentBrandCode, navigate]);

    // 检查品牌是否有效
    const isValidBrand = useCallback((brandCode) => {
        return brands.some(brand => brand.code === brandCode);
    }, [brands]);

    return {
        brands,
        currentBrand,
        currentBrandCode,
        switchBrand,
        isValidBrand,
        // Redux状态信息
        themesLoading,
        isFromAPI,
        // 调试信息
        debug: {
            brandsCount: brands.length,
            dataSource: isFromAPI ? 'Strapi API' : 'Static Config',
            isLoading: themesLoading
        }
    };
} 