import React, { useEffect, useMemo } from 'react';
import ProductCatalogue from '../components/ProductCatalogue';
import { createProductCatalogueConfig } from '../config/kendoProductConfig';
import { useBrand } from '../hooks/useBrand';

function ProductCataloguePage() {
  // 获取当前品牌
  const { currentBrandCode } = useBrand();
  
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
  const handleProductClick = (product) => {
    console.log(`Open ${currentBrandCode.toUpperCase()} product page for:`, product.name);
    // 可以在这里导航到产品详情页
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
    <ProductCatalogue
      key={currentBrandCode} // 确保品牌切换时组件重新渲染
      config={config}
      onProductClick={handleProductClick}
      onProductDownload={handleProductDownload}
      onMassSearch={handleMassSearch}
    />
  );
}

export default ProductCataloguePage; 