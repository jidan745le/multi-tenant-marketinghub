import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createAfterSalesConfig } from '../config/kendoMediaConfig';

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

const AfterSalesService = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]); // Store media IDs instead of full objects
  
  // AssetDetailDialog 状态
  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAssetData, setSelectedAssetData] = useState(null);

  const config = useMemo(() => {
    console.log(`Creating After Sales Service config for brand: ${currentBrandCode}`);
    return createAfterSalesConfig(currentBrandCode);
  }, [currentBrandCode]);

  const handleDocumentClick = useCallback((document, isAssetType) => {
    console.log('Document clicked:', document, 'isAssetType:', isAssetType);
    
    // 如果是资产类型，打开 AssetDetailDialog
    if (isAssetType && document.id) {
      setSelectedAssetId(document.id);
      setSelectedAssetData(document);
      setAssetDetailOpen(true);
    } else {
      // 对于非资产类型，可以添加其他处理逻辑
      console.log('Non-asset document clicked:', document);
    }
  }, []);

  const handleDocumentDownload = useCallback((document) => {
    const mediaArray = Array.isArray(document) ? document : [document];
    
    // Extract IDs from media objects
    const mediaIds = mediaArray.map(item => item.id || item.mediaId).filter(Boolean);
    
    console.log('📤 AfterSalesService: Passing media IDs to download dialog:', mediaIds);
    
    // MediaDownloadDialog will handle the logic:
    // 1. For single ID: fetch details and check format
    // 2. For multiple IDs: show dialog
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaIds([]);
  }, []);

  // 处理 AssetDetailDialog 关闭
  const handleAssetDetailClose = useCallback(() => {
    setAssetDetailOpen(false);
    setSelectedAssetId(null);
    setSelectedAssetData(null);
  }, []);

  // 处理 AssetDetailDialog 中的下载
  const handleAssetDetailDownload = useCallback((assetId) => {
    console.log('Download from AssetDetailDialog in AfterSalesService:', assetId);
    // 这里可以调用下载逻辑
    if (selectedAssetData) {
      handleDocumentDownload(selectedAssetData);
    }
  }, [selectedAssetData, handleDocumentDownload]);

  const handleDownloadSelection = useCallback((selectedAssets) => {
    console.log('📄 Batch download from ActionBar:', selectedAssets);
    
    // Extract IDs from selected assets
    const mediaIds = selectedAssets.map(item => item.id || item.mediaId).filter(Boolean);
    
    console.log('📤 AfterSalesService: Passing batch media IDs to download dialog:', mediaIds);
    
    // MediaDownloadDialog will handle the logic:
    // 1. For single ID: fetch details and check format
    // 2. For multiple IDs: show dialog
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleMassSearch = useCallback((item, childItem, filterValues) => {
    console.log('📄 Mass search triggered:', { item, childItem, filterValues });
  }, []);

  useEffect(() => {
    console.log('📄 After Sales Service page - Brand/Language changed:', {
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

export default AfterSalesService;

