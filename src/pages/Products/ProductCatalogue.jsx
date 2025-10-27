import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCatalogue from '../../components/ProductCatalogue';
import ProductMassDownloadDialog from '../../components/ProductMassDownloadDialog';
import { createProductCatalogueConfig } from '../../config/kendoProductConfig';
import { SelectedAssetsProvider } from '../../context/SelectedAssetsContext';
import { useBrand } from '../../hooks/useBrand';
import { fetchSKUProducts } from '../../services/skuProductsApi';

function ProductCataloguePage() {
  // 获取当前品牌和路由参数
  const { currentBrandCode } = useBrand();
  const navigate = useNavigate();
  const { lang, brand } = useParams();
  
  // 产品详情状态
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [productDetailError, setProductDetailError] = useState(null);

  // 批量下载对话框状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedProductIdsForDownload, setSelectedProductIdsForDownload] = useState([]);
  
  // 监听品牌变化
  useEffect(() => {
    // Brand changed
  }, [currentBrandCode]);
  
  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    const newConfig = createProductCatalogueConfig(currentBrandCode);
    return newConfig;
  }, [currentBrandCode]);

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
      const detailUrl = `/${lang || 'en_GB'}/${brand || currentBrandCode}/product-detail/${firstSkuId}?layout=internalPDPBasic`;
      
      window.open(detailUrl, '_blank');
      // 导航到产品详情页面
      // navigate(detailUrl);
      
    } catch (error) {
      setProductDetailError(error.message);
      
    } finally {
      setLoadingProductDetail(false);
    }
  };

  // 处理单个产品下载
  const handleProductDownload = useCallback((product) => {
    const productId = product.VirtualProductID || product.modelNumber || product.id;
    if (productId) {
      setSelectedProductIdsForDownload([productId]);
      setDownloadDialogOpen(true);
    }
  }, []);

  // 处理批量下载选择 (来自ActionBar)
  const handleDownloadSelection = useCallback((selectedAssets) => {
    const productIds = selectedAssets
      .map(asset => asset.VirtualProductID || asset.modelNumber || asset.id)
      .filter(Boolean);
    setSelectedProductIdsForDownload(productIds);
    setDownloadDialogOpen(true);
  }, []);

  // 处理下载对话框关闭
  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedProductIdsForDownload([]);
  }, []);

  // 处理下载执行
  const handleDownloadExecute = useCallback(async (downloadData) => {
    // TODO: Implement actual download logic
    // This should call your backend API to generate and download the files
    alert(`Download initiated for ${downloadData.products.length} product(s)`);
  }, []);

  // 处理批量搜索
  const handleMassSearch = (item, childItem, filterValues) => {
    // 处理批量搜索逻辑
  };

  return (
    <SelectedAssetsProvider>
      <ProductCatalogue
        key={currentBrandCode} // 确保品牌切换时组件重新渲染
        config={config}
        onProductClick={handleProductClick}
        onProductDownload={handleProductDownload}
        onDownloadSelection={handleDownloadSelection}
        onMassSearch={handleMassSearch}
      />
      
      {/* 产品批量下载对话框 */}
      <ProductMassDownloadDialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        selectedProductIds={selectedProductIdsForDownload}
        onDownload={handleDownloadExecute}
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
    </SelectedAssetsProvider>
  );
}

export default ProductCataloguePage; 