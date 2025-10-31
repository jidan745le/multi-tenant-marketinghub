import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  styled,
  CircularProgress,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import useAssetInfo from '../hooks/useAssetInfo';
// import { axiosExt } from 'src/utils/axios'; // 暂时用mock数据

const VideoPlayerContainer = styled(Box)({
  width: 320,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  position: 'relative',
  marginLeft: 24,
  marginTop: -3,
  marginBottom: '26px',
  flex: '0 0 320px', 
  alignSelf: 'stretch', 
  minHeight: '100%' 
});

const VideoPlayer = styled('video')({
  objectFit: 'contain',
  width: '100%',
  maxHeight: '100%'
});

const PdfViewer = styled('iframe')({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '4px'
});


const InfoContainer = styled(Box)({
  flex: '1 1 auto',
  maxWidth: 455,
  boxSizing: 'border-box',
  padding: '2px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%', 
  alignSelf: 'stretch' 
});

const ModalHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
});

const DetailsTitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const DetailsIcon = styled(Box)({
  width: '16px',
  height: '16px',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M3 6h18M3 12h18M3 18h18'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain'
});

const DetailsText = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000'
});

const CloseButton = styled(Box)({
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  // fontWeight: 'bold',
  color: '#666',
  '&:hover': {
    color: '#000'
  }
});

const HeaderSection = styled(Box)({
  marginBottom: '16px'
});

const TitleText = styled(Typography)({
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '24px',
  marginBottom: '8px',
  wordBreak: 'break-all'
});

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '8px'
});

const TagChip = styled(Chip)(({ theme }) => ({
  fontSize: '10px',
  height: '20px',
  minWidth: 'auto', 
  width: 'auto', 
  padding: '0 8px', 
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  borderRadius: '3px',
  fontWeight: '500',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}10`
  }
}));

const InfoContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  marginBottom: '6px',
  display: 'flex',
  gap: '-2px',
  backgroundColor: '#f5f5f5',
  padding: '16px',
  borderRadius: '4px'
});

const InfoSection = styled(Box)({
  flex: 1,
  minWidth: 0
});

const SectionTitle = styled(Typography)({
  fontSize: '12px',
  marginTop: '-14px',
  fontWeight: 700,
  marginBottom: '8px',
  fontFamily: '"Open Sans", sans-serif',
  lineHeight: '390%',
  letterSpacing: '0.34px',
  color: '#000000',
});

const InfoList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px' 
});

const InfoItem = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start', // 改为左对齐，减少间距
  alignItems: 'flex-start',
  fontSize: '10px',
  lineHeight: '12px',
  gap: '8px' // 添加固定间距
});

const InfoLabel = styled(Typography)({
  fontSize: '10px',
  fontWeight: 400,
  minWidth: '80px', // 进一步缩小标签宽度
  maxWidth: '80px', // 限制最大宽度
  color: '#000000',
  fontFamily: '"Open Sans", sans-serif'
});

const InfoValue = styled(Typography)({
  fontSize: '10px',
  flex: 1,
  textAlign: 'left', // 改为左对齐
  wordBreak: 'break-word',
  color: '#000000',
  fontFamily: '"Open Sans", sans-serif',
  minWidth: '100px' // 增加值的显示宽度
});


const CancelButton = styled(Button)({
  color: '#666',
  borderColor: '#ddd',
  backgroundColor: '#fff',
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontWeight: '500',
  padding: '5px 28px',
  minWidth: 'auto',
  width: 'auto',
  '&:hover': {
    borderColor: '#999',
    backgroundColor: '#f5f5f5'
  }
});

const DownloadButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontWeight: '500',
  padding: '4px 28px',
  minWidth: 'auto',
  width: 'auto',
  border: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const AssetDetailDialog = ({
  open,
  onClose,
  assetId, 
  onDownload,
  // 配置化参数
  dialogConfig = {
    show_header: true,
    show_tags: true,
    show_info_sections: true,
    show_buttons: true,
    show_close_button: true,
    show_download_button: true,
    show_custom_buttons: false
  },
  // 信息字段配置
  infoSections = [
    {
      title: 'common.basicInfo',
      fields: [
        { key: 'customerModelNumber', label: 'common.modelNumber', fallback: '--', altKeys: ['modelNumber'] },
        { key: 'customerImageType', label: 'common.mediaType', fallback: '--' },
        { key: 'customerUsageRights', label: 'common.usage', fallback: '--'},
        { key: 'language', label: 'common.language', fallback: '--' },
        { key: 'productIds', label: 'common.productIds', fallback: '--' },
        { key: 'customerApprovalStatus', label: 'common.approvalStatus', fallback: '--', highlight: true }
      ]
    },
    {
      title: 'common.technical',
      fields: [
        // { key: 'name', label: 'common.name', fallback: '--' },
        { key: 'dimensions', label: 'common.dimensions', fallback: '--' },
        { key: 'size', label: 'common.size', fallback: '--' },
        { key: 'creationDate', label: 'common.createdOn', fallback: '--' },
        { key: 'lastModified', label: 'common.changeDate', fallback: '--' }
      ]
    }
  ],
  // 标签配置
  tagConfig = {
    sourceField: 'customerKeywords',
    tagsField: 'tags', 
    separator: /[,;\s]+/,
    maxCount: 4,
    fallbackTags: ['','','','','','']
  },
  // 媒体类型配置
  mediaTypeConfig = {
    video: {
      extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
      fields: ['format', 'type'],
      keywords: ['video', 'mp4', 'avi']
    },
    image: {
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'psd'],
      fields: ['format', 'type'],
      keywords: ['image', 'jpg', 'png', 'photo']
    },
    pdf: {
      extensions: ['pdf'],
      fields: ['format', 'type'],
      keywords: ['pdf', 'document', 'application/pdf']
    }
  },
  // 自定义按钮配置
  customButtons = [],
  // 样式配置
  theme = {
    container: {
      maxWidth: '800px',
      minHeight: '320px'
    },
    mediaContainer: {
      width: 320,
      backgroundColor: '#F5F5F5',
      minHeight: 'fit-content' 
    },
    infoContainer: {
      flex: '1 1 auto',
      maxWidth: 455,
      minHeight: 'fit-content'
    }
  },
  // 自定义函数
  customMediaTypeDetector,
  customTagProcessor,
  customMediaUrlFetcher,
  customButtonRenderer,
  // 其他配置
  title = 'pdp.details'
}) => {
  const { t } = useTranslation();
  const [mediaUrl, setMediaUrl] = useState(''); 
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  
  // 使用 useAssetInfo hook 获取数据
  const { data: assetInfo, loading: assetLoading, error: assetError, refetch } = useAssetInfo(assetId);
  

  useEffect(() => {
    if (assetId) {
      setMediaUrl('');
      setIsMediaLoading(false); 
      setMediaError(false);
    }
  }, [assetId]);
  
  // 将 hook 数据转换为组件需要的格式
  const transformedMediaData = useMemo(() => {
    if (!assetInfo) {

      return {
        // 基础标识信息
        identifier: '--',
        filename: '--',
        displayName: '--',
        format: '--',
        type: '--',
        
        // Basic Info
        customerModelNumber: '--',
        customerImageType: '--',
        customerUsageRights: '--',
        language: '--',
        productIds: '--',
        customerApprovalStatus: '--',
        
        // Technical
        // name: '--',
        dimensions: '--',
        size: '--',
        creationDate: '--',
        lastModified: '--',
        
        // 标签
        customerKeywords: '--',
        tags: [],
        
        // 其他
        duration: '--',
        customerChannel: [],
        
        // 媒体 URL 相关
        fullpath: '--',
        thumbnail: '--',
        mimetype: '--'
      };
    }
    
    return {
      // 基础标识信息
      identifier: assetInfo.id || '--',
      filename: assetInfo.name || '--',
      displayName: assetInfo.name || '--',
      format: assetInfo.mediaType || assetInfo.type || '--',
      type: assetInfo.type || '--',
      
      // Basic Info
      customerModelNumber: assetInfo.id || '--',
      customerImageType: assetInfo.mediaType || assetInfo.type || '--',
      customerUsageRights: assetInfo.usage || '--',
      language: assetInfo.language || '--',
      productIds: assetInfo.productIds || assetInfo.modelNumber || '--',
      customerApprovalStatus: '• Published', // 默认值
      
      // Technical
      // name: assetInfo.name || '--',
      dimensions: assetInfo.width && assetInfo.height ? `${assetInfo.width} X ${assetInfo.height}` : '--',
      size: assetInfo.fileSize || '--',
      creationDate: assetInfo.creationDate || '--',
      lastModified: assetInfo.creationDate || '--',
      
      // 标签
      customerKeywords: assetInfo.tags ? assetInfo.tags.join(', ') : '--',
      tags: assetInfo.tags || [], // 直接传递 tags 数组
      
      // 其他
      customerChannel: [],
      
      // 媒体 URL 相关
      fullpath: assetInfo.fullpath || '--',
      thumbnail: assetInfo.thumbnail || '--',
      mimetype: assetInfo.mimetype || '--'
    };
  }, [assetInfo]);
  
  // 避免每次渲染都创建新对象
  const stableInfoSections = useMemo(() => infoSections, [infoSections]);
  const stableMediaTypeConfig = useMemo(() => mediaTypeConfig, [mediaTypeConfig]);
  const stableTagConfig = useMemo(() => tagConfig, [tagConfig]);
  const stableDialogConfig = useMemo(() => dialogConfig, [dialogConfig]);
  const stableTheme = useMemo(() => theme, [theme]);

  // 添加转换结果的日志
  useEffect(() => {
    if (transformedMediaData) {
      console.log('AssetDetailDialog - Transformed data result:', transformedMediaData);
    }
  }, [transformedMediaData]);

  // 可配置的数据转换
  const generateInfoData = useCallback((data, section) => {
    return section.fields.map(field => {
      let value = data[field.key];
      
      // 备用的
      if (!value && field.altKeys) {
        for (const altKey of field.altKeys) {
          if (data[altKey]) {
            value = data[altKey];
            break;
          }
        }
      }
      
      // 处理数组类型
      if (field.isArray && Array.isArray(value)) {
        value = value.join(', ');
      }
      
      return {
        label: field.label,
        value: value || field.fallback || '-',
        highlight: field.highlight
      };
    });
  }, []);

  // 避免额外的状态更新
  const infoData = useMemo(() => {
    if (!transformedMediaData || !open) return {};
    
    const newInfoData = {};
    stableInfoSections.forEach(section => {
      newInfoData[section.title] = {
        title: section.title,
        data: generateInfoData(transformedMediaData, section)
      };
    });
    return newInfoData;
  }, [transformedMediaData, open, stableInfoSections, generateInfoData]);

  // 可配置的媒体类型检测
  const detectMediaType = useCallback((data) => {
    if (customMediaTypeDetector) {
      return customMediaTypeDetector(data);
    }
    
    if (!data) return 'video';
    const filename = data.filename || data.name || '';
    const extension = filename.toLowerCase().split('.').pop();
    
    // 使用配置的媒体类型检测
    for (const [type, config] of Object.entries(stableMediaTypeConfig)) {
      if (config.extensions && config.extensions.includes(extension)) {
        return type;
      }
      
      // 检查字段匹配
      if (config.fields) {
        for (const field of config.fields) {
          if (data[field]) {
            const value = data[field].toLowerCase();
            if (config.keywords && config.keywords.some(keyword => value.includes(keyword))) {
              return type;
            }
          }
        }
      }
    }
    
    return 'video'; // 默认类型
  }, [customMediaTypeDetector, stableMediaTypeConfig]);
  

  const mediaType = useMemo(() => {
    try {
      const dataToUse = transformedMediaData; 
      const type = detectMediaType?.(dataToUse);
      return type || 'image'; 
    } catch (error) {
      console.warn('Error detecting media type:', error);
      return 'image';
    }
  }, [transformedMediaData, detectMediaType]);

  // 标签
  const renderTags = (tags) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
    
    return (
      <TagsContainer>
        {tags
          .filter(tag => tag && typeof tag === 'string' && tag.trim())
          .map((tag, index) => (
            <TagChip 
              key={index}
              label={tag.trim()}
              variant="outlined"
            />
          ))}
      </TagsContainer>
    );
  };

  // 信息项
  const renderInfoItem = (item) => {
    const isPublished = item.value && item.value.includes('Published');
    const shouldHighlight = item.highlight && isPublished;
    
    return (
      <InfoItem key={item.label}>
        <InfoLabel>{t(item.label)}</InfoLabel>
        <InfoValue 
          sx={shouldHighlight ? { color: '#6eb82a' } : {}}
        >
          {item.value || '-'}
        </InfoValue>
      </InfoItem>
    );
  };

  // 信息区块
  const renderInfoSection = (section) => (
    <InfoSection key={section.title}>
      <SectionTitle>{t(section.title)}</SectionTitle>
      <InfoList>
        {section.data?.map((item) => renderInfoItem(item))}
      </InfoList>
    </InfoSection>
  );


  // 可配置的标签处理
  const getTags = (data) => {
    if (customTagProcessor) {
      return customTagProcessor(data);
    }
    
    if (stableTagConfig.tagsField && data[stableTagConfig.tagsField] && Array.isArray(data[stableTagConfig.tagsField])) {
      const tags = data[stableTagConfig.tagsField]
        .filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
        .slice(0, stableTagConfig.maxCount);
      
      if (tags.length > 0) {
        return tags;
      }
    }
    
    // 没有 tags 数组，则使用 customerKeywords 字段
    const keywords = data[stableTagConfig.sourceField] || '';
    if (keywords && keywords !== '--') {
      return keywords.split(stableTagConfig.separator)
        .filter(keyword => keyword.trim() !== '')
        .slice(0, stableTagConfig.maxCount);
    }
    
    // 最后还没有就fallback
    return stableTagConfig.fallbackTags;
  };

  const setMediaUrlFromAssetInfo = useCallback(() => {
    if (!assetInfo) return;
    
    setMediaError(false);
    
    try {
      if (customMediaUrlFetcher) {
        customMediaUrlFetcher(assetInfo).then(url => {
          setMediaUrl(url);
        }).catch(error => {
          console.error('Error in custom media URL fetcher:', error);
          setMediaError(true);
        });
        return;
      }

      const urlToUse = assetInfo.thumbnail || assetInfo.fullpath;
      if (urlToUse) {
        // 拼接URL的地方
        const fullUrl = urlToUse.startsWith('http') ? urlToUse : `https://pim-test.kendo.com${urlToUse}`;
        setMediaUrl(fullUrl);
        return;
      }
      
      // 如果没有URL，设置错误状态
      setMediaError(true);
      console.warn("AssetDetailDialog - No media URL found for asset:", assetInfo);
    } catch (error) {
      console.error('Error setting media URL:', error);
      setMediaError(true);
    }
  }, [customMediaUrlFetcher, assetInfo]);



  useEffect(() => {
    if (assetInfo) {
      setMediaUrlFromAssetInfo();
    }
  }, [assetInfo, setMediaUrlFromAssetInfo]);


  useEffect(() => {
    if (!open) {
      setMediaUrl('');
      setIsMediaLoading(false);
      setMediaError(false);
    }
  }, [open]);


  const dataToUse = transformedMediaData; 
  if (!dataToUse) return null;
  
  if (typeof onClose !== 'function') {
    console.warn('AssetDetailDialog: onClose is not a function');
    return null;
  }
  
  // 如果正在加载 hook 数据，显示加载状态
  if (assetLoading && !assetInfo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            {t('common.loading')}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
  
  // 如果 hook 数据加载出错，显示错误状态
  if (assetError && !assetInfo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {assetError}
          </Typography>
          <Button variant="outlined" onClick={refetch}>
            {t('common.retry')}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          ...stableTheme.container
        }
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          ...stableTheme.container,
          padding: 0,
          '&.MuiDialogContent-root': {
            padding: 0
          }
        }}
      >
        {/* 顶部标题区域 */}
        {stableDialogConfig.show_header && (
          <ModalHeader
            sx={{
              padding: '24px 24px 0 24px',
              marginBottom: '0'
            }}
          >
            <DetailsTitle>
              <DetailsIcon />
            <DetailsText>{t(title)}</DetailsText>
          </DetailsTitle>
          {stableDialogConfig.show_close_button && (
            <CloseButton onClick={onClose}>×</CloseButton>
          )}
          </ModalHeader>
        )}

        {/* 主要内容区域 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch', 
            flex: 1,
            marginTop: '20px',
            minHeight: '200px' 
          }}
        >
          {/* 左侧区域 */}
          <VideoPlayerContainer sx={stableTheme.mediaContainer}>
            {isMediaLoading ? (
              <CircularProgress size={40} />
            ) : mediaError ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="body2">
                  {t('media.error')}
                </Typography>
              </Box>
              ) : mediaUrl ? (
                mediaType === 'video' ? (
                  <VideoPlayer
                    controls
                    src={mediaUrl}
                    preload="metadata"
                  />
                ) : mediaType === 'pdf' ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      '&:hover .pdf-preview-bg': {
                        filter: 'blur(8px)'
                      },
                      '&:hover .pdf-overlay': {
                        opacity: 1
                      }
                    }}
                    onClick={() => window.open(mediaUrl, '_blank')}
                  >
                    {/* PDF 预览背景*/}
                    <Box
                      className="pdf-preview-bg"
                      component="img"
                      src={mediaUrl}
                      alt={dataToUse.filename || dataToUse.name || 'PDF Document'}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // 设置最大显示尺寸，放缩pdf图片
                        maxWidth: '260px',
                        maxHeight: '260px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    
                    {/* 半透明遮罩层 */}
                    <Box
                      className="pdf-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      {/* 预览按钮 */}
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
                          color: 'white !important',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease !important'
                        }}
                      >
                        {t('assetDetail.previewPdf')}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={mediaUrl}
                    alt={dataToUse.filename || dataToUse.name || 'Media'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      // 设置最大显示尺寸，放缩图片
                      maxWidth: '260px',
                      maxHeight: '260px',
                      display: 'block',
                      margin: 'auto'
                    }}
                  />
                )
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="body2">
                  {t('media.loading')}
                </Typography>
              </Box>
            )}
          </VideoPlayerContainer>

          {/* 右侧信息面板 */}
          <InfoContainer sx={stableTheme.infoContainer}>
            <HeaderSection>
              <TitleText>
                {dataToUse.filename || dataToUse.name || 'SNT2125AP_SNT2120AP_EGO_SNOW-BLOWE-AUGER-PADDLE-ROTATION_22-0214_ON-WHITE.PSD'}
              </TitleText>
              
              {/* 标签区域 */}
              {stableDialogConfig.show_tags && renderTags(getTags(dataToUse))}
            </HeaderSection>

            {/* 信息内容区域 */}
            {stableDialogConfig.show_info_sections && (
              <InfoContent>
                {Object.values(infoData).map(section => renderInfoSection(section))}
              </InfoContent>
            )}
          </InfoContainer>
        </Box>

        {/* 底部按钮区域 */}
        {stableDialogConfig.show_buttons && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '0 24px 24px 24px',
              gap: '16px',
              marginTop: '-10px',
              // marginBottom: '-3px',
            }}
          >
            {typeof customButtonRenderer === 'function' ? (
              (() => {
                try {
                  const customButtons = customButtonRenderer(dataToUse, { onClose, onDownload });
                  return React.isValidElement(customButtons) ? customButtons : null;
                } catch (error) {
                  console.warn('Error in customButtonRenderer:', error);
                  return null;
                }
              })()
            ) : (
              <>
                {stableDialogConfig.show_close_button && (
                  <CancelButton
                    variant="outlined"
                    onClick={onClose}
                  >
                    {t('common.cancel')}
                  </CancelButton>
                )}
                {stableDialogConfig.show_download_button && (
                  <DownloadButton
                    variant="contained"
                    onClick={() => onDownload && dataToUse?.identifier && onDownload(dataToUse.identifier)}
                  >
                    {t('common.download')}
                  </DownloadButton>
                )}
                {stableDialogConfig.show_custom_buttons && Array.isArray(customButtons) && customButtons
                  .filter(button => button && typeof button === 'object')
                  .map((button, index) => (
                    <Button
                      key={index}
                      variant={button.variant || 'contained'}
                      onClick={() => button.onClick && button.onClick(dataToUse)}
                      sx={button.sx}
                    >
                      {t(button.label)}
                    </Button>
                  ))}
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailDialog;
