import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
// import fetchKendoAssets from './kendoAssetsApi';
import fetchKendoAssets from './kendoAssetsMetaDataApi';

/**
 * 从路径中提取语言信息
 * @param {string} fullpath - 完整路径
 * @returns {string} 语言代码
 */
const extractLanguageFromPath = (fullpath) => {
    if (!fullpath) return '';
    
    // 常见语言代码匹配
    const languageMatches = fullpath.match(/\/(en|de|fr|es|it|ja|zh|cn|us|gb|de-de|en-us|en-gb|fr-fr|es-es)\//i);
    if (languageMatches) {
        return languageMatches[1].toUpperCase();
    }
    
    return '';
};

/**
 * Call Brandbook Assets API (使用与 product assets 相同的接口)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Assets data
 */
export const fetchBrandbookAssets = async (params = {}) => {
    try {
        console.log(`🎨 Fetching brandbook assets for brand ${params.brand || 'kendo'}`);

        // const limitedParams = {
        //     ...params,
        //     offset: 0,
        //     //icons:ids: ['647', '88', '94', '102', '89', '93'],
        //     //logos: ['2091', '2093','2096','2095','2094','2092']
        //     //lifeStyles: ['129', '396', '980','981','982','1002']
        //     //catelogs: ids: ['128','127','1461','1055','1051','1056']
        //     //videos: ids: ['976','977','400', '978', '401','1053']
        //     //videos的type取Category Images
        //     // ids: ['647', '88', '94', '102', '89', '93','2091', '2093','2096','2095','2094','2092','976','977','400', '978', '401','1053','129', '396', '980','981','982','1002','128','127','1461','1055','1051','1056']
        //     'media-category': ['Icons', 'Logos'],
        //     'document-type': ['Catalog']

        // };

        // const graphqlResponse = await fetchKendoAssets(limitedParams);
        const graphqlResponse = await fetchKendoAssets({
            'media-category': ['Icons', 'Logos'],
            'document-type': ['Catalog'],
            'metadata-logic': 'OR'
        });


        console.log('graphqlResponse', graphqlResponse);

        // 检查API错误
        if (graphqlResponse.errors) {
            throw new Error(graphqlResponse.errors[0].message);
        }

        // 使用Adapter转换数据
        const result = adaptGraphQLAssetsResponse(graphqlResponse);

        console.log('result111', result);

        console.log(`Brandbook assets received:`, {
            count: result.list.length,
            totalSize: result.totalSize
        });

        // 添加 brandbook 特定字段
        const enhancedAssets = result.list.map(asset => ({
            ...asset,
            // Compatible with existing brandbook component fields
            identifier: asset.id,
            alt: asset.filename,
            img: asset.image,
            language: extractLanguageFromPath(asset.fullpath),
            createOn: asset.createdDate,
            _originalData: asset._graphqlData
        }));

        return {
            ...result,
            list: enhancedAssets
        };

    } catch (error) {
        console.error(`Error fetching brandbook assets:`, error);
        return {
            list: [],
            totalSize: 0,
            startIndex: 0,
            pageSize: 0,
            error: error.message
        };
    }
};

/**
 * Fetch all types of Brandbook assets (使用与 product assets 相同的接口)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} All assets data
 */
export const fetchAllBrandbookAssets = async (params = {}) => {
    try {
        console.log('Fetching all brandbook assets...');

        // 获取数据
        const allAssetsResult = await fetchBrandbookAssets(params);

        console.log('All brandbook assets fetched:', {
            totalAssets: allAssetsResult.list.length,
            totalSize: allAssetsResult.totalSize
        });

        const categorizedAssets = {
            logos: [],
            icons: [],
            videos: [],
            lifeStyles: [],
            catelogs: []
        };

        // 分类映射配置
        const categoryMapping = {
            'Icons': 'icons',
            'Logos': 'logos', 
            'Catalog': 'catelogs'
        };

        // 遍历 + metadata分类
        allAssetsResult.list.forEach(asset => {
            // 查找metadata，优先查找 Media Type，然后查找 Document Type
            const mediaTypeMetadata = asset._originalData?.metadata?.find(meta => 
                meta.name === 'Media Type'
            ) || asset._originalData?.metadata?.find(meta => 
                meta.name === 'Document Type'
            );

            if (mediaTypeMetadata) {
                const mediaType = mediaTypeMetadata.data;
                const targetCategory = categoryMapping[mediaType];
                
                if (targetCategory && categorizedAssets[targetCategory]) {
                    categorizedAssets[targetCategory].push(asset);
                } else {
                    console.log(`Unclassified asset: ID ${asset.id}, Type: ${mediaType}`);
                }
            } else {
                console.log(`No metadata found for asset: ID ${asset.id}`);
            }
        });

        const totalCounts = {
            logos: categorizedAssets.logos.length,
            icons: categorizedAssets.icons.length,
            catelogs: categorizedAssets.catelogs.length
        };

        console.log('Resource classification result:', {
            totalAssets: allAssetsResult.list.length,
            categorizedCounts: totalCounts,
            uncategorized: allAssetsResult.list.length - Object.values(totalCounts).reduce((sum, count) => sum + count, 0)
        });

        return {
            ...categorizedAssets,
            totalCounts
        };

    } catch (error) {
        console.error('Error fetching all brandbook assets:', error);
        return {
            logos: [],
            icons: [],
            catelogs: [],
            totalCounts: {
                logos: 0,
                icons: 0,
                catelogs: 0
            },
            error: error.message
        };
    }
};

export default fetchBrandbookAssets;
