import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createMediaCatalogueConfig } from '../config/kendoMediaConfig';

// 导入组件
import MediaDownloadDialog from '../components/MediaDownloadDialog';
import ProductCatalogue from '../components/ProductCatalogue';

// 导入钩子 (基于reference代码)
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

const MediaCatalogue = () => {
  // 使用品牌和语言钩子 (基于reference代码)
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  // 下载弹窗状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaForDownload, setSelectedMediaForDownload] = useState([]);

  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    const newConfig = createMediaCatalogueConfig(currentBrandCode);
    return newConfig;
  }, [currentBrandCode]);

  // 处理媒体点击 (基于reference代码逻辑)
  const handleMediaClick = useCallback((media, isAssetType) => {
    console.log('Media clicked:', media);
    // 可以在这里添加媒体预览逻辑
  }, []);

  // 处理媒体下载 (基于reference代码逻辑)
  const handleMediaDownload = useCallback((media) => {
    console.log('Media download clicked:', media);
    // Support both single media and array of media
    const mediaArray = Array.isArray(media) ? media : [media];
    setSelectedMediaForDownload(mediaArray);
    setDownloadDialogOpen(true);
  }, []);

  // 处理下载弹窗关闭
  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaForDownload([]);
  }, []);

  // Remove the onDownload handler since download is now handled internally
  // const handleDownloadExecute = useCallback((downloadData) => {
  //   console.log('Download executed with data:', downloadData);
  //   // Download is now handled internally in MediaDownloadDialog
  // }, []);

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
    <>
      <ProductCatalogue
        key={currentBrandCode} // 确保品牌切换时组件重新渲染
        config={config}
        onProductClick={handleMediaClick}
        onProductDownload={handleMediaDownload}
        onMassSearch={handleMassSearch}
      />
      
      {/* 媒体下载弹窗 */}
      <MediaDownloadDialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        selectedMedia={selectedMediaForDownload}
      />
    </>
  );
};

export default MediaCatalogue; 