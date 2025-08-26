import React, { useCallback, useEffect, useMemo } from 'react';

// 导入配置
import { createVideoCatalogueConfig } from '../config/videosConfig';

// 导入组件
import ProductCatalogue from '../components/ProductCatalogue';

// 导入钩子 (基于reference代码)
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

const Videos = () => {
  // 使用品牌和语言钩子 (基于reference代码)
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();

  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    console.log(`🎥 Creating video catalogue config for brand: ${currentBrandCode}`);
    const newConfig = createVideoCatalogueConfig(currentBrandCode);
    console.log(`🔧 Video config created with brand:`, currentBrandCode);
    return newConfig;
  }, [currentBrandCode]);

  // 处理视频点击 (基于reference代码逻辑)
  const handleVideoClick = useCallback((video) => {
    console.log('🎥 Video clicked:', video);
    console.log('🎥 Video details:', {
      filename: video.filename,
      mediaType: video.mediaType,
      fileSize: video.fileSize,
      mimetype: video.mimetype,
      createdDate: video.createdDate
    });
    // 可以在这里添加视频预览逻辑
  }, []);

  // 处理视频下载 (基于reference代码逻辑)
  const handleVideoDownload = useCallback((video) => {
    console.log('🎥 Video download:', video);
    // 可以在这里添加下载逻辑
    if (video.downloadUrl) {
      // 模拟下载
      const link = document.createElement('a');
      link.href = video.downloadUrl;
      link.download = video.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('🎥 Downloaded video:', {
        filename: video.filename,
        url: video.downloadUrl,
        fileSize: video.fileSize
      });
    }
  }, []);

  // 处理批量搜索 (基于reference代码逻辑)
  const handleMassSearch = useCallback((item, childItem, filterValues) => {
    console.log('🎥 Video mass search triggered:', { item, childItem, filterValues });
    // 可以在这里添加批量搜索逻辑
  }, []);

  // 监听品牌和语言变化 (基于reference代码)
  useEffect(() => {
    console.log('🎥 Videos page - Brand/Language changed:', {
      brand: currentBrand?.code,
      language: currentLanguage
    });
  }, [currentBrand, currentLanguage]);

  return (
    <ProductCatalogue
      key={currentBrandCode} // 确保品牌切换时组件重新渲染
      config={config}
      onProductClick={handleVideoClick}
      onProductDownload={handleVideoDownload}
      onMassSearch={handleMassSearch}
    />
  );
};

export default Videos; 