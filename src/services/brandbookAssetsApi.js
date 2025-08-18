import { adaptGraphQLAssetsResponse } from '../adapters/kendoAssetsAdapter';
import fetchKendoAssets from './kendoAssetsApi';

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

        // 限制只取6个资产
        const limitedParams = {
            ...params,
            limit: 6,
            offset: 0
        };

        // 直接使用 kendoAssetsApi 获取数据，不进行类型过滤
        const graphqlResponse = await fetchKendoAssets(limitedParams);

        // 检查API错误
        if (graphqlResponse.errors) {
            throw new Error(graphqlResponse.errors[0].message);
        }

        // 使用Adapter转换数据
        const result = adaptGraphQLAssetsResponse(graphqlResponse);

        console.log(`✅ Brandbook assets received:`, {
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
        console.error(`❌ Error fetching brandbook assets:`, error);
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
        console.log('🎨 Fetching all brandbook assets...');

        // 直接调用一次 API，获取所有资产数据
        const allAssetsResult = await fetchBrandbookAssets(params);

        console.log('✅ All brandbook assets fetched:', {
            totalAssets: allAssetsResult.list.length,
            totalSize: allAssetsResult.totalSize
        });

        // 返回所有资产数据，不进行分类过滤
        return {
            logos: allAssetsResult.list || [],
            icons: allAssetsResult.list || [],
            videos: allAssetsResult.list || [],
            lifeStyles: allAssetsResult.list || [],
            catelogs: allAssetsResult.list || [],
            totalCounts: {
                logos: allAssetsResult.totalSize || 0,
                icons: allAssetsResult.totalSize || 0,
                videos: allAssetsResult.totalSize || 0,
                lifeStyles: allAssetsResult.totalSize || 0,
                catelogs: allAssetsResult.totalSize || 0
            }
        };

    } catch (error) {
        console.error('❌ Error fetching all brandbook assets:', error);
        return {
            logos: [],
            icons: [],
            videos: [],
            lifeStyles: [],
            catelogs: [],
            totalCounts: {
                logos: 0,
                icons: 0,
                videos: 0,
                lifeStyles: 0,
                catelogs: 0
            },
            error: error.message
        };
    }
};

export default fetchBrandbookAssets;
