import React, { useState, useEffect } from 'react';
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
// import { axiosExt } from 'src/utils/axios'; // 已移除，使用mock数据
// import BaseInfo from '../ProductDetail/BaseInfo'; // 已集成到组件内部
// import Technical from '../ProductDetail/Technical'; // 已集成到组件内部

const VideoPlayerContainer = styled(Box)({
  width: 420,
  height: 420,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
  position: 'relative'
});

const VideoPlayer = styled('video')({
  objectFit: 'contain',
  width: '100%',
  maxHeight: '100%'
});

const TitleWrapper = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '18px',
  color: theme.palette.primary.main
}));

const InfoContainer = styled(Box)({
  flex: 1,
  boxSizing: 'border-box',
  padding: '0 24px'
});

const InfoContent = styled(Box)({
  display: 'flex',
  height: 'calc(100% - 85px)',
  gap: '24px',
  maxHeight: '600px',
  overflow: 'auto',
  justifyContent: 'space-between'
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end'
});

const DownloadButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  alignSelf: 'flex-end',
  borderRadius: '2px',
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const VideoDetailModal = ({
  open,
  onClose,
  videoData,
  onDownload,
  showRawContentButton = false,
  onRawContentClick
}) => {
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [baseInfoData, setBaseInfoData] = useState([]);
  const [technicalData, setTechnicalData] = useState([]);

  // 集成 BaseInfo 组件功能
  const renderKeywords = (keywordsString) => {
    if (!keywordsString) return null;
    
    // Split by comma, semicolon, or space
    const keywords = keywordsString.split(/[,;\s]+/).filter(keyword => keyword.trim() !== '');
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, padding: '0px' }}>
        {keywords.map((keyword, index) => (
          <Chip 
            key={index}
            label={keyword.trim()}
            size="small"
            sx={{ 
              fontSize: '10px',
              padding: '0px',
              border: `1px solid #1976d2`, // 使用固定颜色，避免theme依赖
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}
          />
        ))}
      </Box>
    );
  };

  // 渲染基础信息组件
  const renderBaseInfo = (data) => (
    <div>
      <h4 style={{
        fontSize: '12px',
        margin: '32px 0 8px 0'
      }}>{t('Basic Info')}</h4>
      <ol style={{
        fontSize: '10px',
        padding: 0,
        margin: 0
      }}>
        {data?.map((item) =>
          <li style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            key={item.label}
          >
            <p style={{
              width: 120,
              marginTop: 0,
              marginBottom: 8
            }}>
              {item.label}
            </p>
            <div style={{
              flex: 1,
              marginTop: 0,
              marginBottom: 8
            }}>
              {item.label === 'Keywords' ? renderKeywords(item.value) : item.value}
            </div>
          </li>)
        }
      </ol>
    </div>
  );

  // 渲染技术信息组件
  const renderTechnical = (data) => (
    <div>
      <h4 style={{
        fontSize: '12px',
        margin: '32px 0 8px 0'
      }}>{t('Technical')}</h4>
      <ol style={{
        fontSize: '10px',
        padding: 0,
        margin: 0
      }}>
        {data?.map((item) =>
          <li style={{
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: 200
            }}
            key={item.label}
          >
            <p style={{
              width: 120,
              marginTop: 0,
              marginBottom: 8
            }}>
              {item.label}
            </p>
            <p style={{
              flex: 1,
              marginTop: 0,
            }}>
              {item.value}
            </p>
          </li>)
        }
      </ol>
    </div>
  );

  // 转换基础信息数据
  const transferBaseInfoData = (data) => {
    const templateData = [
      { label: 'Image type', value: data.customerImageType || 'Video' },
      { label: 'Model Number', value: data.customerModelNumber || data.modelNumber || '' },
      { label: 'Keywords', value: data.customerKeywords || '' },
      { label: 'Languages', value: data.language || '' },
      { label: 'Channel', value: data.customerChannel?.join() || '' },
      { label: 'Approval status', value: data.customerApprovalStatus || '' },
      { label: 'Usage rights', value: data.customerUsageRights || '' },
      { label: 'Restricted to countries', value: data.customerRestricted?.join() || '' },
      { label: 'Lock Date', value: data.lockDate || '' }
    ];
    return templateData;
  };

  // 转换技术信息数据
  const transferTechnicalData = (data) => {
    const templateData = [
      { label: 'Color space', value: data.colorSpace || '' },
      { label: 'Color profile', value: data.colorProfile || '' },
      { label: 'Resolution[dpi]', value: data.resolution || '0' },
      { label: 'DImensions', value: data.dimensions || '' },
      { label: 'Size [Bytes]', value: data.size || '' },
      { label: 'Created On', value: data.creationDate || '' },
      { label: 'Change Date', value: data.lastModified || '' }
    ];
    return templateData;
  };

  // 获取视频URL (使用mock数据)
  const fetchVideoUrl = async (identifier) => {
    if (!identifier) return;
    
    setIsVideoLoading(true);
    try {
      // Mock数据：模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock视频URL数据
      const mockVideoUrls = {
        'video-123': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        '2900_Multicutter_2014_30sec_test': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'default': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
      };
      
      const mockUrl = mockVideoUrls[identifier] || mockVideoUrls['default'];
      setVideoUrl(mockUrl);
    } catch (error) {
      console.error('Error fetching video URL:', error);
    } finally {
      setIsVideoLoading(false);
    }
  };

  // 处理下载
  const handleDownload = () => {
    if (onDownload && videoData?.identifier) {
      onDownload(videoData.identifier);
    }
  };

  // 处理原始内容访问
  const handleRawContentClick = () => {
    if (onRawContentClick && videoData?.identifier) {
      onRawContentClick(videoData.identifier);
    }
  };

  // 当视频数据变化时更新信息
  useEffect(() => {
    if (videoData && open) {
      // 获取视频URL
      fetchVideoUrl(videoData.identifier);

      // 处理基础信息
      const baseInfo = transferBaseInfoData(videoData);
      const baseInfoWithT = baseInfo.map((item) => ({
        ...item,
        label: t(item.label)
      }));
      setBaseInfoData(baseInfoWithT);

      // 处理技术信息
      const technical = transferTechnicalData(videoData);
      const technicalWithT = technical.map((item) => ({
        ...item,
        label: t(item.label)
      }));
      setTechnicalData(technicalWithT);
    }
  }, [videoData, open, t]);

  // 重置状态当弹框关闭时
  useEffect(() => {
    if (!open) {
      setVideoUrl('');
      setBaseInfoData([]);
      setTechnicalData([]);
      setIsVideoLoading(false);
    }
  }, [open]);

  if (!videoData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          maxWidth: '1050px',
          minHeight: '500px'
        }
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          borderRadius: 0,
          maxWidth: '1050px',
          alignItems: 'center',
          padding: 0,
          '&.MuiDialogContent-root': {
            padding: 0
          }
        }}
      >
        {/* 左侧视频播放器区域 */}
        <VideoPlayerContainer>
          {isVideoLoading ? (
            <CircularProgress size={40} />
          ) : videoUrl ? (
            <VideoPlayer
              controls
              src={videoUrl}
              preload="metadata"
            />
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
                {t('video.loading')}
              </Typography>
            </Box>
          )}
        </VideoPlayerContainer>

        {/* 右侧信息面板 */}
        <InfoContainer>
          {/* 标题区域 */}
          <TitleWrapper>
            {videoData.customerImageType || 'Video'}
          </TitleWrapper>
          
          <Typography 
            variant="h4" 
            sx={{
              marginTop: '8px',
              fontSize: '18px',
              lineHeight: '24px',
              fontWeight: 'bold'
            }}
          >
            {videoData.filename || videoData.name || 'Unknown Video'}
          </Typography>

          {/* 信息内容区域 */}
          <InfoContent>
            {renderBaseInfo(baseInfoData)}
            {renderTechnical(technicalData)}
          </InfoContent>

          {/* 按钮区域 */}
          <ButtonContainer>
            {showRawContentButton && (
              <Button
                variant="outlined"
                onClick={handleRawContentClick}
                sx={{
                  borderRadius: '2px',
                  marginRight: '16px'
                }}
              >
                {t('product.detail.raw')}
              </Button>
            )}
            <DownloadButton
              variant="contained"
              onClick={handleDownload}
            >
              {t('DOWNLOAD')}
            </DownloadButton>
          </ButtonContainer>
        </InfoContainer>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDetailModal;
