import { fetchCategoryTree } from '../services/graphqlApi';
import { fetchNewProducts } from '../services/newProductsApi';

// 产品类型选项 - 与 Product Catalogue 保持一致
export const newProductTypeOptions = [
    { value: 'Individual Product', label: 'Individual Product' },
    { value: 'Sellable Component', label: 'Sellable Component' },
    { value: 'Non Sellable Component', label: 'Non Sellable Component' },
    { value: 'Baretool', label: 'Baretool' },
    { value: 'Accessory', label: 'Accessory' },
    { value: 'Set', label: 'Set' },
    { value: 'Kit', label: 'Kit' },
    { value: 'Combo Kit', label: 'Combo Kit' },
    { value: 'Sales Kit (Nylon Pack)', label: 'Sales Kit (Nylon Pack)' },
    { value: 'Merchandizing', label: 'Merchandizing' },
    { value: 'InStore material', label: 'InStore material' },
    { value: 'SpareSparts', label: 'SpareSparts' },
];

// By Trade (Application字段) 选项 - 与 Product Catalogue 保持一致
export const newProductApplicationOptions = [
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Construction & Decoration', label: 'Construction & Decoration' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Carpenter', label: 'Carpenter' },
    { value: 'PPE', label: 'PPE' },
    { value: 'Garden', label: 'Garden' },
    { value: 'Power Tools', label: 'Power Tools' },
    { value: 'Empty', label: 'Empty' },
    { value: 'General Tools', label: 'General Tools' },
    { value: 'HoReCa', label: 'HoReCa' },
];

// Created 时间范围选项 for New Products（保留特有的选项）
export const newProductCreatedOptions = [
    { value: 'last-12-months', label: 'Last 12 months' },
    { value: 'last-6-months', label: 'Last 6 months' },
    { value: 'coming-soon', label: 'Coming Soon' },
];

// Category Tree API包装函数
export const fetchCategoryTreeAPI = async () => {
    try {
        console.log(`🌳 Category Tree API called for New Products at:`, new Date().toISOString());
        const result = await fetchCategoryTree();
        console.log(`📊 Category tree loaded for New Products:`, result);
        return result;
    } catch (error) {
        console.error('❌ Error in fetchCategoryTreeAPI:', error);
        return [];
    }
};

// New Products筛选器配置 - 参考 Product Catalogue
export const newProductListConfigs = [
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
        label: 'By Trade',
        component: 'checkbox',
        key: 'application',
        type: 'array',
        defaultValue: [],
        enum: newProductApplicationOptions,
        defaultCollapseCount: 5
    },
    {
        order: 31,
        label: 'Product Type',
        component: 'checkbox',
        key: 'product-type',
        type: 'array',
        defaultValue: [],
        enum: newProductTypeOptions,
        defaultCollapseCount: 6
    },
    {
        order: 41,
        label: 'Product Category',
        component: 'tree',
        key: 'product-category',
        type: 'array',
        defaultValue: [],
        fetchTreeData: fetchCategoryTreeAPI,
        defaultCollapseCount: 6
    },
    {
        order: 51,
        label: 'Created',
        component: 'checkbox',
        key: 'created',
        type: 'array',
        defaultValue: [],
        enum: newProductCreatedOptions,
        defaultCollapseCount: 3
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
            show_favorite: false,
            show_open_pdf: true,
            show_open_product_page: false, // 在 New Release 页面隐藏扳手图标
            show_preview_media: true
        }
    }
}; 