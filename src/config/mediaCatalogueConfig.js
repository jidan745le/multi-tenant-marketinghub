// 媒体类型选项 (基于UI参考图)
export const mediaTypeOptions = [
    { value: 'Main', label: 'Main' },
    { value: 'On White', label: 'On White' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Action', label: 'Action' },
    { value: 'In Scene', label: 'In Scene' },
];

// 创建日期选项 (基于UI参考图)
export const creationDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last_2_weeks', label: 'Last 2 weeks' },
    { value: 'last_1_month', label: 'Last 1 month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_1_year', label: 'Last 1 year' },
];

// MediaSidebar 配置 (基于UI参考图)
export const mediaListConfigs = [
    {
        order: 1,
        label: 'File Name',
        component: 'input',
        key: 'filename',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search for file name'
    },
    {
        order: 11,
        label: 'Model Number',
        component: 'textarea',
        key: 'model-number',
        type: 'string',
        defaultValue: '',
        placeholder: 'Enter model number',
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
        label: 'Tags',
        component: 'textarea',
        key: 'tags',
        type: 'string',
        defaultValue: '',
        placeholder: 'Enter tags'
    },
    {
        order: 31,
        label: 'Media Type',
        component: 'checkbox',
        key: 'media-type',
        type: 'array',
        defaultValue: [],
        enum: mediaTypeOptions,
        defaultCollapseCount: 10
    },
    {
        order: 41,
        label: 'Creation Date',
        component: 'radio',
        key: 'creation-date',
        type: 'string',
        defaultValue: 'all',
        enum: creationDateOptions
    }
];

// 模拟获取媒体数据的API函数 (基于reference代码逻辑)
export const fetchMediasAPI = async (params) => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 使用真实的媒体数据格式 (基于UI参考图)
    const realMediaData = [
        {
            "identifier": "D12000125783951",
            "filename": "ST6703LB_Main.jpg",
            "mediaType": "Main",
            "modelNumber": "ST6703LB",
            "tags": "power tool, outdoor, string trimmer",
            "region": "NA",
            "brand": "EGO",
            "fileSize": "2.5MB",
            "createdDate": "2024-01-15",
            "downloadUrl": "/api/download/D12000125783951"
        },
        {
            "identifier": "D12000125783952",
            "filename": "ST6703LB_OnWhite.jpg",
            "mediaType": "On White",
            "modelNumber": "ST6703LB",
            "tags": "product shot, white background",
            "region": "NA",
            "brand": "EGO",
            "fileSize": "1.8MB",
            "createdDate": "2024-01-16",
            "downloadUrl": "/api/download/D12000125783952"
        },
        {
            "identifier": "D12000125783953",
            "filename": "AVB1200_Lifestyle.jpg",
            "mediaType": "Lifestyle",
            "modelNumber": "AVB1200",
            "tags": "lifestyle, garden, outdoor use",
            "region": "NA",
            "brand": "EGO",
            "fileSize": "4.2MB",
            "createdDate": "2024-01-17",
            "downloadUrl": "/api/download/D12000125783953"
        },
        {
            "identifier": "D12000125783954",
            "filename": "AKS2130D_Action.jpg",
            "mediaType": "Action",
            "modelNumber": "AKS2130D",
            "tags": "action shot, in use, snow removal",
            "region": "NA",
            "brand": "EGO",
            "fileSize": "3.1MB",
            "createdDate": "2024-01-18",
            "downloadUrl": "/api/download/D12000125783954"
        },
        {
            "identifier": "D12000125783955",
            "filename": "AL2438_InScene.jpg",
            "mediaType": "In Scene",
            "modelNumber": "AL2438",
            "tags": "context, environment, usage scenario",
            "region": "NA",
            "brand": "EGO",
            "fileSize": "2.9MB",
            "createdDate": "2024-01-19",
            "downloadUrl": "/api/download/D12000125783955"
        }
    ];

    // 生成更多模拟媒体数据
    const sampleMedias = Array.from({ length: 60 }, (_, index) => {
        const baseMedia = realMediaData[index % realMediaData.length];
        const identifier = `D${12000125783000 + index}`;
        const mediaType = mediaTypeOptions[index % mediaTypeOptions.length].value;
        const modelNumber = `${baseMedia.modelNumber}${String(index + 1).padStart(2, '0')}`;

        // 生成随机日期 (最近一年内)
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 365);
        const createdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        return {
            id: index + 1,
            identifier: identifier,
            filename: `${modelNumber}_${mediaType.replace(' ', '')}.jpg`,
            mediaType: mediaType,
            modelNumber: modelNumber,
            tags: `${baseMedia.tags}, model-${modelNumber}, type-${mediaType.toLowerCase()}`,
            region: "NA",
            brand: "EGO",
            fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)}MB`,
            createdDate: createdDate.toISOString().split('T')[0],
            downloadUrl: `/api/download/${identifier}`,
            // 添加用于显示的标准化字段  
            __title: mediaType,
            __subtitle: `${modelNumber}_${mediaType.replace(' ', '')}.jpg`,
            name: `${modelNumber} - ${mediaType}`,
            image: `https://infoportal.chervon.com.cn/api/previewImage/${identifier}`,
            // 支持选择状态
            checked: false
        };
    });

    // 应用筛选逻辑 (基于reference代码)
    let filteredMedias = sampleMedias;

    // 按文件名筛选
    if (params['filename']) {
        filteredMedias = filteredMedias.filter(media =>
            media.filename.toLowerCase().includes(params['filename'].toLowerCase())
        );
    }

    // 按型号筛选 (支持批量搜索)
    if (params['model-number']) {
        const modelNumbers = params['model-number'].split(';').map(s => s.trim()).filter(Boolean);
        filteredMedias = filteredMedias.filter(media =>
            modelNumbers.some(modelNumber =>
                media.modelNumber.toLowerCase().includes(modelNumber.toLowerCase())
            )
        );
    }

    // 按媒体类型筛选
    if (params['media-type'] && params['media-type'].length > 0) {
        filteredMedias = filteredMedias.filter(media =>
            params['media-type'].includes(media.mediaType)
        );
    }

    // 按标签筛选
    if (params['tags']) {
        const searchTags = params['tags'].toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        filteredMedias = filteredMedias.filter(media =>
            searchTags.some(tag =>
                media.tags.toLowerCase().includes(tag)
            )
        );
    }

    // 按创建日期筛选
    if (params['creation-date'] && params['creation-date'] !== 'all') {
        const now = new Date();
        let cutoffDate;

        switch (params['creation-date']) {
            case 'last_2_weeks':
                cutoffDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
                break;
            case 'last_1_month':
                cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'last_3_months':
                cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'last_1_year':
                cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoffDate = null;
        }

        if (cutoffDate) {
            filteredMedias = filteredMedias.filter(media =>
                new Date(media.createdDate) >= cutoffDate
            );
        }
    }

    // 分页处理
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginatedMedias = filteredMedias.slice(offset, offset + limit);

    // 返回真实API格式 (基于reference代码)
    return {
        startIndex: offset,
        totalSize: filteredMedias.length,
        pageSize: limit,
        list: paginatedMedias
    };
};

// 完整的MediaCatalogue配置
export const mediaCatalogueConfig = {
    // 筛选器配置
    filterConfig: {
        filters: mediaListConfigs
    },
    // 媒体网格配置
    productConfig: { // 保持与现有组件兼容的名称
        // 获取媒体数据的Promise函数
        fetchProducts: fetchMediasAPI, // 保持与现有组件兼容的名称
        // 页面大小
        pageSize: 20,
        // 卡片工具功能配置（适配媒体文件）
        cardActions: {
            show_file_type: true,
            show_eyebrow: true,
            show_open_pdf: false, // 媒体不需要PDF预览
            show_open_product_page: false, // 媒体不需要产品页面
            show_preview_media: true,
            show_download: true, // 媒体需要下载功能
        }
    }
}; 