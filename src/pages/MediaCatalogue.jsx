import React, { useCallback, useEffect } from 'react';

// 导入配置
import { kendoMediaCatalogueConfig } from '../config/kendoMediaConfig';

// 导入组件
import ProductCatalogue from '../components/ProductCatalogue';

// 导入钩子 (基于reference代码)
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

const MediaCatalogue = () => {
  // 使用品牌和语言钩子 (基于reference代码)
  const { currentBrand } = useBrand();
  const { currentLanguage } = useLanguage();

  // 处理媒体点击 (基于reference代码逻辑)
  const handleMediaClick = useCallback((media) => {
    console.log('Media clicked:', media);
    // 可以在这里添加媒体预览逻辑
  }, []);

  // 处理媒体下载 (基于reference代码逻辑)
  const handleMediaDownload = useCallback((media) => {
    console.log('Media download:', media);
    // 可以在这里添加下载逻辑
    if (media.downloadUrl) {
      // 模拟下载
      const link = document.createElement('a');
      link.href = media.downloadUrl;
      link.download = media.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // 处理批量搜索 (基于reference代码逻辑)
  const handleMassSearch = useCallback((item, childItem, filterValues) => {
    console.log('Mass search triggered:', { item, childItem, filterValues });
    // 可以在这里添加批量搜索逻辑
  }, []);

  // 监听品牌和语言变化 (基于reference代码)
  useEffect(() => {
    console.log('Media page - Brand/Language changed:', {
      brand: currentBrand?.code,
      language: currentLanguage
    });
  }, [currentBrand, currentLanguage]);

  return (
    <ProductCatalogue
      config={kendoMediaCatalogueConfig}
      onProductClick={handleMediaClick}
      onProductDownload={handleMediaDownload}
      onMassSearch={handleMassSearch}
    />
  );
};

export default MediaCatalogue; 