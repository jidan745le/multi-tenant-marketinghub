import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
import fetchKendoAssets from '../services/kendoAssetsMetaDataApi';

// 媒体类型选项
export const mediaTypeOptions = [
    { value: 'Images', label: 'Images' },
    { value: 'Videos', label: 'Videos' },
    { value: 'Documents', label: 'Documents' },
    // { value: 'Audio', label: 'Audio' }
];

// 媒体分类选项 - 用于图片类型
export const imageCategoryOptions = [
    { value: 'Main', label: 'Main' },
    { value: 'OnWhite', label: 'On White' },
    { value: 'Packaging Picture', label: 'Packaging Picture' },
    { value: 'InScene', label: 'In Scene' },
    { value: 'Lifestyle', label: 'Life Style' },
    { value: 'Feature Highlights', label: 'Feature Highlights' },
    { value: 'Icons', label: 'Icons' },
    { value: 'Layover', label: 'Layover' },
    { value: 'Awards', label: 'Awards' },
    { value: 'Warranty', label: 'Warranty' },
    { value: 'Logos', label: 'Logos' },
    { value: 'Category Images', label: 'Category Images' }
];

// 媒体分类选项 - 用于视频类型
export const videoCategoryOptions = [
    { value: 'Marketing Videos', label: 'Marketing Videos' },
    { value: 'Category Videos', label: 'Category Videos' }
];

// 文档类型选项 - After Sales Service
export const afterSalesDocumentOptions = [
    { value: 'Repair Guide / Spare Parts List', label: 'Repair Guide / Spare Parts List' },
    { value: 'Product Manual', label: 'Product Manual' }
];

// 文档类型选项 - Internal Documents
export const internalDocumentOptions = [
    { value: 'Sales Packaging Artwork', label: 'Sales Packaging Artwork' },
    { value: 'Product Line Drawing', label: 'Product Line Drawing' },
    { value: 'Product Certificate', label: 'Product Certificate' },
    { value: 'Inner Carton Artwork', label: 'Inner Carton Artwork' },
    { value: 'Master Carton Artwork', label: 'Master Carton Artwork' },
    { value: 'Mold Drawing', label: 'Mold Drawing' },
    { value: 'Packing Guideline(File or video)', label: 'Packing Guideline(File or video)' },
    { value: 'Product Drawing', label: 'Product Drawing' },
    { value: 'Product Patent', label: 'Product Patent' },
    { value: 'Product Printing', label: 'Product Printing' },
    { value: 'Artwork', label: 'Artwork' },
    { value: 'Product Specification Manual', label: 'Product Specification Manual' }
];

// 文档类型选项 - Certifications & Compliance
export const certificationsDocumentOptions = [
    { value: 'Declarations of Conformity CE', label: 'Declarations of Conformity CE' },
    { value: 'GPSR Risk Analysis', label: 'GPSR Risk Analysis' },
    { value: 'GS Certificate (Saame only)', label: 'GS Certificate (Saame only)' },
    { value: 'FSC Certificate for wood', label: 'FSC Certificate for wood' }
];

// 创建日期选项
export const creationDateOptions = [
    { value: 'all', label: 'All' },
    { value: 'last_2_weeks', label: 'Last 2 weeks' },
    { value: 'last_1_month', label: 'Last 1 month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_1_year', label: 'Last 1 year' },
];

/**
 * 根据选择的媒体类型动态获取 Media Category 选项
 * @param {Array<string>} selectedMediaTypes - 选中的媒体类型数组 ['Images', 'Videos', etc.]
 * @returns {Array} Category 选项数组
 */
export const getMediaCategoryOptionsByType = (selectedMediaTypes = []) => {
    if (!selectedMediaTypes || selectedMediaTypes.length === 0) {
        // 默认返回图片类型的选项
        return imageCategoryOptions;
    }

    // 如果只选择了视频
    if (selectedMediaTypes.length === 1 && selectedMediaTypes.includes('Videos')) {
        return videoCategoryOptions;
    }

    // 如果只选择了图片
    if (selectedMediaTypes.length === 1 && selectedMediaTypes.includes('Images')) {
        return imageCategoryOptions;
    }

    // 如果同时选择了多种类型，合并所有选项
    const allOptions = [...imageCategoryOptions];
    if (selectedMediaTypes.includes('Videos')) {
        allOptions.push(...videoCategoryOptions);
    }

    // 去重（如果有重复的选项）
    const uniqueOptions = allOptions.filter((option, index, self) =>
        index === self.findIndex((t) => t.value === option.value)
    );

    return uniqueOptions;
};

/**
 * 创建媒体筛选器配置
 * @param {Array<string>} selectedMediaTypes - 当前选中的媒体类型（可选）
 * @returns {Array} 筛选器配置数组
 */
export const createMediaFilterConfigs = (selectedMediaTypes = []) => {
    const categoryOptions = getMediaCategoryOptionsByType(selectedMediaTypes);

    return [
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
            placeholder: 'Search for model number',
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
            label: 'Media Type',
            component: 'checkbox',
            key: 'media-category',
            type: 'array',
            defaultValue: [], // UI默认不勾选
            enum: categoryOptions,
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
};

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
export const createMediaCatalogueConfig = (brand = 'kendo', selectedMediaTypes = []) => {
    const brandName = brand.toUpperCase();
    // 默认全选所有 Image Media Types
    const defaultMediaCategories = imageCategoryOptions.map(opt => opt.value);

    return {
        // 筛选器配置
        filterConfig: {
            filters: createMediaFilterConfigs(selectedMediaTypes)
        },
        // 媒体网格配置
        productConfig: {
            // 获取媒体数据的Promise函数（绑定品牌参数）
            fetchProducts: Object.assign(
                (params) => {
                    // 如果用户没有指定 media-category，使用默认值（全选所有图片类型）
                    const mediaCategory = params['media-category'] && params['media-category'].length > 0
                        ? params['media-category']
                        : defaultMediaCategories;

                    return fetchKendoMediaAPI({
                        ...params,
                        'media-category': mediaCategory
                    }, brand);
                },
                { brand: brand }
            ),
            // 页面大小
            pageSize: 20,
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

/**
 * USAGE EXAMPLES
 * 
 * 1. 使用 Tags 搜索功能:
 * 
 *    fetchKendoMediaAPI({ tags: 'Plier, Special' })
 *    // 搜索包含 "Plier" 或 "Special" 标签的资产
 * 
 *    fetchKendoMediaAPI({ tags: 'Hand Tools; Power Tools' })
 *    // 支持分号或逗号分隔
 * 
 * 2. 根据媒体类型动态选择 Media Category:
 * 
 *    // 对于图片库
 *    const imageCategories = getMediaCategoryOptionsByType(['Images']);
 *    // 返回: [Main, OnWhite, Packaging Picture, InScene, Lifestyle, etc.]
 * 
 *    // 对于视频库
 *    const videoCategories = getMediaCategoryOptionsByType(['Videos']);
 *    // 返回: [Marketing Videos, Category Videos]
 * 
 * 3. 创建筛选器配置:
 * 
 *    // 在组件中根据用户选择的媒体类型动态生成筛选器
 *    const [selectedMediaTypes, setSelectedMediaTypes] = useState(['Images']);
 *    const filterConfigs = createMediaFilterConfigs(selectedMediaTypes);
 * 
 * 4. 完整的筛选示例:
 * 
 *    fetchKendoMediaAPI({
 *      'media-type': ['Images'],        // 只搜索图片
 *      'media-category': ['Main', 'Icons'],  // 只要 Main 或 Icons 类型
 *      'tags': 'Plier',                 // 包含 Plier 标签
 *      'model-number': 'A09050101',     // 特定型号
 *      'creation-date': 'last_1_month'  // 最近一个月
 *    })
 * 
 * 5. Video Library 筛选示例:
 * 
 *    fetchKendoMediaAPI({
 *      'media-type': ['Videos'],              // 只搜索视频
 *      'media-category': ['Marketing Videos'], // Marketing Videos 类型
 *      'tags': 'Product Demo',                // 包含 Product Demo 标签
 *    })
 */

// ====== 文档库专用配置函数 ======

/**
 * 创建文档筛选器配置
 * @param {Array} documentTypeOptions - 文档类型选项
 * @returns {Array} 筛选器配置数组
 */
const createDocumentFilterConfigs = (documentTypeOptions) => {
    return [
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
            label: 'Document Type',
            component: 'checkbox',
            key: 'document-type',
            type: 'array',
            defaultValue: [], // UI默认不勾选
            enum: documentTypeOptions,
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
};

/**
 * 创建 After Sales Service 文档库配置
 * @param {string} brand - 品牌代码
 * @returns {Object} 配置对象
 */
export const createAfterSalesConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();
    // 默认筛选所有 After Sales 文档类型
    const defaultDocumentTypes = afterSalesDocumentOptions.map(opt => opt.value);

    return {
        filterConfig: {
            filters: createDocumentFilterConfigs(afterSalesDocumentOptions)
        },
        productConfig: {
            fetchProducts: Object.assign(
                (params) => {
                    // 如果用户没有指定 document-type，使用默认值
                    const documentType = params['document-type'] && params['document-type'].length > 0
                        ? params['document-type']
                        : defaultDocumentTypes;

                    return fetchKendoMediaAPI({
                        ...params,
                        'media-type': ['Documents'],
                        'document-type': documentType
                    }, brand);
                },
                { brand: brand }
            ),
            pageSize: 20,
            cardActions: {
                show_file_type: true,
                show_eyebrow: true,
                show_open_pdf: true,
                show_open_product_page: false,
                show_preview_media: true,
                show_download: true,
            },
            title: `${brandName} After Sales Service Documents`
        }
    };
};

/**
 * 创建 Internal Documents 文档库配置
 * @param {string} brand - 品牌代码
 * @returns {Object} 配置对象
 */
export const createInternalDocumentsConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();
    // 默认筛选所有 Internal Documents 文档类型
    const defaultDocumentTypes = internalDocumentOptions.map(opt => opt.value);

    return {
        filterConfig: {
            filters: createDocumentFilterConfigs(internalDocumentOptions)
        },
        productConfig: {
            fetchProducts: Object.assign(
                (params) => {
                    // 如果用户没有指定 document-type，使用默认值
                    const documentType = params['document-type'] && params['document-type'].length > 0
                        ? params['document-type']
                        : defaultDocumentTypes;

                    return fetchKendoMediaAPI({
                        ...params,
                        'media-type': ['Documents'],
                        'document-type': documentType
                    }, brand);
                },
                { brand: brand }
            ),
            pageSize: 20,
            cardActions: {
                show_file_type: true,
                show_eyebrow: true,
                show_open_pdf: true,
                show_open_product_page: false,
                show_preview_media: true,
                show_download: true,
            },
            title: `${brandName} Internal Documents`
        }
    };
};

/**
 * 创建 Certifications & Compliance 文档库配置
 * @param {string} brand - 品牌代码
 * @returns {Object} 配置对象
 */
export const createCertificationsConfig = (brand = 'kendo') => {
    const brandName = brand.toUpperCase();
    // 默认筛选所有 Certifications & Compliance 文档类型
    const defaultDocumentTypes = certificationsDocumentOptions.map(opt => opt.value);

    return {
        filterConfig: {
            filters: createDocumentFilterConfigs(certificationsDocumentOptions)
        },
        productConfig: {
            fetchProducts: Object.assign(
                (params) => {
                    // 如果用户没有指定 document-type，使用默认值
                    const documentType = params['document-type'] && params['document-type'].length > 0
                        ? params['document-type']
                        : defaultDocumentTypes;

                    return fetchKendoMediaAPI({
                        ...params,
                        'media-type': ['Documents'],
                        'document-type': documentType
                    }, brand);
                },
                { brand: brand }
            ),
            pageSize: 20,
            cardActions: {
                show_file_type: true,
                show_eyebrow: true,
                show_open_pdf: true,
                show_open_product_page: false,
                show_preview_media: true,
                show_download: true,
            },
            title: `${brandName} Certifications & Compliance`
        }
    };
}; 