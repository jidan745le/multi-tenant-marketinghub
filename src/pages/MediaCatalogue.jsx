import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createMediaCatalogueConfig } from '../config/kendoMediaConfig';

// 导入组件
import MediaDownloadDialog from '../components/MediaDownloadDialog';
import ProductCatalogue from '../components/ProductCatalogue';
import AssetDetailDialog from '../components/AssetDetailDialog';

// 导入Context
import { SelectedAssetsProvider } from '../context/SelectedAssetsContext';

// 导入钩子 (基于reference代码)
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

// 导入工具和服务
import downloadApi from '../services/downloadApi';
import { canDownloadDirectly } from '../utils/downloadFormatClassifier';

const MediaCatalogue = () => {
  // 使用品牌和语言钩子 (基于reference代码)
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  // 下载弹窗状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaForDownload, setSelectedMediaForDownload] = useState([]);
  
  // AssetDetailDialog 状态
  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAssetData, setSelectedAssetData] = useState(null);

  // 根据当前品牌动态创建配置
  const config = useMemo(() => {
    const newConfig = createMediaCatalogueConfig(currentBrandCode);
    return newConfig;
  }, [currentBrandCode]);

  // 处理媒体点击 (基于reference代码逻辑)
  const handleMediaClick = useCallback((media, isAssetType) => {
    console.log('Media clicked:', media, 'isAssetType:', isAssetType);
    
    // 如果是资产类型，打开 AssetDetailDialog
    if (isAssetType && media.id) {
      setSelectedAssetId(media.id);
      setSelectedAssetData(media);
      setAssetDetailOpen(true);
    } else {
      // 对于非资产类型，可以添加其他处理逻辑
      console.log('Non-asset media clicked:', media);
    }
  }, []);

  // 处理媒体下载 (基于reference代码逻辑)
  const handleMediaDownload = useCallback(async (media) => {
    try {
      // Support both single media and array of media
      const mediaArray = Array.isArray(media) ? media : [media];
      
      // Only direct download for single files with non-restricted formats
      if (mediaArray.length === 1 && canDownloadDirectly(mediaArray)) {
        // Use mass-download API with async=false for direct download
        const mediaIds = mediaArray.map(item => item.id || item.mediaId || 0);
        const result = await downloadApi.massDownload(
          mediaIds,
          'originalimage', // Download original format - use API parameter name
          null, // No custom config
          false, // async=false for direct download
          '', // No email
          '' // No CC
        );
        
        // Trigger download if blob is returned
        if (result.blob && result.filename) {
          downloadApi.triggerDownload(result.blob, result.filename);
        }
      } else {
        // Show derivate selection dialog for:
        // 1. Multiple files
        // 2. Single files with restricted formats
        setSelectedMediaForDownload(mediaArray);
        setDownloadDialogOpen(true);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Show error message to user (you can implement a toast notification here)
      alert(`Download failed: ${error.message}`);
    }
  }, []);

  // 处理下载弹窗关闭
  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaForDownload([]);
  }, []);

  // 处理 AssetDetailDialog 关闭
  const handleAssetDetailClose = useCallback(() => {
    setAssetDetailOpen(false);
    setSelectedAssetId(null);
    setSelectedAssetData(null);
  }, []);

  // 处理 AssetDetailDialog 中的下载
  const handleAssetDetailDownload = useCallback((assetId) => {
    console.log('Download from AssetDetailDialog:', assetId);
    // 这里可以调用下载逻辑
    if (selectedAssetData) {
      handleMediaDownload(selectedAssetData);
    }
  }, [selectedAssetData, handleMediaDownload]);

  // 处理批量下载选择 (来自ActionBar)
  const handleDownloadSelection = useCallback(async (selectedAssets) => {
    try {
      console.log('Batch download from ActionBar:', selectedAssets);
      
      // 检查是否可以直接下载 (单个文件且非受限格式)
      if (selectedAssets.length === 1 && canDownloadDirectly(selectedAssets)) {
        // 直接下载
        const mediaIds = selectedAssets.map(item => item.id || item.mediaId || 0);
        const result = await downloadApi.massDownload(
          mediaIds,
          'originalimage', // Download original format
          null, // No custom config
          false, // async=false for direct download
          '', // No email
          '' // No CC
        );
        
        // Trigger download if blob is returned
        if (result.blob && result.filename) {
          downloadApi.triggerDownload(result.blob, result.filename);
        }
      } else {
        // 显示derivate选择对话框 (多个文件或受限格式)
        setSelectedMediaForDownload(selectedAssets);
        setDownloadDialogOpen(true);
      }
    } catch (error) {
      console.error('Batch download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
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
    <SelectedAssetsProvider>
      <ProductCatalogue
        key={currentBrandCode} // 确保品牌切换时组件重新渲染
        config={config}
        onProductClick={handleMediaClick}
        onProductDownload={handleMediaDownload}
        onDownloadSelection={handleDownloadSelection}
        onMassSearch={handleMassSearch}
      />
      
      {/* 媒体下载弹窗 */}
      <MediaDownloadDialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        selectedMedia={selectedMediaForDownload}
      />
      
      {/* 资产详情弹窗 */}
      <AssetDetailDialog
        open={assetDetailOpen}
        onClose={handleAssetDetailClose}
        assetId={selectedAssetId}
        mediaData={selectedAssetData}
        onDownload={handleAssetDetailDownload}
      />
    </SelectedAssetsProvider>
  );
};

export default MediaCatalogue; 