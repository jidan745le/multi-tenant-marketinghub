import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import setUpSheetApi from '../services/setUpSheetApi';
import fileApi from '../services/fileApi';
import CookieService from '../utils/cookieService';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '2px',
  padding: '24px',
  height: '898px',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '5px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  marginBottom: '40px',
}));

const Title = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"OpenSans-SemiBold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 600,
  flex: 1,
}));

const CloseButton = styled(IconButton)(() => ({
  padding: 0,
  width: '16px',
  height: '16px',
  color: '#000000',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const ChannelGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '13px',
  padding: '0 13px',
  overflowY: 'auto',
  maxHeight: '750px',
  position: 'relative',
  scrollbarWidth: 'thin',
  scrollbarColor: '#e0e0e0 transparent',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e0e0e0',
    borderRadius: '12px',
  },
}));

const ChannelCard = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '1.6px',
  width: '100%',
  aspectRatio: '189 / 221',
  minHeight: '150px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}));

const ChannelLogo = styled('img')(() => ({
  width: '69%',
  maxWidth: '131px',
  height: 'auto',
  aspectRatio: '131 / 33',
  objectFit: 'contain',
  margin: '50px auto 0',
  display: 'block',
}));

const ChannelRegion = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '120%',
  fontWeight: 400,
  position: 'absolute',
  left: '10px',
  bottom: '66px',
}));

const ChannelName = styled(Typography)(() => ({
  color: '#212121',
  textAlign: 'left',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  fontWeight: 600,
  position: 'absolute',
  left: '10px',
  bottom: '41px',
  right: '10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  position: 'absolute',
  left: '10px',
  right: '10px',
  bottom: '10px',
}));

const PreviewButton = styled(Button)(({ theme }) => ({
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  borderWidth: '0.8px',
  padding: '0.4em 0.75em',
  color: theme.palette.primary.main,
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: 'clamp(9px, 1.5vw, 11.2px)',
  lineHeight: '1.2',
  fontWeight: 400,
  textTransform: 'none',
  boxShadow: '0px 0.8px 0.8px 0px rgba(0, 0, 0, 0.05)',
  minWidth: '0',
  flex: '1 1 0',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '14',
    borderColor: theme.palette.primary.main,
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));

const SelectButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  borderWidth: '0.8px',
  padding: '0.4em 0.75em',
  color: '#ffffff',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: 'clamp(9px, 1.5vw, 11.2px)',
  lineHeight: '1.2',
  fontWeight: 400,
  textTransform: 'none',
  boxShadow: '0px 0.8px 0.8px 0px rgba(0, 0, 0, 0.05)',
  minWidth: '0',
  flex: '1 1 0',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
  },
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '69%',
  maxWidth: '131px',
  height: 'auto',
  aspectRatio: '131 / 33',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  border: `1px dashed ${theme.palette.grey[400]}`,
  margin: '50px auto 0',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `
      linear-gradient(0deg, transparent 24%, ${theme.palette.grey[300]} 25%, ${theme.palette.grey[300]} 26%, transparent 27%, transparent 74%, ${theme.palette.grey[300]} 75%, ${theme.palette.grey[300]} 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, ${theme.palette.grey[300]} 25%, ${theme.palette.grey[300]} 26%, transparent 27%, transparent 74%, ${theme.palette.grey[300]} 75%, ${theme.palette.grey[300]} 76%, transparent 77%, transparent)
    `,
    backgroundSize: '20px 20px',
    opacity: 0.3,
  },
}));

// 带认证的图片组件
const AuthenticatedImage = ({ src, alt, channelId, onLoadImage, blobUrl, sx }) => {
  const [imageSrc, setImageSrc] = useState(blobUrl || src);
  const [loading, setLoading] = useState(!blobUrl);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (blobUrl) {
      setImageSrc(blobUrl);
      setLoading(false);
      setError(false);
    } else if (src) {
      setImageSrc(src);
    }
  }, [blobUrl, src]);

  useEffect(() => {
    if (!blobUrl && src) {
      setLoading(true);
      setError(false);
      onLoadImage(src, channelId).then(url => {
        if (url) {
          setImageSrc(url);
        } else {
          setError(true);
        }
        setLoading(false);
      }).catch(() => {
        setError(true);
        setLoading(false);
      });
    }
  }, [src, channelId, blobUrl, onLoadImage]);

  if (error || loading) {
    return <ImagePlaceholder />;
  }

  return (
    <Box
      component="img"
      src={imageSrc}
      alt={alt}
      onError={() => {
        console.error('图片加载失败:', src, 'channelId:', channelId);
        setError(true);
      }}
      onLoad={() => {
        console.log('图片加载成功:', src, 'channelId:', channelId);
      }}
      sx={sx}
    />
  );
};

const SelectChannel = ({ open, onClose, onSelect }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingChannelId, setDownloadingChannelId] = useState(null);
  const [imageBlobUrls, setImageBlobUrls] = useState(new Map());
  const imageBlobUrlsRef = useRef(new Map());

  // 加载带认证的图片
  const loadAuthenticatedImage = useCallback(async (imageUrl, channelId) => {
    try {
      const token = CookieService.getToken();
      if (!token) {
        console.error('No authentication token available');
        return null;
      }

      // 避免重复请求
      if (imageBlobUrlsRef.current.has(channelId)) {
        return imageBlobUrlsRef.current.get(channelId);
      }

      const headers = fileApi.getHeaders(false);

      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: Token may be expired or invalid');
        }
        throw new Error(`Failed to load image: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      imageBlobUrlsRef.current.set(channelId, blobUrl);
      setImageBlobUrls(new Map(imageBlobUrlsRef.current));
      
      return blobUrl;
    } catch (error) {
      console.error('Error loading authenticated image:', error);
      return null;
    }
  }, []);

  // 清理 blob URLs
  useEffect(() => {
    const ref = imageBlobUrlsRef.current;
    return () => {
      ref.forEach(url => URL.revokeObjectURL(url));
      ref.clear();
    };
  }, []);

  // 从 API 获取数据
  useEffect(() => {
    const fetchChannels = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        const apiData = await setUpSheetApi.getAllChannel();
      
        const globalChannels = (Array.isArray(apiData) ? apiData : []).filter(
          channel => channel.templateType === 'Global'
        );
        
        // 转换数据格式
        const transformedChannels = globalChannels.map((channel) => ({
          id: channel.id,
          tenant: channel.tenant || '-',
          theme: channel.theme || '-',
          name: channel.name || '-',
          iconId: channel.iconId || null,
          description: channel.description || '-',
          icon: channel.iconId ? `/srv/v1.0/main/files/${channel.iconId}` : null,
          templates: channel.templates || [], // 保存 templates 信息
        }));
        
        setChannels(transformedChannels);
      } catch (error) {
        console.error('failed to get channels', error);
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [open]);

  const handlePreview = async (channel) => {
    try {
      // 设置下载状态
      setDownloadingChannelId(channel.id);
      
      // 获取该 channel 的第一个 template
      const templates = channel.templates || [];
      
      if (templates.length === 0) {
        console.warn(`Channel "${channel.name}" has no templates`);
        setDownloadingChannelId(null);
        return;
      }
      
      const firstTemplate = templates[0];
      const fileId = firstTemplate.fileId;
      
      if (!fileId) {
        console.warn(`Template "${firstTemplate.name}" has no fileId`);
        setDownloadingChannelId(null);
        return;
      }
      
      console.log('Downloading template file:', { 
        channelName: channel.name, 
        templateName: firstTemplate.name, 
        fileId 
      });
      
      // 下载文件
      const blob = await fileApi.downloadFile(fileId);
      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const fileName = firstTemplate.name 
        ? `${firstTemplate.name}.xlsx` 
        : `template_${fileId}.xlsx`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理 blob URL
      URL.revokeObjectURL(blobUrl);
      
      console.log('Template file downloaded successfully');
    } catch (error) {
      console.error('Error downloading template file:', error);
    } finally {
      // 清除下载状态
      setDownloadingChannelId(null);
    }
  };

  const handleSelect = (channel) => {
    if (onSelect) {
      onSelect(channel);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '650px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <DialogContainer>
          {/* Header */}
          <HeaderContainer>
            <img 
              src="/assets/channel.png" 
              alt="Select Channel" 
              style={{ width: '28.8px', height: '28.8px' }} 
            />
            <Title>Select Channel</Title>
            <CloseButton onClick={onClose}>
              <CloseIcon sx={{ width: '16px', height: '16px' }} />
            </CloseButton>
          </HeaderContainer>

          {/* Channel Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <ChannelGrid>
              {channels.length === 0 ? (
                <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                  <Typography>No channels available</Typography>
                </Box>
              ) : (
                channels.map((channel) => (
                  <ChannelCard key={channel.id}>
                    {channel.icon ? (
                      <AuthenticatedImage
                        src={channel.icon}
                        alt={channel.name}
                        channelId={channel.id}
                        onLoadImage={loadAuthenticatedImage}
                        blobUrl={imageBlobUrls.get(channel.id)}
                        sx={{
                          width: '69%',
                          maxWidth: '131px',
                          height: 'auto',
                          aspectRatio: '131 / 33',
                          objectFit: 'contain',
                          margin: '50px auto 0',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                    <ChannelName>{channel.name}</ChannelName>
                    <ButtonContainer>
                      <PreviewButton 
                        onClick={() => handlePreview(channel)}
                        disabled={downloadingChannelId === channel.id}
                      >
                        {downloadingChannelId === channel.id ? (
                          <CircularProgress size={14} sx={{ color: 'inherit' }} />
                        ) : (
                          'PREVIEW'
                        )}
                      </PreviewButton>
                      <SelectButton onClick={() => handleSelect(channel)}>
                        SELECT
                      </SelectButton>
                    </ButtonContainer>
                  </ChannelCard>
                ))
              )}
            </ChannelGrid>
          )}
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SelectChannel;

