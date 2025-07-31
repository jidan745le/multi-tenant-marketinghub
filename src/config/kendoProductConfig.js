import { fetchKendoProducts } from '../services/graphqlApi';

// KENDO产品类型选项 (基于GraphQL返回的真实数据)
export const kendoProductTypeOptions = [
    { value: 'Individual Product', label: 'Individual Product' },
    { value: 'Kit', label: 'Kit' },
    { value: 'Combo Kit', label: 'Combo Kit' },
    { value: 'Tool Only', label: 'Tool Only' },
    { value: 'Accessory', label: 'Accessory' },
];

// KENDO产品分类选项 (工具类)
export const kendoProductCategoryOptions = [
    { value: 'clamping-tools', label: 'Clamping Tools' },
    { value: 'hand-tools', label: 'Hand Tools' },
    { value: 'pliers', label: 'Pliers' },
    { value: 'cutting-tools', label: 'Cutting Tools' },
    { value: 'measuring-tools', label: 'Measuring Tools' },
    { value: 'screwdrivers', label: 'Screwdrivers' },
    { value: 'wrenches', label: 'Wrenches' },
    { value: 'specialty-tools', label: 'Specialty Tools' },
];

// KENDO FilterSidebar 配置
export const kendoProductListConfigs = [
    {
        order: 1,
        label: 'Model Name',
        component: 'input',
        key: 'product-name',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search product name'
    },
    {
        order: 11,
        label: 'Model Number',
        component: 'textarea',
        key: 'model-number',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search Virtual Product ID',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple Virtual Product IDs separated by semicolons',
                clickMethod: 'onMassSearch',
                component: 'input',
                key: 'mass_download',
                type: 'button',
            }
        ]
    },
    {
        order: 21,
        label: 'ERP Material Code',
        component: 'textarea',
        key: 'ean',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search ERP Material Code',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple ERP Material Codes separated by semicolons',
                clickMethod: 'onMassSearch',
                component: 'input',
                key: 'mass_download',
                type: 'button',
            }
        ]
    },
    {
        order: 31,
        label: 'Product Type',
        component: 'checkbox',
        key: 'product-type',
        type: 'array',
        defaultValue: [],
        enum: kendoProductTypeOptions,
        defaultCollapseCount: 5
    },
    {
        order: 41,
        label: 'Product Category',
        component: 'checkbox',
        key: 'product-category',
        type: 'array',
        defaultValue: [],
        enum: kendoProductCategoryOptions,
        defaultCollapseCount: 6
    }
];

// 动态GraphQL API包装函数，支持多品牌
export const fetchKendoProductsAPI = async (params, brand = 'kendo') => {
    try {
        const brandName = brand.toUpperCase();
        console.log(`🔍 ${brandName} API called at:`, new Date().toISOString());
        console.log(`📋 Fetching ${brandName} products with params:`, params);

        // 调用GraphQL API并传递品牌参数
        const result = await fetchKendoProducts(params, brand);
        console.log(`✅ ${brandName} API result received:`, {
            productCount: result.list?.length || 0,
            totalSize: result.totalSize,
            totalPages: Math.ceil((result.totalSize || 0) / (params.limit || 20)),
            hasError: !!result.error
        });
        console.log(`📊 ${brandName} Product types found:`, result.list?.map(p => ({
            id: p.id,
            objectType: p.objectType,
            productType: p.productType,
            name: p.name?.substring(0, 30) + '...'
        })));

        // 确保返回格式完全兼容ConfigurableProductGrid组件
        return {
            startIndex: result.startIndex || 0,
            totalSize: result.totalSize || 0,
            pageSize: result.pageSize || params.limit || 20,
            list: result.list || []
        };
    } catch (error) {
        console.error('❌ Error in fetchKendoProductsAPI:', error);
        return {
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: [],
            error: error.message
        };
    }
};

// 动态ProductCatalogue配置函数，支持多品牌
export const createProductCatalogueConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();

    return {
        // 筛选器配置
        filterConfig: {
            filters: kendoProductListConfigs
        },
        // 产品网格配置
        productConfig: {
            // 获取产品数据的Promise函数（绑定品牌参数）
            fetchProducts: Object.assign(
                (params) => fetchKendoProductsAPI(params, brand),
                { brand: brand } // 添加品牌标识，确保函数被识别为不同
            ),
            // 页面大小
            pageSize: 10,
            // 卡片工具功能配置
            cardActions: {
                show_file_type: true,
                show_eyebrow: true,
                show_open_pdf: true,
                show_open_product_page: true,
                show_preview_media: true,
            },
            // 网格标题
            title: `${brandName} Products`
        }
    };
};

// 向后兼容的默认配置（KENDO）
export const kendoProductCatalogueConfig = createProductCatalogueConfig('kendo'); 