import React from 'react';
import ProductCatalogue from '../../components/ProductCatalogue';
import { newProductCatalogueConfig } from '../../config/newProductsConfig';

function NewProductsPage() {
  // 处理产品点击
  const handleProductClick = (product) => {
    console.log('🆕 Open new product page for:', product.name);
    console.log('📅 Online Date:', product._graphqlData?.OnlineDate);
    // 可以在这里导航到产品详情页
  };

  // 处理产品下载
  const handleProductDownload = (product) => {
    console.log('🆕 Download new product:', product.name);
    console.log('📅 Online Date:', product._graphqlData?.OnlineDate);
    // 处理产品下载逻辑
  };

  // 处理批量搜索
  const handleMassSearch = (item, childItem, filterValues) => {
    console.log('🆕 Mass search new products:', { item, childItem, filterValues });
    // 处理批量搜索逻辑
  };

  return (
    <ProductCatalogue
      config={newProductCatalogueConfig}
      onProductClick={handleProductClick}
      onProductDownload={handleProductDownload}
      onMassSearch={handleMassSearch}
    />
  );
}

export default NewProductsPage; 