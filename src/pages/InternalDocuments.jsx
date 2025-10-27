import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createInternalDocumentsConfig } from '../config/kendoMediaConfig';

// 导入组件
import MediaDownloadDialog from '../components/MediaDownloadDialog';
import ProductCatalogue from '../components/ProductCatalogue';
import AssetDetailDialog from '../components/AssetDetailDialog';

// 导入Context
import { SelectedAssetsProvider } from '../context/SelectedAssetsContext';

// 导入钩子
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

// 导入工具和服务
import downloadApi from '../services/downloadApi';
import { canDownloadDirectly } from '../utils/downloadFormatClassifier';

const InternalDocuments = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaForDownload, setSelectedMediaForDownload] = useState([]);
  
  // AssetDetailDialog 状态管理
  const [assetDetailDialogOpen, setAssetDetailDialogOpen] = useState(false);
  const [selectedAssetForPreview, setSelectedAssetForPreview] = useState(null);

  const config = useMemo(() => {
    console.log(`Creating Internal Documents config for brand: ${currentBrandCode}`);
    return createInternalDocumentsConfig(currentBrandCode);
  }, [currentBrandCode]);

  const handleDocumentClick = useCallback((document, isAsset = false) => {
    console.log('Document clicked:', document, 'isAsset:', isAsset);
    
    // 如果是资产类型（来自DigitalAssetCard的预览按钮），打开AssetDetailDialog
    if (isAsset && document) {
      setSelectedAssetForPreview(document);
      setAssetDetailDialogOpen(true);
    }
  }, []);

  const handleDocumentDownload = useCallback(async (document) => {
    try {
      const mediaArray = Array.isArray(document) ? document : [document];
      
      if (mediaArray.length === 1 && canDownloadDirectly(mediaArray)) {
        const mediaIds = mediaArray.map(item => item.id || item.mediaId || 0);
        const result = await downloadApi.massDownload(mediaIds, 'originalimage', null, false, '', '');
        
        if (result.blob && result.filename) {
          downloadApi.triggerDownload(result.blob, result.filename);
        }
      } else {
        setSelectedMediaForDownload(mediaArray);
        setDownloadDialogOpen(true);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  }, []);

  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaForDownload([]);
  }, []);

  // AssetDetailDialog 关闭处理
  const handleAssetDetailDialogClose = useCallback(() => {
    setAssetDetailDialogOpen(false);
    setSelectedAssetForPreview(null);
  }, []);

  const handleDownloadSelection = useCallback(async (selectedAssets) => {
    try {
      console.log('📂 Batch download from ActionBar:', selectedAssets);
      
      if (selectedAssets.length === 1 && canDownloadDirectly(selectedAssets)) {
        const mediaIds = selectedAssets.map(item => item.id || item.mediaId || 0);
        const result = await downloadApi.massDownload(mediaIds, 'originalimage', null, false, '', '');
        
        if (result.blob && result.filename) {
          downloadApi.triggerDownload(result.blob, result.filename);
        }
      } else {
        setSelectedMediaForDownload(selectedAssets);
        setDownloadDialogOpen(true);
      }
    } catch (error) {
      console.error('Batch download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  }, []);

  const handleMassSearch = useCallback((item, childItem, filterValues) => {
    console.log('📂 Mass search triggered:', { item, childItem, filterValues });
  }, []);

  useEffect(() => {
    console.log('📂 Internal Documents page - Brand/Language changed:', {
      brand: currentBrand?.code,
      language: currentLanguage
    });
  }, [currentBrand, currentLanguage]);

  return (
    <SelectedAssetsProvider>
      <ProductCatalogue
        key={currentBrandCode}
        config={config}
        onProductClick={handleDocumentClick}
        onProductDownload={handleDocumentDownload}
        onDownloadSelection={handleDownloadSelection}
        onMassSearch={handleMassSearch}
      />
      
      <MediaDownloadDialog
        open={downloadDialogOpen}
        onClose={handleDownloadDialogClose}
        selectedMedia={selectedMediaForDownload}
      />
      
      {/* AssetDetailDialog for preview functionality */}
      <AssetDetailDialog
        open={assetDetailDialogOpen}
        onClose={handleAssetDetailDialogClose}
        assetId={selectedAssetForPreview?.id || selectedAssetForPreview?.identifier}
        onDownload={handleDocumentDownload}
        title="pdp.details"
      />
    </SelectedAssetsProvider>
  );
};

export default InternalDocuments;

