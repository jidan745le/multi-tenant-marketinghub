import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
import fetchKendoAssets from '../services/kendoAssetsMetaDataApi';

// 视频类型选项
export const videoCategoryOptions = [
    { value: 'Marketing Videos', label: 'Marketing Videos' },
    { value: 'Category Videos', label: 'Category Videos' }
];

// 创建日期选项
export const videoCreationDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last_2_weeks', label: 'Last 2 weeks' },
    { value: 'last_1_month', label: 'Last 1 month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_1_year', label: 'Last 1 year' },
];

// Videos筛选器配置
export const videoListConfigs = [
    {
        order: 1,
        label: 'Video File Name',
        component: 'input',
        key: 'filename',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search for video file name'
    },
    {
        order: 11,
        label: 'SKU Code',
        component: 'textarea',
        key: 'sku-code',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search for SKU code',
        children: [
            {
                label: 'Mass Search',
                desc: 'Enter multiple SKU codes separated by semicolons',
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
        component: 'input',
        key: 'tags',
        type: 'string',
        defaultValue: '',
        placeholder: 'Search by tags'
    },
    {
        order: 31,
        label: 'Video Type',
        component: 'checkbox',
        key: 'media-category',
        type: 'array',
        defaultValue: [], // UI默认不勾选
        enum: videoCategoryOptions,
        defaultCollapseCount: 6
    },
    {
        order: 52,
        label: 'Creation Date',
        component: 'radio',
        key: 'creation-date',
        type: 'string',
        defaultValue: 'all',
        enum: videoCreationDateOptions
    }
];

// 动态 Videos API包装函数，支持多品牌，使用 getAssetsByMetadata
export const fetchVideosAPI = async (params, brand = 'kendo') => {
    try {
        const brandName = brand.toUpperCase();
        console.log(`🎥 Videos Catalogue - Fetching ${brandName} videos at:`, new Date().toISOString());
        console.log(`📋 Videos Catalogue - Search params for ${brandName}:`, params);

        // 记录日期过滤条件
        if (params['creation-date-from'] || params['creation-date-to'] || (params['creation-date'] && params['creation-date'] !== 'all')) {
            console.log('📅 Video date filters applied:', {
                fromDate: params['creation-date-from'],
                toDate: params['creation-date-to'],
                quickFilter: params['creation-date']
            });
        }

        // 构建视频特定的过滤参数
        const videoParams = {
            ...params,
            brand, // 传递品牌参数
            'media-type': ['Videos'], // 只获取视频文件
        };

        // 调用 getAssetsByMetadata API 获取原始数据
        const graphqlResponse = await fetchKendoAssets(videoParams);

        // 检查API错误
        if (graphqlResponse.errors) {
            throw new Error(graphqlResponse.errors[0].message);
        }

        // 使用Adapter转换数据
        const result = adaptGraphQLAssetsResponse(graphqlResponse);

        console.log(`✅ Videos Catalogue - ${brandName} Videos received:`, {
            count: result.list.length,
            totalSize: result.totalSize,
            totalPages: Math.ceil(result.totalSize / (params.limit || 20))
        });

        // 直接返回GraphQL查询结果，所有筛选都在服务端完成
        console.log('📊 Videos Catalogue - Pagination info:', {
            currentPage: Math.floor((params.offset || 0) / (params.limit || 20)) + 1,
            pageSize: params.limit || 20,
            totalItems: result.totalSize,
            totalPages: Math.ceil(result.totalSize / (params.limit || 20)),
            currentPageItems: result.list.length
        });

        // 显示前几个视频的信息
        if (result.list.length > 0) {
            console.log('🎥 Sample video files:', result.list.slice(0, 3).map(video => ({
                filename: video.filename,
                createdDate: video.createdDate,
                mediaType: video.mediaType,
                fileSize: video.fileSize,
                mimetype: video.mimetype
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
        console.error('❌ Videos Catalogue - Error fetching videos:', error);
        return {
            list: [],
            startIndex: 0,
            totalSize: 0,
            pageSize: 0,
            error: error.message
        };
    }
};

// 动态Videos Catalogue配置函数，支持多品牌
export const createVideoCatalogueConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();
    // 默认全选所有视频类型
    const defaultVideoCategories = videoCategoryOptions.map(opt => opt.value);

    return {
        // 筛选器配置
        filterConfig: {
            filters: videoListConfigs
        },
        // 视频网格配置
        productConfig: {
            // 获取视频数据的Promise函数（绑定品牌参数）
            fetchProducts: Object.assign(
                (params) => {
                    // 如果用户没有指定 media-category，使用默认值（全选所有视频类型）
                    const mediaCategory = params['media-category'] && params['media-category'].length > 0
                        ? params['media-category']
                        : defaultVideoCategories;

                    return fetchVideosAPI({
                        ...params,
                        'media-category': mediaCategory
                    }, brand);
                },
                { brand: brand } // 添加品牌标识，确保函数被识别为不同
            ),
            // 页面大小
            pageSize: 12,
            // 卡片工具功能配置
            cardActions: {
                show_title: true,
                show_eyebrow: true, // 显示 "Videos" mediaType
                show_download: true,
                show_cart: false,
                show_view: true,
                show_favorite: false,
                show_open_product_page: false // 在 Video 页面隐藏扳手图标
            },
            // 网格标题
            title: `${brandName} Video Library`
        }
    };
};

// 向后兼容的默认配置（KENDO）
export const videosCatalogueConfig = createVideoCatalogueConfig('kendo'); 