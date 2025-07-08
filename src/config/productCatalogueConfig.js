// 产品类型选项 (基于真实数据)
export const productTypeOptions = [
    { value: 'combo-kit', label: 'Combo Kit' },
    { value: 'kit', label: 'Kit' },
    { value: 'tool-only', label: 'Tool Only' },
    { value: 'accessory', label: 'Accessory' },
    { value: 'string-trimmer', label: 'String Trimmer' },
    { value: 'blower', label: 'Blower' },
    { value: 'snow-blower', label: 'Snow Blower' },
    { value: 'battery', label: 'Battery' },
    { value: 'charger', label: 'Charger' },
];

// 产品分类选项
export const productCategoryOptions = [
    { value: 'hand-tools', label: 'Hand Tools' },
    { value: 'power-tool-accessories', label: 'Power Tool Accessories' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'ppe', label: 'PPE' },
    { value: 'batteries-chargers', label: 'Batteries & Chargers' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'telescopic', label: 'Telescopic' },
    { value: 'ride-on-mowers', label: 'Ride on Mowers' },
    { value: 'robot-mowers', label: 'Robot Mowers' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'auger', label: 'Auger' },
    { value: 'snow-throwers', label: 'Snow Throwers' },
];

// FilterSidebar 配置
export const productListConfigs = [
    {
        order: 1,
        label: 'Model Name',
        component: 'input',
        key: 'product-name',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search model name'
    },
    {
        order: 11,
        label: 'Model Number',
        component: 'textarea',
        key: 'model-number',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search model number',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple model numbers separated by semicolons',
                clickMethod: 'onMassSearch',
                component: 'input',
                key: 'mass_download',
                type: 'button',
            }
        ]
    },
    {
        order: 21,
        label: 'EAN',
        component: 'textarea',
        key: 'ean',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search EAN',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple EAN codes separated by semicolons',
                clickMethod: 'onMassSearch',
                component: 'input',
                key: 'mass_download',
                type: 'button',
            }
        ]
    },
    {
        order: 31,
        label: 'Type',
        component: 'checkbox',
        key: 'product-type',
        type: 'array',
        defaultValue: [],
        enum: productTypeOptions.filter((v) => v.label !== 'Accessory'),
        defaultCollapseCount: 7
    },
    {
        order: 41,
        label: 'Product Category',
        component: 'checkbox',
        key: 'product-category',
        type: 'array',
        defaultValue: [],
        enum: productCategoryOptions,
        defaultCollapseCount: 6
    }
];

// 模拟获取产品数据的API函数
export const fetchProductsAPI = async (params) => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 使用真实的产品数据格式
    const realProductData = [
        {
            "modelName": "POWER+ 15\" POWERLOAD™ String Trimmer with Aluminum Telescopic Shaft & 670 CFM Blower Combo Kit with 4.0Ah Battery and 56V Standard Charger",
            "thumbnail": "D12000125783951",
            "customerFasicModelNumber": "ST6703LB",
            "enrichmentStatus": {
                "id": "1101@501",
                "label": "Local data ready - Active",
                "entityId": 7300
            },
            "modelNumber": "ST6703LB",
            "sellable": "true",
            "region": "NA",
            "creationDate": "",
            "brand": "EGO",
            "productType": "Combo Kit"
        },
        {
            "modelName": "12\" Snow Shovel Belt",
            "thumbnail": "D1200012565187",
            "customerFasicModelNumber": "AVB1200",
            "enrichmentStatus": {
                "id": "1101@501",
                "label": "Local data ready - Active",
                "entityId": 7300
            },
            "modelNumber": "AVB1200",
            "sellable": "true",
            "region": "NA",
            "creationDate": "",
            "brand": "EGO",
            "productType": "Accessory"
        },
        {
            "modelName": "Single-Stage Snow Blower Skid Shoes (Pair)",
            "thumbnail": "D1200012565195",
            "customerFasicModelNumber": "AKS2130D",
            "enrichmentStatus": {
                "id": "1101@501",
                "label": "Local data ready - Active",
                "entityId": 7300
            },
            "modelNumber": "AKS2130D",
            "sellable": "true",
            "region": "NA",
            "creationDate": "",
            "brand": "EGO",
            "productType": "Accessory"
        },
        {
            "modelName": "High-Performance String Trimmer Line | 125' x 0.095\"",
            "thumbnail": "D12000125783640",
            "customerFasicModelNumber": "AL2438",
            "enrichmentStatus": {
                "id": "1101@501",
                "label": "Local data ready - Active",
                "entityId": 7300
            },
            "modelNumber": "AL2438",
            "sellable": "true",
            "region": "NA",
            "creationDate": "",
            "brand": "EGO",
            "productType": "Accessory"
        }
    ];

    // 生成更多模拟数据基于真实格式
    const sampleProducts = Array.from({ length: 50 }, (_, index) => {
        const baseProduct = realProductData[index % realProductData.length];
        const thumbnailId = `D${12000125783000 + index}`;
        return {
            id: index + 1,
            modelName: `${baseProduct.modelName} - Variant ${index + 1}`,
            thumbnail: thumbnailId,
            customerFasicModelNumber: `${baseProduct.customerFasicModelNumber}${String(index + 1).padStart(2, '0')}`,
            enrichmentStatus: baseProduct.enrichmentStatus,
            modelNumber: `${baseProduct.modelNumber}${String(index + 1).padStart(2, '0')}`,
            sellable: "true",
            region: "NA",
            creationDate: "",
            brand: "EGO",
            productType: productTypeOptions[index % productTypeOptions.length].label,
            // 添加用于显示的标准化字段
            name: `${baseProduct.modelName} - Variant ${index + 1}`,
            image: `https://infoportal.chervon.com.cn/api/previewImage/${thumbnailId}`,
            category: productCategoryOptions[index % productCategoryOptions.length].label,
            ean: `${1234567890123 + index}`,
        };
    });

    // 应用筛选逻辑
    let filteredProducts = sampleProducts;

    // 按产品名称筛选 (使用 modelName 字段)
    if (params['product-name']) {
        filteredProducts = filteredProducts.filter(product =>
            product.modelName.toLowerCase().includes(params['product-name'].toLowerCase()) ||
            product.name.toLowerCase().includes(params['product-name'].toLowerCase())
        );
    }

    // 按型号筛选 (支持 modelNumber 和 customerFasicModelNumber)
    if (params['model-number']) {
        const modelNumbers = params['model-number'].split(';').map(s => s.trim()).filter(Boolean);
        filteredProducts = filteredProducts.filter(product =>
            modelNumbers.some(modelNumber =>
                product.modelNumber.toLowerCase().includes(modelNumber.toLowerCase()) ||
                product.customerFasicModelNumber.toLowerCase().includes(modelNumber.toLowerCase())
            )
        );
    }

    // 按EAN筛选
    if (params['ean']) {
        const eans = params['ean'].split(';').map(s => s.trim()).filter(Boolean);
        filteredProducts = filteredProducts.filter(product =>
            eans.some(ean =>
                product.ean.includes(ean) ||
                product.thumbnail.includes(ean)  // 也可以按 thumbnail ID 搜索
            )
        );
    }

    // 按类型筛选 (使用 productType 字段)
    if (params['product-type'] && params['product-type'].length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            params['product-type'].some(type =>
                product.productType.toLowerCase().includes(type.toLowerCase().replace('-', ' '))
            )
        );
    }

    // 按分类筛选
    if (params['product-category'] && params['product-category'].length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            params['product-category'].some(category =>
                product.category.toLowerCase().includes(category.toLowerCase().replace('-', ' '))
            )
        );
    }

    // 分页处理
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    // 返回真实API格式
    return {
        startIndex: offset,
        totalSize: filteredProducts.length,
        pageSize: limit,
        list: paginatedProducts
    };
};

// 完整的ProductCatalogue配置
export const productCatalogueConfig = {
    // 筛选器配置
    filterConfig: {
        filters: productListConfigs
    },
    // 产品网格配置
    gridConfig: {
        // 获取产品数据的Promise函数
        fetchProducts: fetchProductsAPI,
        // 页面大小
        pageSize: 12,
        // 卡片工具功能配置（对应图片中的开关）
        cardActions: {
            show_file_type: false,
            show_eyebrow: true,
            show_open_pdf: true,
            show_open_product_page: true,
            show_preview_media: true,
        }
    }
}; 