import { fetchVideos } from '../services/videosApi';

// 媒体分类选项 - 应用于视频资产
export const videoCategoryOptions = [
    { value: 'Main', label: 'Main' },
    { value: 'On White', label: 'On White' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Action', label: 'Action' },
    { value: 'In Scene', label: 'In Scene' },
    { value: 'Other', label: 'Other' }
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
        order: 41,
        label: 'Video Category',
        component: 'checkbox',
        key: 'media-category',
        type: 'array',
        defaultValue: [],
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

// KENDO GraphQL Videos API包装函数
export const fetchVideosAPI = async (params) => {
    try {
        console.log('🎥 Videos Catalogue - Fetching KENDO videos at:', new Date().toISOString());
        console.log('📋 Videos Catalogue - Search params:', params);

        // 记录日期过滤条件
        if (params['creation-date-from'] || params['creation-date-to'] || (params['creation-date'] && params['creation-date'] !== 'all')) {
            console.log('📅 Video date filters applied:', {
                fromDate: params['creation-date-from'],
                toDate: params['creation-date-to'],
                quickFilter: params['creation-date']
            });
        }

        // 调用Videos API获取已适配的数据
        const result = await fetchVideos(params);

        // 检查API错误
        if (result.error) {
            throw new Error(result.error);
        }

        console.log('✅ Videos Catalogue - Videos received:', {
            count: result.list.length,
            totalSize: result.totalSize,
            totalPages: Math.ceil(result.totalSize / (params.limit || 20))
        });
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

// Videos目录配置
export const videosCatalogueConfig = {
    filterConfig: {
        filters: videoListConfigs
    },
    productConfig: {
        fetchProducts: fetchVideosAPI,
        pageSize: 12,
        cardActions: {
            show_title: true,
            show_eyebrow: true, // 显示 "Videos" mediaType
            show_download: true,
            show_cart: false,
            show_view: true,
            show_favorite: false
        }
    }
}; 