import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// 支持的品牌配置
export const supportedBrands = [
    {
        code: 'kendo-china',
        name: 'KENDO China',
        displayName: 'KENDO China',
        description: 'KENDO China Marketing Portal'
    },
    {
        code: 'saame-oem-bosch',
        name: 'Saame OEM - Bosch',
        displayName: 'Saame OEM - Bosch',
        description: 'Saame OEM Bosch Portal'
    },
    {
        code: 'saame-oem-general',
        name: 'Saame OEM - General',
        displayName: 'Saame OEM - General',
        description: 'Saame OEM General Portal'
    },
];

export const useBrand = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    console.log('useBrand: location.pathname =', location.pathname);
    console.log('useBrand: params =', params);

    // 如果params.brand是undefined，尝试从URL路径中解析
    let brandFromUrl = params.brand;
    if (!brandFromUrl) {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        console.log('useBrand: pathSegments =', pathSegments);
        // 路径格式应该是 /:lang/:brand/:page
        if (pathSegments.length >= 2) {
            brandFromUrl = pathSegments[1];
        }
    }

    // 直接从URL参数获取当前品牌，确保实时同步
    const currentBrand = brandFromUrl || 'kendo-china';

    console.log('useBrand: params.brand =', params.brand, 'brandFromUrl =', brandFromUrl, 'currentBrand =', currentBrand);

    // 不再使用useState来存储currentBrand，直接使用URL中的值
    // 这样可以确保组件总是显示正确的品牌

    // 切换品牌函数
    const changeBrand = useCallback((newBrand) => {
        if (!newBrand || newBrand === currentBrand) return;

        const supportedBrandCodes = supportedBrands.map(brand => brand.code);
        if (!supportedBrandCodes.includes(newBrand)) {
            console.warn(`Unsupported brand: ${newBrand}`);
            return;
        }

        // 构建新的路径：${language}/${brand}/${page}
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const currentLanguage = params.lang || 'en_GB'; // 默认语言
        const currentPage = pathSegments[2] || 'products'; // 默认页面

        // 构建新路径
        const newPath = `/${currentLanguage}/${newBrand}/${currentPage}`;

        // 保留查询参数
        const search = location.search;

        // 导航到新路径
        navigate(newPath + search);
    }, [currentBrand, location, navigate, params]);

    // 获取当前品牌信息
    const getCurrentBrandInfo = useCallback(() => {
        return supportedBrands.find(brand => brand.code === currentBrand) || supportedBrands[0];
    }, [currentBrand]);

    // 获取品牌主题配置（扩展功能）
    const getBrandTheme = useCallback(() => {
        const brandInfo = getCurrentBrandInfo();

        // 根据品牌返回不同的主题配置
        switch (brandInfo.code) {
            case 'kendo-china':
                return {
                    primaryColor: '#ff6600',
                    secondaryColor: '#003366',
                    logo: '/logos/kendo-china-logo.png'
                };
            case 'saame-oem-bosch':
                return {
                    primaryColor: '#0066cc',
                    secondaryColor: '#003366',
                    logo: '/logos/bosch-logo.png'
                };
            case 'saame-oem-general':
                return {
                    primaryColor: '#666666',
                    secondaryColor: '#333333',
                    logo: '/logos/general-logo.png'
                };
            default:
                return {
                    primaryColor: '#ff6600',
                    secondaryColor: '#003366',
                    logo: '/logos/kendo-china-logo.png'
                };
        }
    }, [getCurrentBrandInfo]);

    return {
        currentBrand,
        supportedBrands,
        changeBrand,
        getCurrentBrandInfo,
        getBrandTheme,
    };
}; 