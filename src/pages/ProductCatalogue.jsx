import React, { useEffect, useMemo, useState } from 'react';
import ProductCatalogue from '../components/ProductCatalogue';
import { createProductCatalogueConfig } from '../config/kendoProductConfig';
import { useBrand } from '../hooks/useBrand';
import ProductDetailApiService from '../services/productDetailApi';

function ProductCataloguePage() {
  // 获取当前品牌
  const { currentBrandCode } = useBrand();
  
  // 产品详情状态
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [productDetailError, setProductDetailError] = useState(null);
  
  // 监听品牌变化
  useEffect(() => {
    console.log(`🔄 ProductCataloguePage: Brand changed to ${currentBrandCode}`);
  }, [currentBrandCode]);
  
  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    console.log(`🏭 Creating product catalogue config for brand: ${currentBrandCode}`);
    const newConfig = createProductCatalogueConfig(currentBrandCode);
    console.log(`🔧 Config created with fetchProducts.brand:`, newConfig.productConfig.fetchProducts.brand);
    return newConfig;
  }, [currentBrandCode]);

  // 处理产品点击
  const handleProductClick = async (product) => {
    console.log(`Open ${currentBrandCode.toUpperCase()} product page for:`, product.name);
    
    // 获取产品ID - 尝试从不同的字段中获取
    const productId = product.id || product.productId || product.VirtualProductID;
    
    if (!productId) {
      console.warn('Product ID not found in product object:', product);
      setProductDetailError('Product ID not available');
      return;
    }
    
    try {
      setLoadingProductDetail(true);
      setProductDetailError(null);
      
      console.log(`🔍 Fetching product detail for ID: ${productId}`);
      
      // 调用产品详情API
      const productDetail = await ProductDetailApiService.getProductDetail(productId);
      
      console.log(`✅ Product detail fetched successfully:`, productDetail);
      
      // 打印关键信息
      console.log(`📦 Product Name: ${productDetail.productCardInfo.productName}`);
      console.log(`🏷️ Brand: ${productDetail.basicData.brand}`);
      console.log(`📊 Product Type: ${productDetail.basicData.productType}`);
      console.log(`📝 Short Description: ${productDetail.marketingData.popShortDescription}`);
      
      // TODO: 在这里可以打开产品详情弹窗、导航到详情页或者更新UI状态
      // 例如：
      // - 打开产品详情模态框
      // - 导航到产品详情页面
      // - 更新Redux状态存储产品详情
      
    } catch (error) {
      console.error(`❌ Failed to fetch product detail for ID ${productId}:`, error);
      setProductDetailError(error.message);
      
      // 仍然可以继续原有的处理逻辑
      console.log(`Continuing with fallback product page navigation...`);
      
    } finally {
      setLoadingProductDetail(false);
    }
  };

  // 处理产品下载
  const handleProductDownload = (product) => {
    console.log(`Download ${currentBrandCode.toUpperCase()} product:`, product.name);
    // 处理产品下载逻辑
  };

  // 处理批量搜索
  const handleMassSearch = (item, childItem, filterValues) => {
    console.log(`${currentBrandCode.toUpperCase()} Mass search:`, { item, childItem, filterValues });
    // 处理批量搜索逻辑
  };

  return (
    <>
      <ProductCatalogue
        key={currentBrandCode} // 确保品牌切换时组件重新渲染
        config={config}
        onProductClick={handleProductClick}
        onProductDownload={handleProductDownload}
        onMassSearch={handleMassSearch}
      />
      
      {/* 产品详情加载状态提示 */}
      {loadingProductDetail && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2196F3',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          🔍 Loading product details...
        </div>
      )}
      
      {/* 产品详情错误提示 */}
      {productDetailError && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#f44336',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => setProductDetailError(null)}
        >
          ❌ {productDetailError} (Click to dismiss)
        </div>
      )}
    </>
  );
}

export default ProductCataloguePage; 