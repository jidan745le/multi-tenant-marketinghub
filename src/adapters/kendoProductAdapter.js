/**
 * KENDO Product Adapter
 * 将GraphQL API响应转换为应用内部统一的产品数据格式
 */

// KENDO PIM 基础URL
const KENDO_BASE_URL = 'https://pim-test.kendo.com';

/**
 * 构建完整的图像URL
 * @param {string} imagePath - 图像路径
 * @returns {string} 完整的图像URL
 */
const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // 添加域名前缀
    return `${KENDO_BASE_URL}${imagePath}`;
};

/**
 * 获取产品主图像URL
 * @param {Object} graphqlNode - GraphQL节点数据
 * @returns {string|null} 图像URL
 */
const getMainImageUrl = (graphqlNode) => {
    // 优先级：Main.assetThumb -> Main.fullpath -> OnWhite第一张 -> Lifestyles第一张
    if (graphqlNode.Main?.assetThumb) {
        return buildImageUrl(graphqlNode.Main.assetThumb);
    }

    // if (graphqlNode.Main?.fullpath) {
    //     return buildImageUrl(graphqlNode.Main.fullpath);
    // }

    // if (graphqlNode.OnWhite && graphqlNode.OnWhite.length > 0 && graphqlNode.OnWhite[0].image?.fullpath) {
    //     return graphqlNode.OnWhite[0].image.fullpath;
    // }

    // if (graphqlNode.Lifestyles && graphqlNode.Lifestyles.length > 0 && graphqlNode.Lifestyles[0].image?.fullpath) {
    //     return graphqlNode.Lifestyles[0].image.fullpath;
    // }

    return null;
};

/**
 * 获取产品所有图像数据
 * @param {Object} graphqlNode - GraphQL节点数据
 * @returns {Array} 图像数组
 */
const getAllImages = (graphqlNode) => {
    const images = [];

    // 添加主图像
    if (graphqlNode.Main?.fullpath) {
        images.push({
            type: 'main',
            url: buildImageUrl(graphqlNode.Main.fullpath),
            assetThumb: buildImageUrl(graphqlNode.Main.assetThumb),
            assetThumb2: buildImageUrl(graphqlNode.Main.assetThumb2),
            filename: graphqlNode.Main.filename,
            id: graphqlNode.Main.id,
            resolutions: graphqlNode.Main.resolutions
        });
    }

    // 添加OnWhite图像
    if (graphqlNode.OnWhite && Array.isArray(graphqlNode.OnWhite)) {
        graphqlNode.OnWhite.forEach(item => {
            if (item.image?.fullpath) {
                images.push({
                    type: 'onwhite',
                    url: buildImageUrl(item.image.fullpath),
                    filename: item.image.filename,
                    id: item.image.id,
                    filesize: item.image.filesize
                });
            }
        });
    }

    // 添加Lifestyles图像
    if (graphqlNode.Lifestyles && Array.isArray(graphqlNode.Lifestyles)) {
        graphqlNode.Lifestyles.forEach(item => {
            if (item.image?.fullpath) {
                images.push({
                    type: 'lifestyle',
                    url: buildImageUrl(item.image.fullpath),
                    filename: item.image.filename
                });
            }
        });
    }

    // 添加Icons图像
    if (graphqlNode.Icons && Array.isArray(graphqlNode.Icons)) {
        graphqlNode.Icons.forEach(item => {
            if (item.image?.fullpath) {
                images.push({
                    type: 'icon',
                    url: buildImageUrl(item.image.fullpath),
                    filename: item.image.filename,
                    filesize: item.image.filesize,
                    duration: item.image.duration
                });
            }
        });
    }

    return images;
};

/**
 * 获取产品分类（基于产品类型和路径推断）
 * @param {Object} graphqlNode - GraphQL节点数据
 * @returns {string} 产品分类
 */
const getProductCategory = (graphqlNode) => {
    const productType = graphqlNode.ProductType || '';
    const mainImagePath = graphqlNode.Main?.fullpath || '';

    // 基于图像路径推断分类
    if (mainImagePath.includes('Clamping Tools') || mainImagePath.includes('Piler')) {
        return 'Clamping Tools';
    }

    if (mainImagePath.includes('Hand Tools')) {
        return 'Hand Tools';
    }

    // 基于产品类型推断
    if (productType.includes('Individual')) {
        return 'Hand Tools';
    }

    return 'Tools'; // 默认分类
};

/**
 * 将单个GraphQL产品节点转换为应用内部格式
 * @param {Object} graphqlNode - GraphQL产品节点
 * @returns {Object} 转换后的产品对象
 */
export const adaptGraphQLProductNode = (graphqlNode) => {
    const mainImageUrl = getMainImageUrl(graphqlNode);
    const allImages = getAllImages(graphqlNode);
    const category = getProductCategory(graphqlNode);

    // 获取产品名称（优先英文，其次德文）
    const productName = graphqlNode.ProductName_en || 'Unnamed Product';

    // 获取产品描述
    const shortDescription = graphqlNode.ShortDescription_en || graphqlNode.ShortDescription_de || '';
    const longDescription = graphqlNode.LongDescription_en || graphqlNode.LongDescription_de || '';

    return {
        // 基础标识字段
        id: graphqlNode.id,

        // 产品基本信息 - 兼容现有组件字段
        name: productName,
        modelName: productName,
        modelNumber: graphqlNode.VirtualProductID || 'N/A',
        customerFasicModelNumber: graphqlNode.VirtualProductID || 'N/A',
        ean: graphqlNode.ERPMaterialCode || 'N/A',
        brand: graphqlNode.Brand || 'KENDO',
        productType: graphqlNode.ProductType || 'Unknown',
        objectType: graphqlNode.objectType || 'unknown',
        category: category,

        // 图像相关字段
        image: mainImageUrl,
        thumbnail: mainImageUrl,
        images: allImages,

        // 描述信息
        shortDescription: shortDescription,
        longDescription: longDescription,

        // 状态和兼容性字段
        sellable: "true",
        region: "Global",
        creationDate: "",
        onlineDate: graphqlNode.OnlineDate || '',
        enrichmentStatus: {
            id: "active",
            label: "Active",
            entityId: parseInt(graphqlNode.id)
        },

        // 保留原始GraphQL数据用于调试和扩展
        _graphqlData: graphqlNode,
        _dataSource: 'graphql'
    };
};

/**
 * 将GraphQL响应转换为应用统一的产品列表格式
 * @param {Object} graphqlResponse - GraphQL API完整响应
 * @returns {Object} 转换后的产品列表数据
 */
export const adaptGraphQLProductResponse = (graphqlResponse) => {
    // 验证响应结构
    if (!graphqlResponse?.data?.getProductListing?.edges) {
        return {
            list: [],
            totalSize: 0,
            startIndex: 0,
            pageSize: 0,
            error: 'Invalid GraphQL response structure'
        };
    }

    const edges = graphqlResponse.data.getProductListing.edges;
    const totalCount = graphqlResponse.data.getProductListing.totalCount || 0;

    // 转换每个产品节点
    const products = edges.map(edge => adaptGraphQLProductNode(edge.node));

    return {
        list: products,
        totalSize: totalCount, // 使用GraphQL返回的准确总数
        startIndex: 0,
        pageSize: products.length,
        _metadata: {
            source: 'graphql',
            originalEdgeCount: edges.length,
            totalCount: totalCount,
            transformedAt: new Date().toISOString()
        }
    };
};

/**
 * 适配器工厂函数 - 用于创建特定配置的适配器
 * @param {Object} options - 适配器选项
 * @returns {Function} 配置好的适配器函数
 */
export const createKendoProductAdapter = (options = {}) => {
    const {
        includeMeta = true,
        imageUrlTransform = null
    } = options;

    return (graphqlResponse) => {
        const adapted = adaptGraphQLProductResponse(graphqlResponse);

        // 应用自定义图像URL转换
        if (imageUrlTransform && typeof imageUrlTransform === 'function') {
            adapted.list = adapted.list.map(product => ({
                ...product,
                image: imageUrlTransform(product.image),
                thumbnail: imageUrlTransform(product.thumbnail),
                images: product.images.map(img => ({
                    ...img,
                    url: imageUrlTransform(img.url)
                }))
            }));
        }

        // 是否包含元数据
        if (!includeMeta) {
            delete adapted._metadata;
            adapted.list.forEach(product => {
                delete product._graphqlData;
                delete product._dataSource;
            });
        }

        return adapted;
    };
};

export default {
    adaptGraphQLProductNode,
    adaptGraphQLProductResponse,
    createKendoProductAdapter
}; 