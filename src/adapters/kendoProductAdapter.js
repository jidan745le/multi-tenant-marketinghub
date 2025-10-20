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
 * 获取SKU信息
 * @param {Object} graphqlNode - GraphQL节点数据
 * @returns {Object} SKU信息 {count, skus, showBadge}
 */
const getSkuInfo = (graphqlNode) => {
    const children = graphqlNode.children || [];
    const skuCount = children.length;

    return {
        count: skuCount,
        skus: children.map(child => ({
            id: child.id,
            productNumber: child.CustomerFacingProductCode || '',
            size: child.Size || '',
            mainMaterial: child.MainMaterial || '',
            surfaceFinish: child.SurfaceFinish || '',
            applicableStandard: child.ApplicableStandard || ''
        })),
        // 只有当SKU数量大于1时才显示徽章
        showBadge: skuCount > 1
    };
};

/**
 * 将单个GraphQL产品节点转换为应用内部格式
 * @param {Object} graphqlNode - GraphQL产品节点
 * @returns {Object} 转换后的产品对象
 */
export const adaptGraphQLProductNode = (graphqlNode) => {
    const mainImageUrl = getMainImageUrl(graphqlNode);
    const skuInfo = getSkuInfo(graphqlNode);

    // 获取产品名称
    const productName = graphqlNode.ProductName || 'Unnamed Product';

    // 获取产品描述
    const shortDescription = graphqlNode.ShortDescription || '';
    const longDescription = graphqlNode.LongDescription || '';

    return {
        // 基础标识
        id: graphqlNode.id,

        // 品牌和编码（驼峰命名）
        brand: graphqlNode.Brand || 'KENDO',
        erpMaterialCode: graphqlNode.ERPMaterialCode || '',
        customerFacingProductCode: graphqlNode.CustomerFacingProductCode || '',

        // 产品信息（驼峰命名）
        modelNumber: graphqlNode.VirtualProductID || '',
        modelName: productName,
        shortDescription: shortDescription,
        longDescription: longDescription,

        // 分类信息（驼峰命名）
        productType: graphqlNode.ProductType || '',
        categoryName: graphqlNode.CategoryName || '',
        categoryID: graphqlNode.CategoryID || '',
        application: graphqlNode.Application || '',

        // 状态信息（驼峰命名）
        onlineDate: graphqlNode.OnlineDate || '',
        enrichmentStatus: graphqlNode.EnrichmentStatus || '',
        lifecycleStatus: graphqlNode.LifecycleStatus || '',
        customerSpecificFlag: graphqlNode.CustomerSpecificFlag || false,

        // 对象类型（驼峰命名）
        objectType: graphqlNode.objectType || 'virtual-product',

        // 缩略图（驼峰命名）
        thumbnail: mainImageUrl || '',

        // SKU信息（驼峰命名数组）
        skus: skuInfo.skus.map(sku => ({
            id: sku.id,
            customerFacingProductCode: sku.productNumber,
            size: sku.size,
            mainMaterial: sku.mainMaterial,
            surfaceFinish: sku.surfaceFinish,
            applicableStandard: sku.applicableStandard
        })),

        // 兼容现有组件的字段
        name: productName,
        image: mainImageUrl,
        skuCount: skuInfo.count,
        showSkuBadge: skuInfo.showBadge
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
            pageIndex: 0,
            pageSize: 0,
            error: 'Invalid GraphQL response structure'
        };
    }

    const edges = graphqlResponse.data.getProductListing.edges;
    const totalCount = graphqlResponse.data.getProductListing.totalCount || 0;

    // 转换每个产品节点
    const products = edges.map(edge => adaptGraphQLProductNode(edge.node));

    return {
        pageIndex: 0,           // 页码索引（从0开始）
        totalSize: totalCount,  // 总记录数
        pageSize: products.length, // 当前页大小
        list: products          // 产品列表
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