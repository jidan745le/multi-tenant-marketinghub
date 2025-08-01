/**
 * KENDO Assets Adapter
 * 将GraphQL Assets API响应转换为应用内部统一的资产数据格式
 */

// KENDO PIM 基础URL
const KENDO_BASE_URL = 'https://pim-test.kendo.com';

/**
 * 构建完整的资产URL
 * @param {string} assetPath - 资产路径
 * @returns {string} 完整的资产URL
 */
const buildAssetUrl = (assetPath) => {
    if (!assetPath) return null;

    // 如果已经是完整URL，直接返回
    if (assetPath.startsWith('http')) {
        return assetPath;
    }

    // 添加域名前缀
    return `${KENDO_BASE_URL}${assetPath}`;
};

/**
 * 获取资产类型（基于mimetype）
 * @param {string} mimetype - MIME类型
 * @returns {string} 资产类型（Images, Videos, Documents, Unknown）
 */
const getAssetType = (mimetype) => {
    if (!mimetype) return 'Unknown';

    if (mimetype.startsWith('image/')) return 'Images';
    if (mimetype.startsWith('video/')) return 'Videos';
    if (mimetype.startsWith('application/')) return 'Documents';
    if (mimetype.startsWith('audio/')) return 'Audio';
    if (mimetype.startsWith('text/')) return 'Documents';

    return 'Unknown';
};

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化的文件大小
 */
const formatFileSize = (bytes) => {
    if (bytes === null || bytes === undefined) return 'Unknown';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * 从路径中提取资产所属的产品ID/型号（如果可用）
 * @param {string} fullpath - 资产路径
 * @returns {string|null} 产品ID/型号
 */
const extractProductIdFromPath = (fullpath) => {
    if (!fullpath) return null;

    // 尝试从路径中匹配常见产品ID格式
    // 例如: /KENDO/PRODUCT ASSETS/01 - Clamping Tools/01 - Hand Tools/01 - Piler/10111/...
    const matches = fullpath.match(/\/(\d{5,6})\/|\/([A-Z]\d{8})\/|\/([A-Z]\d{7})\/|\/(\d{8})\/|\/(\d{7})\/|\/([A-Z]\d{6,})\/|\/([A-Z]\d{5,})\/|\/(A\d{8})\//);

    if (matches) {
        // 返回找到的第一个非空匹配组
        for (let i = 1; i < matches.length; i++) {
            if (matches[i]) return matches[i];
        }
    }

    return null;
};

/**
 * 从路径中提取文件夹结构，获取媒体类别
 * @param {string} fullpath - 资产路径
 * @returns {string} 媒体类别
 */
const extractMediaCategory = (fullpath) => {
    if (!fullpath) return 'Unknown';

    // 检查常见类别关键词
    const path = fullpath.toLowerCase();

    if (path.includes('main')) return 'Main';
    if (path.includes('on white') || path.includes('onwhite')) return 'On White';
    if (path.includes('lifestyle')) return 'Lifestyle';
    if (path.includes('action')) return 'Action';
    if (path.includes('in scene') || path.includes('inscene')) return 'In Scene';

    return 'Other';
};

/**
 * 将单个GraphQL资产节点转换为应用内部格式
 * @param {Object} assetNode - GraphQL资产节点
 * @returns {Object} 转换后的资产对象
 */
export const adaptGraphQLAssetNode = (assetNode) => {
    // 获取资产类型、媒体类别和产品ID
    const assetType = getAssetType(assetNode.mimetype);
    const mediaCategory = extractMediaCategory(assetNode.fullpath); // 媒体类别（Main, On White等）
    const mediaType = assetType; // 媒体类型（Images, Videos, Documents）
    const modelNumber = extractProductIdFromPath(assetNode.fullpath);

    // 获取最佳图像URL
    // 如果assetThumb是默认的不支持文件类型图标，则使用原始文件路径
    let imageUrl;
    if (assetNode.assetThumb && !assetNode.assetThumb.includes('filetype-not-supported')) {
        imageUrl = buildAssetUrl(assetNode.assetThumb);
    } else {
        imageUrl = buildAssetUrl(assetNode.fullpath);
    }
    const downloadUrl = buildAssetUrl(assetNode.fullpath);

    // 从资产路径中提取标签
    const pathSegments = assetNode.fullpath.split('/').filter(Boolean);
    const tags = pathSegments.slice(Math.max(0, pathSegments.length - 4)).join(', ');

    // 调试信息（仅对视频类型显示）
    if (assetNode.mimetype && assetNode.mimetype.startsWith('video/')) {
        console.log('🎥 Video asset adaptation:', {
            id: assetNode.id,
            filename: assetNode.filename,
            mediaType: mediaType,
            originalAssetThumb: assetNode.assetThumb,
            finalImageUrl: imageUrl,
            mimetype: assetNode.mimetype,
            type: assetNode.type
        });
    }

    return {
        // 基本标识字段
        id: assetNode.id,
        identifier: assetNode.id,

        // 资产基本信息
        filename: assetNode.filename,
        mediaType: mediaType, // 文件类型分类（Images, Videos, Documents）
        mediaCategory: mediaCategory, // 媒体类别（Main, On White, Lifestyle）
        modelNumber: modelNumber || 'Unknown',
        tags: tags,
        region: 'Global',
        brand: 'KENDO',
        fileSize: formatFileSize(assetNode.filesize),
        createdDate: assetNode.creationDate ? assetNode.creationDate.split('T')[0] : new Date().toISOString().split('T')[0], // 使用API提供的创建日期

        // URL相关
        fullpath: assetNode.fullpath,
        downloadUrl: downloadUrl,

        // 类型信息
        type: assetNode.type || assetType,
        mimetype: assetNode.mimetype,

        // 适配现有UI组件的标准化字段
        __title: mediaType, // 使用文件类型作为标题（Images, Videos, Documents）
        __subtitle: assetNode.filename,
        name: assetNode.filename,
        image: imageUrl,

        // 原始GraphQL数据
        _graphqlData: assetNode,
        _dataSource: 'graphql'
    };
};

/**
 * 将GraphQL资产响应转换为应用统一的资产列表格式
 * @param {Object} graphqlResponse - GraphQL API完整响应
 * @returns {Object} 转换后的资产列表数据
 */
export const adaptGraphQLAssetsResponse = (graphqlResponse) => {
    // 验证响应结构
    if (!graphqlResponse?.data?.getAssetListing?.edges) {
        return {
            list: [],
            totalSize: 0,
            startIndex: 0,
            pageSize: 0,
            error: 'Invalid GraphQL response structure'
        };
    }

    const edges = graphqlResponse.data.getAssetListing.edges;
    const totalCount = graphqlResponse.data.getAssetListing.totalCount || 0;

    // 转换每个资产节点
    const assets = edges
        .map(edge => edge.node)
        .filter(node => node) // 过滤空节点
        .map(adaptGraphQLAssetNode);

    return {
        list: assets,
        totalSize: totalCount,
        startIndex: 0,
        pageSize: assets.length,
        _metadata: {
            source: 'graphql',
            originalEdgeCount: edges.length,
            totalCount: totalCount,
            transformedAt: new Date().toISOString()
        }
    };
};

export default {
    adaptGraphQLAssetNode,
    adaptGraphQLAssetsResponse,
    buildAssetUrl
}; 