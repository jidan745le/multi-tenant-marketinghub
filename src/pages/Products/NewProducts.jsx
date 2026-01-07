import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCatalogue from '../../components/ProductCatalogue';
import ProductMassDownloadDialog from '../../components/ProductMassDownloadDialog';
import { newProductCatalogueConfig } from '../../config/newProductsConfig';
import { SelectedAssetsProvider } from '../../context/SelectedAssetsContext';
import { useBrand } from '../../hooks/useBrand';
import { useLayoutType } from '../../hooks/useLayoutType';
import { fetchSKUProducts } from '../../services/skuProductsApi';

function NewProductsPage() {
  // 获取当前品牌和路由参数
  const { currentBrandCode } = useBrand();
  const { lang, brand } = useParams();
  const getLayoutType = useLayoutType(currentBrandCode);
  
  // 产品详情状态
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [productDetailError, setProductDetailError] = useState(null);
  
  // 批量下载对话框状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedProductIdsForDownload, setSelectedProductIdsForDownload] = useState([]);

  const handleProductClick = async (product) => {
    const virtualProductId = product.VirtualProductID || product.modelNumber;
    
    if (!virtualProductId) {
      setProductDetailError('VirtualProductID not available');
      return;
    }
    
    try {
      setLoadingProductDetail(true);
      setProductDetailError(null);
      
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
      
      const detailUrl = `/${lang || 'en_GB'}/${brand || currentBrandCode}/product-detail/${firstSkuId}?layout=${getLayoutType}`;
      
      window.open(detailUrl, '_blank');
      
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

  const handleDownloadSelection = useCallback((selectedAssets) => {
    const productIds = selectedAssets
      .map(asset => asset.VirtualProductID || asset.modelNumber || asset.id)
      .filter(Boolean);
    setSelectedProductIdsForDownload(productIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedProductIdsForDownload([]);
  }, []);

  const handleDownloadExecute = useCallback(async (downloadData) => {
    console.log('Download initiated for new products:', downloadData);
  }, []);

  // 处理批量搜索
  const handleMassSearch = (item, childItem, filterValues) => {
    console.log('🆕 Mass search new products:', { item, childItem, filterValues });
    // 处理批量搜索逻辑
  };

  return (
    <SelectedAssetsProvider>
      <ProductCatalogue
        config={newProductCatalogueConfig}
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
    </SelectedAssetsProvider>
  );
}

export default NewProductsPage; 