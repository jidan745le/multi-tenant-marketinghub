import React, { useCallback, useState } from 'react';
import ProductCatalogue from '../../components/ProductCatalogue';
import ProductMassDownloadDialog from '../../components/ProductMassDownloadDialog';
import { newProductCatalogueConfig } from '../../config/newProductsConfig';
import { SelectedAssetsProvider } from '../../context/SelectedAssetsContext';

function NewProductsPage() {
  // 批量下载对话框状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedProductIdsForDownload, setSelectedProductIdsForDownload] = useState([]);

  // 处理产品点击
  const handleProductClick = (product) => {
    console.log('🆕 Open new product page for:', product.name);
    console.log('📅 Online Date:', product._graphqlData?.OnlineDate);
    // 可以在这里导航到产品详情页
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