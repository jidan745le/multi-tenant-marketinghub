import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCatalogue from '../components/ProductCatalogue';
import { createProductCatalogueConfig } from '../config/kendoProductConfig';
import { useBrand } from '../hooks/useBrand';
import { useLayoutType } from '../hooks/useLayoutType';
import { fetchSKUProducts } from '../services/skuProductsApi';

function ProductCataloguePage() {
  // 获取当前品牌和路由参数
  const { currentBrandCode } = useBrand();
  // const navigate = useNavigate();
  const { lang, brand } = useParams();
  
  // 产品详情状态
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [productDetailError, setProductDetailError] = useState(null);
  
  // 监听品牌变化
  useEffect(() => {
    // Brand change monitoring
  }, [currentBrandCode]);
  
  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    const newConfig = createProductCatalogueConfig(currentBrandCode);
    return newConfig;
  }, [currentBrandCode]);

  const getLayoutType = useLayoutType(currentBrandCode);

  // 处理产品点击 - 特殊逻辑：查找SKU产品并导航到第一个SKU的详情页
  const handleProductClick = async (product) => {
    // 获取虚拟产品ID
    const virtualProductId = product.VirtualProductID || product.modelNumber;
    
    if (!virtualProductId) {
      setProductDetailError('VirtualProductID not available');
      return;
    }
    
    try {
      setLoadingProductDetail(true);
      setProductDetailError(null);
      
      // 查询与该虚拟产品ID相关的所有SKU产品
      const { skuProducts, error } = await fetchSKUProducts(virtualProductId);
      
      if (error) {
        throw new Error(error);
      }
      
      if (!skuProducts || skuProducts.length === 0) {
        setProductDetailError('No SKU products found for this product');
        return;
      }
      
      // 选择第一个SKU产品的ID
      const firstSku = skuProducts[0];
      const firstSkuId = firstSku.CustomerFacingProductCode;
      
      // 构建产品详情页面URL: /en_GB/kendo/product-detail/${id}
      const detailUrl = `/${lang || 'en_GB'}/${brand || currentBrandCode}/product-detail/${firstSkuId}?layout=${getLayoutType}`;
      
      window.open(detailUrl, '_blank');
      // 导航到产品详情页面
      // navigate(detailUrl);
      
    } catch (error) {
      setProductDetailError(error.message);
      
    } finally {
      setLoadingProductDetail(false);
    }
  };

  // 处理产品下载
  // eslint-disable-next-line no-unused-vars
  const handleProductDownload = (product) => {
    // 处理产品下载逻辑
  };

  // 处理批量搜索
  // eslint-disable-next-line no-unused-vars
  const handleMassSearch = (item, childItem, filterValues) => {
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