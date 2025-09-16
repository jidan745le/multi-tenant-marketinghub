import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCatalogue from '../components/ProductCatalogue';
import { createProductCatalogueConfig } from '../config/kendoProductConfig';
import { useBrand } from '../hooks/useBrand';
import { fetchSKUProducts } from '../services/skuProductsApi';

function ProductCataloguePage() {
  // 获取当前品牌和路由参数
  const { currentBrandCode } = useBrand();
  const navigate = useNavigate();
  const { lang, brand } = useParams();
  
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

  // 处理产品点击 - 特殊逻辑：查找SKU产品并导航到第一个SKU的详情页
  const handleProductClick = async (product) => {
    console.log(`Open ${currentBrandCode.toUpperCase()} product page for:`, product.name);
    
    // 获取虚拟产品ID
    const virtualProductId = product.VirtualProductID || product.modelNumber;
    
    if (!virtualProductId) {
      console.warn('VirtualProductID not found in product object:', product);
      setProductDetailError('VirtualProductID not available');
      return;
    }
    
    try {
      setLoadingProductDetail(true);
      setProductDetailError(null);
      
      console.log(`🔍 Searching for SKU products with VirtualProductID: ${virtualProductId}`);
      
      // 查询与该虚拟产品ID相关的所有SKU产品
      const { skuProducts, error } = await fetchSKUProducts(virtualProductId);
      
      if (error) {
        throw new Error(error);
      }
      
      if (!skuProducts || skuProducts.length === 0) {
        console.warn(`No SKU products found for VirtualProductID: ${virtualProductId}`);
        setProductDetailError('No SKU products found for this product');
        return;
      }
      
      console.log(`✅ Found ${skuProducts.length} SKU products:`, skuProducts);
      
      // 选择第一个SKU产品的ID
      const firstSku = skuProducts[0];
      const firstSkuId = firstSku.CustomerFacingProductCode;
      
      console.log(`🎯 Selecting first SKU with ID: ${firstSkuId}`, firstSku);
      
      // 构建产品详情页面URL: /en_GB/kendo/product-detail/${id}
      const detailUrl = `/${lang || 'en_GB'}/${brand || currentBrandCode}/product-detail/${firstSkuId}`;
      
      console.log(`🚀 Navigating to product detail page: ${detailUrl}`);
      window.open(detailUrl, '_blank');
      // 导航到产品详情页面
      // navigate(detailUrl);
      
    } catch (error) {
      console.error(`❌ Failed to fetch SKU products for VirtualProductID ${virtualProductId}:`, error);
      setProductDetailError(error.message);
      
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