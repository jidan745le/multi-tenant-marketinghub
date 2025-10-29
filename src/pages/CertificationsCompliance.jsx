import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createCertificationsConfig } from '../config/kendoMediaConfig';

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

const CertificationsCompliance = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]); // Store media IDs instead of full objects
  
  // AssetDetailDialog 状态管理
  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [selectedAssetData, setSelectedAssetData] = useState(null);

  const config = useMemo(() => {
    console.log(`🏆 Creating Certifications & Compliance config for brand: ${currentBrandCode}`);
    return createCertificationsConfig(currentBrandCode);
  }, [currentBrandCode]);

  const handleDocumentClick = useCallback((document) => {
    console.log('🏆 Document clicked:', document);
    console.log('Document details:', {
      id: document.id,
      filename: document.filename,
      mediaType: document.mediaType,
      fileSize: document.fileSize,
      mimetype: document.mimetype,
      createdDate: document.createdDate
    });
    
    // 打开 AssetDetailDialog 进行预览
    if (document.id) {
      setSelectedAssetId(document.id);
      setSelectedAssetData(document);
      setAssetDetailOpen(true);
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
    console.log('📤 CertificationsCompliance: Passing media IDs to download dialog:', mediaIds);
    if (mediaIds.length === 0) return;
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleDownloadDialogClose = useCallback(() => {
    setDownloadDialogOpen(false);
    setSelectedMediaIds([]);
  }, []);

  const handleDownloadSelection = useCallback((selectedAssets) => {
    console.log('🏆 Batch download from ActionBar:', selectedAssets);
    
    // Extract IDs from selected assets
    const mediaIds = selectedAssets.map(item => item.id || item.mediaId).filter(Boolean);
    
    console.log('📤 CertificationsCompliance: Passing batch media IDs to download dialog:', mediaIds);
    
    // MediaDownloadDialog will handle the logic:
    // 1. For single ID: fetch details and check format
    // 2. For multiple IDs: show dialog
    setSelectedMediaIds(mediaIds);
    setDownloadDialogOpen(true);
  }, []);

  const handleMassSearch = useCallback((item, childItem, filterValues) => {
    console.log('🏆 Mass search triggered:', { item, childItem, filterValues });
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
    if (assetId) {
      setSelectedMediaIds([assetId]);
      setDownloadDialogOpen(true);
      return;
    }
    if (selectedAssetData) {
      handleDocumentDownload(selectedAssetData);
    }
  }, [selectedAssetData, handleDocumentDownload]);

  useEffect(() => {
    console.log('🏆 Certifications & Compliance page - Brand/Language changed:', {
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
      
      {/* Asset Detail Dialog */}
      <AssetDetailDialog
        open={assetDetailOpen}
        onClose={handleAssetDetailClose}
        assetId={selectedAssetId}
        onDownload={handleAssetDetailDownload}
      />
    </SelectedAssetsProvider>
  );
};

export default CertificationsCompliance;

