import { fetchNewProducts } from '../services/newProductsApi';

// 产品类型选项 - 与现有配置保持一致
export const newProductTypeOptions = [
    { value: 'Individual Product', label: 'Individual Product' },
    { value: 'Product Set', label: 'Product Set' },
    { value: 'Bundle', label: 'Bundle' },
    { value: 'Variant', label: 'Variant' }
];

// 产品分类选项 - 与现有配置保持一致
export const newProductCategoryOptions = [
    { value: 'Hand Tools', label: 'Hand Tools' },
    { value: 'Power Tools', label: 'Power Tools' },
    { value: 'Measuring Tools', label: 'Measuring Tools' },
    { value: 'Cutting Tools', label: 'Cutting Tools' },
    { value: 'Safety Equipment', label: 'Safety Equipment' },
    { value: 'Accessories', label: 'Accessories' }
];

// New Products筛选器配置
export const newProductListConfigs = [
    {
        order: 11,
        label: 'Product Name',
        component: 'input',
        key: 'product-name',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search new product name'
    },
    {
        order: 21,
        label: 'Model Number',
        component: 'input',
        key: 'model-number',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search Model Number',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple Model Numbers separated by semicolons',
                clickMethod: 'onMassSearch',
                component: 'input',
                key: 'mass_download',
                type: 'button',
            }
        ]
    },
    {
        order: 22,
        label: 'ERP Material Code',
        component: 'input',
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
        enum: newProductTypeOptions,
        defaultCollapseCount: 5
    },
    {
        order: 41,
        label: 'Product Category',
        component: 'checkbox',
        key: 'product-category',
        type: 'array',
        defaultValue: [],
        enum: newProductCategoryOptions,
        defaultCollapseCount: 6
    }
];

// 新产品 GraphQL API包装函数，兼容现有组件接口
export const fetchNewProductsAPI = async (params) => {
    try {
        console.log('🆕 New Products API called at:', new Date().toISOString());
        console.log('📋 Fetching new products with params:', params);

        // 调用新产品GraphQL API（已经在服务层使用了adapter）
        const result = await fetchNewProducts(params);
        console.log('✅ New Products API result received:', {
            productCount: result.list?.length || 0,
            totalSize: result.totalSize,
            totalPages: Math.ceil((result.totalSize || 0) / (params.limit || 20)),
            hasError: !!result.error
        });
        console.log('📊 New product types found:', result.list?.map(p => ({
            id: p.id,
            objectType: p.objectType,
            productType: p.productType,
            name: p.name?.substring(0, 30) + '...',
            onlineDate: p._graphqlData?.OnlineDate || 'Unknown'
        })));

        // 确保返回格式完全兼容ConfigurableProductGrid组件
        return {
            startIndex: result.startIndex || 0,
            totalSize: result.totalSize || 0,
            pageSize: result.pageSize || params.limit || 20,
            list: result.list || []
        };
    } catch (error) {
        console.error('❌ Error in fetchNewProductsAPI:', error);
        return {
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: [],
            error: error.message
        };
    }
};

// 新产品目录配置
export const newProductCatalogueConfig = {
    filterConfig: {
        filters: newProductListConfigs
    },
    productConfig: {
        fetchProducts: fetchNewProductsAPI,
        pageSize: 10,
        cardActions: {
            show_title: true,
            show_eyebrow: true,
            show_download: true,
            show_cart: false,
            show_view: true,
            show_favorite: false
        }
    }
}; 