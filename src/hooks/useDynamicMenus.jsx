import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectBrands } from '../store/slices/themesSlice';
import { useBrand } from './useBrand';
import { useLanguage } from './useLanguage';

export function useDynamicMenus() {
    const { t } = useTranslation();
    const { currentBrand } = useBrand();
    const { currentLanguage } = useLanguage();
    const brands = useSelector(selectBrands);

    // 获取当前品牌的菜单数据
    const currentBrandData = brands.find(brand => brand.code === currentBrand?.code);
    const apiMenus = currentBrandData?.menus;

    console.log('📋 useDynamicMenus: 当前品牌:', currentBrand?.code);
    console.log('📋 useDynamicMenus: API菜单数据:', apiMenus);

    // 默认静态菜单项作为回退
    const defaultMenuItems = useMemo(() => [
        
    ], [t, currentLanguage, currentBrand?.code]);

    // 处理API菜单数据
    const processedMenuItems = useMemo(() => {
        if (apiMenus && apiMenus.length > 0) {
            console.log('✨ 使用API动态菜单', apiMenus);
            
            return apiMenus
                .filter(menu => {
                    // 过滤掉不完整的菜单项（key或path为null/undefined）
                    return menu.label && menu.key && menu.path;
                })
                .map((menu, index) => {
                    // 使用正确的API字段
                    const menuLabel = menu.label || `Menu ${index + 1}`;
                    const menuKey = menu.key || `menu-${index}`;
                    const menuPath = menu.path ? 
                        `/${currentLanguage}/${currentBrand?.code || 'kendo'}${menu.path}` : 
                        `/${currentLanguage}/${currentBrand?.code || 'kendo'}/page`;

                    // 根据菜单key确定图标
                    const getMenuIcon = (key) => {
                        const iconMap = {
                            'home': 'home',
                            'brand': 'branding_watermark',
                            'brand.book': 'branding_watermark',
                            'products': 'search',
                            'product': 'search',
                            'medias': 'photo_library',
                            'accessory': 'add_circle',
                            'videos': 'video_library'
                        };
                        return iconMap[key] || 'menu';
                    };

                    return {
                        label: menuLabel,
                        icon: <span className="material-symbols-outlined">{getMenuIcon(menuKey)}</span>,
                        key: menuKey,
                        path: menuPath,
                        order: menu.order || (index + 1),
                        // 保留原始API数据
                        apiData: menu,
                        // 处理二级菜单
                        subMenus: menu.menu_l2
                            ?.filter(subMenu => subMenu.label && subMenu.key && subMenu.path)
                            ?.map((subMenu, subIndex) => ({
                                label: subMenu.label || `SubMenu ${subIndex + 1}`,
                                key: subMenu.key || `submenu-${subIndex}`,
                                path: subMenu.path ? 
                                    `/${currentLanguage}/${currentBrand?.code || 'kendo'}${subMenu.path}` :
                                    `/${currentLanguage}/${currentBrand?.code || 'kendo'}/subpage`,
                                order: subMenu.order || (subIndex + 1),
                                apiData: subMenu
                            })) || []
                    };
                }).sort((a, b) => (a.order || 0) - (b.order || 0));
        } else {
            console.log('⚠️ 使用静态默认菜单 (API菜单数据未加载)');
            return defaultMenuItems;
        }
    }, [apiMenus, defaultMenuItems, currentLanguage, currentBrand?.code]);

    return {
        menuItems: processedMenuItems,
        isFromAPI: !!(apiMenus && apiMenus.length > 0),
        apiMenusCount: apiMenus?.length || 0,
        debug: {
            currentBrand: currentBrand?.code,
            hasApiMenus: !!(apiMenus && apiMenus.length > 0),
            originalMenuCount: apiMenus?.length || 0,
            filteredMenuCount: processedMenuItems.length,
            filteredOutMenus: apiMenus?.filter(menu => !menu.label || !menu.key || !menu.path) || [],
            dataSource: (apiMenus && apiMenus.length > 0) ? 'Strapi API' : 'Static Config',
            sampleMenu: processedMenuItems[0] || null
        }
    };
} 