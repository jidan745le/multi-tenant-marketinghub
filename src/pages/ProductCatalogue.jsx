import React from 'react';
import ProductCatalogue from '../components/ProductCatalogue';
import { productCatalogueConfig } from '../config/productCatalogueConfig';

function ProductCataloguePage() {
  // 处理产品点击
  const handleProductClick = (product) => {
    console.log('Open product page for:', product.name);
    // 可以在这里导航到产品详情页
  };

  // 处理产品下载
  const handleProductDownload = (product) => {
    console.log('Download product:', product.name);
    // 处理产品下载逻辑
  };

  // 处理批量搜索
  const handleMassSearch = (item, childItem, filterValues) => {
    console.log('Mass search:', { item, childItem, filterValues });
    // 处理批量搜索逻辑
  };

  return (
    <ProductCatalogue
      config={productCatalogueConfig}
      onProductClick={handleProductClick}
      onProductDownload={handleProductDownload}
      onMassSearch={handleMassSearch}
    />
  );
}

export default ProductCataloguePage; 