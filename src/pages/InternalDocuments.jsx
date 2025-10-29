import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createInternalDocumentsConfig } from '../config/kendoMediaConfig';

// 导入组件
import AssetDetailDialog from '../components/AssetDetailDialog';
import MediaDownloadDialog from '../components/MediaDownloadDialog';
import ProductCatalogue from '../components/ProductCatalogue';

// 导入Context
import { SelectedAssetsProvider } from '../context/SelectedAssetsContext';

// 导入钩子
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

// 导入工具和服务
// Download logic is now handled internally by MediaDownloadDialog

const InternalDocuments = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]); // Store media IDs instead of full objects
  
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

  const handleDocumentDownload = useCallback((document) => {
    let mediaIds = [];
    if (Array.isArray(document)) {
      mediaIds = document
        .map(item => (typeof item === 'string' || typeof item === 'number') ? item : (item?.id || item?.mediaId))
        .filter(Boolean);
    } else {
      mediaIds = [(typeof document === 'string' || typeof document === 'number') ? document : (document?.id || document?.mediaId)]
        .filter(Boolean);
    }
    console.log('📤 InternalDocuments: Passing media IDs to download dialog:', mediaIds);
    if (mediaIds.length === 0) return;
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaIds([]);
  }, []);

  // AssetDetailDialog 关闭处理
  const handleAssetDetailDialogClose = useCallback(() => {
    setAssetDetailDialogOpen(false);
    setSelectedAssetForPreview(null);
  }, []);

  const handleDownloadSelection = useCallback((selectedAssets) => {
    console.log('📂 Batch download from ActionBar:', selectedAssets);
    
    // Extract IDs from selected assets
    const mediaIds = selectedAssets.map(item => item.id || item.mediaId).filter(Boolean);
    
    console.log('📤 InternalDocuments: Passing batch media IDs to download dialog:', mediaIds);
    
    // MediaDownloadDialog will handle the logic:
    // 1. For single ID: fetch details and check format
    // 2. For multiple IDs: show dialog
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
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
        selectedMediaIds={selectedMediaIds}
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

