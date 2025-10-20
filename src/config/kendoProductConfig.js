import { fetchCategoryTree, fetchKendoProducts } from '../services/graphqlApi';

// KENDO产品类型选项 (基于截图更新)
export const kendoProductTypeOptions = [
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

// by Trade (Application字段) 选项
export const kendoApplicationOptions = [
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

// Created 时间范围选项 (days: 往前推的天数, 'year-start': 今年开始)
export const kendoCreatedOptions = [
    { value: 'last-week', label: 'Last Week', days: 7 },
    { value: 'last-month', label: 'Last Month', days: 30 },
    { value: 'last-3-months', label: 'Last 3 months', days: 90 },
    { value: 'last-6-months', label: 'Last 6 months', days: 180 },
    { value: 'this-year', label: 'This year', days: 'year-start' },
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
        label: 'By Trade',
        component: 'checkbox',
        key: 'application',
        type: 'array',
        defaultValue: [],
        enum: kendoApplicationOptions,
        defaultCollapseCount: 5
    },
    {
        order: 31,
        label: 'Product Type',
        component: 'checkbox',
        key: 'product-type',
        type: 'array',
        defaultValue: [],
        enum: kendoProductTypeOptions,
        defaultCollapseCount: 6
    },
    {
        order: 41,
        label: 'Product Category',
        component: 'tree',
        key: 'product-category',
        type: 'array',
        defaultValue: [],
        fetchTreeData: fetchCategoryTree,
        defaultCollapseCount: 6
    },
    {
        order: 51,
        label: 'Created',
        component: 'date',
        key: 'created-on',
        type: 'string',
        defaultValue: '',
        enum: kendoCreatedOptions,
        defaultCollapseCount: 5
    }
];

// 动态GraphQL API包装函数，支持多品牌
export const fetchKendoProductsAPI = async (params, brand = 'kendo') => {
    try {
        // 调用GraphQL API并传递品牌参数
        const result = await fetchKendoProducts(params, brand);

        // 确保返回格式完全兼容ConfigurableProductGrid组件
        // adapter返回的是pageIndex，这里计算startIndex用于兼容
        const startIndex = (result.pageIndex || 0) * (result.pageSize || 0);

        return {
            startIndex: startIndex,
            pageIndex: result.pageIndex || 0,
            totalSize: result.totalSize || 0,
            pageSize: result.pageSize || params.limit || 20,
            list: result.list || []
        };
    } catch (error) {
        return {
            startIndex: 0,
            pageIndex: 0,
            totalSize: 0,
            pageSize: 0,
            list: [],
            error: error.message
        };
    }
};

// 动态Category Tree API包装函数（固定使用ALL品牌）
export const fetchCategoryTreeAPI = async () => {
    try {
        // 调用GraphQL API（固定使用ALL品牌获取所有分类）
        const result = await fetchCategoryTree();

        return result;
    } catch {
        return [];
    }
};

// 动态ProductCatalogue配置函数，支持多品牌
export const createProductCatalogueConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();

    // 创建筛选器配置（Category Tree固定使用ALL品牌）
    const filtersWithBrand = kendoProductListConfigs.map(filter => {
        // 如果是tree组件，绑定fetchTreeData（使用ALL品牌）
        if (filter.component === 'tree' && filter.fetchTreeData) {
            return {
                ...filter,
                fetchTreeData: () => fetchCategoryTreeAPI()
            };
        }
        return filter;
    });

    return {
        // 筛选器配置
        filterConfig: {
            filters: filtersWithBrand
        },
        // 产品网格配置
        productConfig: {
            // 获取产品数据的Promise函数（绑定品牌参数）
            fetchProducts: Object.assign(
                (params) => fetchKendoProductsAPI(params, brand),
                { brand: brand } // 添加品牌标识，确保函数被识别为不同
            ),
            // 页面大小
            pageSize: 20,
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