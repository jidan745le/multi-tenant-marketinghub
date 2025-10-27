import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 导入配置
import { createCertificationsConfig } from '../config/kendoMediaConfig';

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

const CertificationsCompliance = () => {
  const { currentBrand, currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedMediaForDownload, setSelectedMediaForDownload] = useState([]);
  
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

  const handleDownloadSelection = useCallback(async (selectedAssets) => {
    try {
      console.log('🏆 Batch download from ActionBar:', selectedAssets);
      
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
        selectedMedia={selectedMediaForDownload}
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

