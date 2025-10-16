import React, { useState, useEffect, useCallback } from 'react';
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
// import { axiosExt } from 'src/utils/axios'; // 暂时用mock数据

const VideoPlayerContainer = styled(Box)({
  width: 320,
  height: 310,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  position: 'relative',
  marginLeft: 24,
  marginTop: -16
});

const VideoPlayer = styled('video')({
  objectFit: 'contain',
  width: '100%',
  maxHeight: '100%'
});


const InfoContainer = styled(Box)({
  flex: '0 1 450px',
  maxWidth: 455,
  boxSizing: 'border-box',
  padding: '2px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column'
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
  minWidth: '80px',
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
  marginBottom: '-8px',
  display: 'flex',
  gap: '24px',
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
  fontWeight: 700,
  marginBottom: '12px',
  fontFamily: '"Open Sans", sans-serif',
  lineHeight: '140%',
  letterSpacing: '0.34px',
  color: '#000000'
});

const InfoList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const InfoItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  fontSize: '10px',
  lineHeight: '14px'
});

const InfoLabel = styled(Typography)({
  fontSize: '10px',
  fontWeight: 400,
  minWidth: '120px',
  color: '#000000',
  fontFamily: '"Open Sans", sans-serif'
});

const InfoValue = styled(Typography)({
  fontSize: '10px',
  flex: 1,
  textAlign: 'right',
  wordBreak: 'break-word',
  color: '#000000',
  fontFamily: '"Open Sans", sans-serif'
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

const VideoDetailModal = ({
  open,
  onClose,
  mediaData, 
  onDownload
}) => {
  const { t } = useTranslation();
  const [mediaUrl, setMediaUrl] = useState(''); 
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [technicalData, setTechnicalData] = useState([]);

  // 看下什么媒体类型
  const detectMediaType = (data) => {
    if (!data) return 'video';
    const filename = data.filename || data.name || '';
    const extension = filename.toLowerCase().split('.').pop();
    
    // 视频：暂时的
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
    if (videoExtensions.includes(extension)) {
      return 'video';
    }
    
    // 图片：暂时的
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'psd'];
    if (imageExtensions.includes(extension)) {
      return 'image';
    }
    
    // 其他字段：暂时的
    if (data.format) {
      const format = data.format.toLowerCase();
      if (format.includes('video') || format.includes('mp4') || format.includes('avi')) {
        return 'video';
      }
      if (format.includes('image') || format.includes('jpg') || format.includes('png')) {
        return 'image';
      }
    }
    
    if (data.type) {
      const type = data.type.toLowerCase();
      if (type.includes('video')) {
        return 'video';
      }
      if (type.includes('image') || type.includes('photo')) {
        return 'image';
      }
    }
    
    return 'video';
  };

  // 标签
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <TagsContainer>
        {tags.map((tag, index) => (
          <TagChip 
            key={index}
            label={tag}
            variant="outlined"
          />
        ))}
      </TagsContainer>
    );
  };

  // 信息项
  const renderInfoItem = (label, value) => {
    const isApprovalStatus = label === 'Approval Status';
    const isPublished = value && value.includes('Published');
    
    return (
      <InfoItem key={label}>
        <InfoLabel>{label}</InfoLabel>
        <InfoValue 
          sx={isApprovalStatus && isPublished ? { color: '#6eb82a' } : {}}
        >
          {value || '-'}
        </InfoValue>
      </InfoItem>
    );
  };

  // 信息区块
  const renderInfoSection = (title, data) => (
    <InfoSection key={title}>
      <SectionTitle>{title}</SectionTitle>
      <InfoList>
        {data?.map((item) => renderInfoItem(item.label, item.value))}
      </InfoList>
    </InfoSection>
  );

  // mock数据
  const transferBaseInfoData = (data) => {
    const templateData = [
      { label: 'Model Number', value: data.customerModelNumber || data.modelNumber || '--' },
      { label: 'Image Type', value: data.customerImageType || 'Main' },
      { label: 'Lock Date', value: data.lockDate || '2025-01-01' },
      { label: 'Country Restrictions', value: data.customerRestricted?.join(', ') || 'None' },
      { label: 'Usage Rights', value: data.customerUsageRights || 'External Image' },
      { label: 'Approval Status', value: data.customerApprovalStatus || '• Published' }
    ];
    return templateData;
  };

  const transferTechnicalData = (data) => {
    const templateData = [
      { label: 'Color Space', value: data.colorSpace || 'RGB' },
      { label: 'Color Profile', value: data.colorProfile || 'SRGB' },
      { label: 'Resolution', value: data.resolution || '300 Dpi' },
      { label: 'Dimensions', value: data.dimensions || '17.14 X 13.65' },
      { label: 'Size', value: data.size || '150 Kb' },
      { label: 'Created On', value: data.creationDate || '2025-01-01' },
      { label: 'Change Date', value: data.lastModified || '2025-01-01' }
    ];
    return templateData;
  };

  // 获取标签数据
  const getTags = (data) => {
    const keywords = data.customerKeywords || '';
    if (keywords) {
      return keywords.split(/[,;\s]+/).filter(keyword => keyword.trim() !== '').slice(0, 4);
    }
    // mock数据标签
    return ['TOOL CABINET', 'TOOL CABINET', 'TOOL CABINET', 'TOOL CABINET'];
  };

  // 获取媒体URL (支持视频和图片)
  const fetchMediaUrl = useCallback(async (data) => {
    if (!data) return;
    
    setIsMediaLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 智能检测媒体类型
      const mediaType = detectMediaType(data);
      
      // Mock媒体数据
      const mockMediaUrls = {
        video: {
          'video-123': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          '2900_Multicutter_2014_30sec_test': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'default': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
        },
        image: {
          'image-123': 'https://picsum.photos/800/600?random=1',
          '2900_Multicutter_2014_30sec_test': 'https://picsum.photos/800/600?random=2',
          'default': 'https://picsum.photos/800/600?random=3'
        }
      };
      
      const identifier = data.identifier || data.name || 'default';
      const mockUrl = mockMediaUrls[mediaType]?.[identifier] || mockMediaUrls[mediaType]?.['default'];
      setMediaUrl(mockUrl);
    } catch (error) {
      console.error('Error fetching media URL:', error);
    } finally {
      setIsMediaLoading(false);
    }
  }, []);



  // 当数据变化时更新信息
  useEffect(() => {
    if (mediaData && open) {
      fetchMediaUrl(mediaData);

      // 基础信息
      const baseInfo = transferBaseInfoData(mediaData);
      setBaseInfoData(baseInfo);

      // 技术信息
      const technical = transferTechnicalData(mediaData);
      setTechnicalData(technical);
    }
  }, [mediaData, open, fetchMediaUrl]);

  useEffect(() => {
    if (!open) {
      setMediaUrl('');
      setBaseInfoData([]);
      setTechnicalData([]);
      setIsMediaLoading(false);
    }
  }, [open]);

  if (!mediaData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          maxWidth: '800px',
          minHeight: '320px'
        }
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          maxWidth: '800px',
          padding: 0,
          '&.MuiDialogContent-root': {
            padding: 0
          }
        }}
      >
        {/* 顶部标题区域 */}
        <ModalHeader
          sx={{
            padding: '24px 24px 0 24px',
            marginBottom: '0'
          }}
        >
          <DetailsTitle>
            <DetailsIcon />
            <DetailsText>{t('pdp.details')}</DetailsText>
          </DetailsTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {/* 主要内容区域 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            marginTop: '20px'
          }}
        >
          {/* 左侧区域 */}
          <VideoPlayerContainer>
            {isMediaLoading ? (
              <CircularProgress size={40} />
            ) : mediaUrl ? (
              detectMediaType(mediaData) === 'video' ? (
                <VideoPlayer
                  controls
                  src={mediaUrl}
                  preload="metadata"
                />
              ) : (
                <Box
                  component="img"
                  src={mediaUrl}
                  alt={mediaData.filename || mediaData.name || 'Media'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
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
          <InfoContainer>
            <HeaderSection>
              <TitleText>
                {mediaData.filename || mediaData.name || 'SNT2125AP_SNT2120AP_EGO_SNOW-BLOWE-AUGER-PADDLE-ROTATION_22-0214_ON-WHITE.PSD'}
              </TitleText>
              
              {/* 标签区域 */}
              {renderTags(getTags(mediaData))}
            </HeaderSection>

            {/* 信息内容区域 */}
            <InfoContent>
              {renderInfoSection('Basic Info', baseInfoData)}
              {renderInfoSection('Technical', technicalData)}
            </InfoContent>
          </InfoContainer>
        </Box>

        {/* 底部按钮区域 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 24px 24px 24px',
            gap: '16px'
          }}
        >
          <CancelButton
            variant="outlined"
            onClick={onClose}
          >
            {t('common.cancel')}
          </CancelButton>
          <DownloadButton
            variant="contained"
            onClick={() => onDownload && mediaData?.identifier && onDownload(mediaData.identifier)}
          >
            {t('common.download')}
          </DownloadButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDetailModal;
