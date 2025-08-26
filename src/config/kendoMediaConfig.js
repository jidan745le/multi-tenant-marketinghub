import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
import fetchKendoAssets from '../services/kendoAssetsMetaDataApi';

// 媒体类型选项
export const mediaTypeOptions = [
    { value: 'Images', label: 'Images' },
    { value: 'Videos', label: 'Videos' },
    { value: 'Documents', label: 'Documents' },
    // { value: 'Audio', label: 'Audio' }
];

// 媒体分类选项
export const mediaCategoryOptions = [
    { value: 'Main', label: 'Main' },
    { value: 'On White', label: 'On White' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Action', label: 'Action' },
    { value: 'In Scene', label: 'In Scene' },
    { value: 'Other', label: 'Other' }
];

// 创建日期选项
export const creationDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last_2_weeks', label: 'Last 2 weeks' },
    { value: 'last_1_month', label: 'Last 1 month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_1_year', label: 'Last 1 year' },
];

// Media筛选器配置
export const kendoMediaListConfigs = [
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
        component: 'input',
        key: 'model-number',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search for model number'
    },
    // {
    //     order: 21,
    //     label: 'Folder Path',
    //     component: 'textarea',
    //     key: 'folder-path',
    //     type: 'string',
    //     defaultValue: '',
    //     placeholder: 'Search in folder path'
    // },
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
        label: 'Media Category',
        component: 'checkbox',
        key: 'media-category',
        type: 'array',
        defaultValue: [],
        enum: mediaCategoryOptions,
        defaultCollapseCount: 6
    },

    {
        order: 52,
        label: 'Creation Date',
        component: 'radio',
        key: 'creation-date',
        type: 'string',
        defaultValue: 'all',
        enum: creationDateOptions
    }
];

// 动态 Media API包装函数，支持多品牌
export const fetchKendoMediaAPI = async (params, brand = 'kendo') => {
    try {
        const brandName = brand.toUpperCase();
        console.log(`🔍 Media Catalogue - Fetching ${brandName} assets at:`, new Date().toISOString());
        console.log(`📋 Media Catalogue - Search params for ${brandName}:`, params);

        // 记录日期过滤条件
        if (params['creation-date-from'] || params['creation-date-to'] || (params['creation-date'] && params['creation-date'] !== 'all')) {
            console.log('📅 Date filters applied:', {
                fromDate: params['creation-date-from'],
                toDate: params['creation-date-to'],
                quickFilter: params['creation-date']
            });
        }

        // 调用Assets API获取原始数据，传递品牌参数
        const graphqlResponse = await fetchKendoAssets({ ...params, brand });

        // 检查API错误
        if (graphqlResponse.errors) {
            throw new Error(graphqlResponse.errors[0].message);
        }

        // 使用Adapter转换数据
        const result = adaptGraphQLAssetsResponse(graphqlResponse);

        console.log(`✅ Media Catalogue - ${brandName} Assets received:`, {
            count: result.list.length,
            totalSize: result.totalSize,
            totalPages: Math.ceil(result.totalSize / (params.limit || 20))
        });

        // 直接返回GraphQL查询结果，所有筛选都在服务端完成
        console.log('📊 Media Catalogue - Pagination info:', {
            currentPage: Math.floor((params.offset || 0) / (params.limit || 20)) + 1,
            pageSize: params.limit || 20,
            totalItems: result.totalSize,
            totalPages: Math.ceil(result.totalSize / (params.limit || 20)),
            currentPageItems: result.list.length
        });

        // 显示前几个资产的创建日期信息
        if (result.list.length > 0) {
            console.log('📅 Sample asset creation dates:', result.list.slice(0, 3).map(asset => ({
                filename: asset.filename,
                createdDate: asset.createdDate,
                mediaType: asset.mediaType
            })));
        }

        return {
            list: result.list,
            startIndex: result.startIndex || 0,
            totalSize: result.totalSize,
            pageSize: result.pageSize,
            _metadata: result._metadata
        };

    } catch (error) {
        console.error('❌ Media Catalogue - Error fetching assets:', error);
        return {
            list: [],
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            error: error.message
        };
    }
};

// 动态Media Catalogue配置函数，支持多品牌
export const createMediaCatalogueConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();

    return {
        // 筛选器配置
        filterConfig: {
            filters: kendoMediaListConfigs
        },
        // 媒体网格配置
        productConfig: { // 保持与现有组件兼容的名称
            // 获取媒体数据的Promise函数（绑定品牌参数）
            fetchProducts: Object.assign(
                (params) => fetchKendoMediaAPI(params, brand),
                { brand: brand } // 添加品牌标识，确保函数被识别为不同
            ),
            // 页面大小
            pageSize: 12,
            // 卡片工具功能配置
            cardActions: {
                show_file_type: true,
                show_eyebrow: true,
                show_open_pdf: false,
                show_open_product_page: false,
                show_preview_media: true,
                show_download: true,
            },
            // 网格标题
            title: `${brandName} Media Assets`
        }
    };
};

// 向后兼容的默认配置（KENDO）
export const kendoMediaCatalogueConfig = createMediaCatalogueConfig('kendo'); 