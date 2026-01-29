import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AddTemplateDialog from '../components/AddTemplateDialog';
import AddChannelDialog from '../components/AddChannelDialog';
import setUpSheetApi from '../services/setUpSheetApi';
import fileApi from '../services/fileApi';
import CookieService from '../utils/cookieService';
import { CircularProgress } from '@mui/material';

// Styled components
const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
}));

const Title = styled(Typography)(() => ({
  color: '#212121',
  textAlign: 'left',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 600,
  position: 'relative',
}));

const AddChannelButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#eb6100',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '1px',
  padding: '6px 16px',
  color: '#ffffff',
  fontFamily: '"Lato-Medium", sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  fontWeight: 500,
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    opacity: 0.9,
  },
}));

const TableWrapper = styled(Box)(() => ({
  flex: 1,
  overflow: 'hidden',
  paddingTop: 0,
  minHeight: 0,
}));

const MainTableContainer = styled(TableContainer)(({ theme }) => ({
  height: '100%',
  overflowX: 'auto',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[200],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.grey[500],
    },
  },
}));

const TableHeader = styled(TableCell)(() => ({
  backgroundColor: '#fafafa',
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '0px 0px 1px 0px',
  padding: '16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  height: '72px',
}));

const TableRowStyled = styled(TableRow)(() => ({
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '0px 0px 1px 0px',
  height: '72px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
}));

const TableCellStyled = styled(TableCell)(() => ({
  padding: '16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  verticalAlign: 'middle',
}));

const ChannelNameCell = styled(TableCell)(() => ({
  padding: '16px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
  color: '#212121',
  verticalAlign: 'middle',
}));

const ChannelNameContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '18px',
}));

const ExpandIcon = styled(Box)(() => ({
  width: '22px',
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
}));

const IconContainer = styled(Box)(() => ({
  borderStyle: 'solid',
  borderColor: '#bdbdbd',
  borderWidth: '1.2px',
  width: '38.4px',
  height: '38.4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const ChannelNameText = styled(Typography)(() => ({
  color: '#212121',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 700,
  flex: 1,
}));

const FileNameText = styled(Typography)(() => ({
  color: '#212121',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 400,
}));

const OperationHeader = styled(TableHeader)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: '#fafafa',
  borderStyle: 'solid',
  borderLeftColor: theme.palette.primary.main || '#eb6100',
  borderBottomColor: '#e0e0e0',
  borderTopColor: 'transparent',
  borderRightColor: 'transparent',
  borderWidth: '0px 0px 1px 1px',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontWeight: 600,
  zIndex: 10,
}));

const OperationCell = styled(TableCellStyled)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  borderStyle: 'solid',
  borderLeftColor: theme.palette.primary.main || '#eb6100',
  borderBottomColor: '#e0e0e0',
  borderTopColor: 'transparent',
  borderRightColor: 'transparent',
  borderWidth: '0px 0px 1px 1px',
  zIndex: 9,
}));

const OperationContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '6px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '1px',
  padding: '7px 12px',
  minWidth: '80px',
  height: '35px',
  color: theme.palette.primary.main || '#eb6100',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '14px',
  lineHeight: '143%',
  letterSpacing: '0.17px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main || '#eb6100',
    backgroundColor: `${theme.palette.primary.main}12`,
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  padding: 0,
  width: '24px',
  height: '24px',
  color: 'inherit',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  margin: '0 2px',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'transparent',
    '& .material-symbols-outlined': {
      color: theme.palette.primary.main,
    },
  },
}));

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '38.4px',
  height: '38.4px',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  border: `1px dashed ${theme.palette.grey[400]}`,
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


// 转换 API 数据为组件需要的格式
const transformApiData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((channel) => {
    // 转换 templates
    const templates = (channel.templates || []).map((template) => {
      const mappingsCount = template.templateDataDetails?.length || 0;
      return {
        id: template.id,
        name: template.name || '-',
        theme: template.theme || '-',
        type: template.templateType || 'Line',
        tenant: template.tenant || '-',
        mappings: mappingsCount > 0 ? `${mappingsCount} mapping${mappingsCount > 1 ? 's' : ''}` : '0 mappings',
        file: template.fileId ? `/srv/v1.0/main/files/${template.fileId}` : '-',
        fileName: template.fileId ? `Template_${template.id}` : '-',
        description: template.description || '-',
        templateDataDetails: template.templateDataDetails || [],
        fileId: template.fileId || null,
      };
    });

    return {
      id: channel.id,
      isChannel: true,
      name: channel.name || '-',
      icon: channel.iconId ? `/srv/v1.0/main/files/${channel.iconId}` : null,
      iconId: channel.iconId || null,
      theme: channel.theme || '-',
      type: 'Channel',
      tenant: channel.tenant || '-',
      mappings: '-',
      description: channel.description || '-',
      expanded: false, // 默认折叠
      templates: templates,
      channelTypeId: channel.channelTypeId,
      usage: channel.usage,
      templateType: channel.templateType,
    };
  });
};

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

function ChannelManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addTemplateDialogOpen, setAddTemplateDialogOpen] = useState(false);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);
  const [copyingChannel, setCopyingChannel] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [copyingTemplate, setCopyingTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [imageBlobUrls, setImageBlobUrls] = useState(new Map());
  const imageBlobUrlsRef = useRef(new Map());
  const [defaultTemplateId, setDefaultTemplateId] = useState(() => {
    // 从 localStorage 读取默认 template id
    const stored = localStorage.getItem('setupSheetGeneralDefaultTemplateId');
    return stored ? parseInt(stored, 10) : null;
  });

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

      const headers = fileApi.getHeaders(false); // false 表示不包含 Content-Type（这个是用于文件下载的）

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

  // 清掉 blob URLs
  useEffect(() => {
    const ref = imageBlobUrlsRef.current;
    return () => {
      ref.forEach(url => URL.revokeObjectURL(url));
      ref.clear();
    };
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const apiData = await setUpSheetApi.getChannels();
        const filteredData = Array.isArray(apiData) 
          ? apiData.filter(channel => channel.templateType === 'Specific')
          : [];
        const transformedData = transformApiData(filteredData);
        setData(transformedData);
      } catch (error) {
        console.error('Failed to get channel data:', error);
        setSnackbar({
          open: true,
          message: `Failed to get data: ${error.message}`,
          severity: 'error',
        });
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleToggleExpand = (id) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleAddChannel = () => {
    setEditingChannel(null);
    setCopyingChannel(null);
    setAddChannelDialogOpen(true);
  };

  const handleCloseAddChannelDialog = () => {
    setAddChannelDialogOpen(false);
    setEditingChannel(null);
    setCopyingChannel(null);
  };

  const handleSaveChannel = async (formData) => {
    try {
      if (formData === null) {
        // 刷新数据
        const apiData = await setUpSheetApi.getChannels();
        const filteredData = Array.isArray(apiData) 
          ? apiData.filter(channel => channel.templateType === 'Specific')
          : [];
        const transformedData = transformApiData(filteredData);
        setData(transformedData);
        return;
      }

      if (editingChannel) {
        // 编辑的话调用 updateChannel API
        const channelUsage = editingChannel.usage || [];
        const channelUsageString = Array.isArray(channelUsage) 
          ? channelUsage.join(',') 
          : (typeof channelUsage === 'string' ? channelUsage : '');
        
        const newIconId = formData.iconId || editingChannel.iconId;
        const iconChanged = newIconId !== editingChannel.iconId;
        
        await setUpSheetApi.updateChannel({
          id: editingChannel.id,
          name: formData.name,
          description: formData.description || '',
          iconId: newIconId,
          channelUsage: channelUsageString,
          templateType: editingChannel.templateType || 'Global',
        });
        
        // 如果图标改变了，清除图片缓存
        if (iconChanged) {
          const oldBlobUrl = imageBlobUrlsRef.current.get(editingChannel.id);
          if (oldBlobUrl) {
            URL.revokeObjectURL(oldBlobUrl);
          }
          imageBlobUrlsRef.current.delete(editingChannel.id);
          setImageBlobUrls(new Map(imageBlobUrlsRef.current));
        }
        
        setSnackbar({
          open: true,
          message: `Channel "${formData.name}" has been updated successfully.`,
          severity: 'success',
        });
      } else {
        // 根据 channelType 设置 templateType：Custom 对应 Global，Channel 对应 Specific
        const templateType = formData.type === 'Channel' ? 'Specific' : 'Global';
        const usage = formData.usage || [];
        
        await setUpSheetApi.createChannel({
          name: formData.name,
          description: formData.description || '',
          iconId: formData.iconId || null,
          usage: usage.length > 0 ? usage : ['internal', 'external'], // 默认值
          templateType: templateType,
        });
        
        setSnackbar({
          open: true,
          message: `Channel "${formData.name}" has been created successfully.`,
          severity: 'success',
        });
      }
      
      // 刷新数据
      const apiData = await setUpSheetApi.getChannels();
      // 过滤只显示 templateType 为 "Specific" 的渠道
      const filteredData = Array.isArray(apiData) 
        ? apiData.filter(channel => channel.templateType === 'Specific')
        : [];
      const transformedData = transformApiData(filteredData);
      setData(transformedData);
      
      handleCloseAddChannelDialog();
    } catch (error) {
      console.error('Failed to save channel:', error);
      
      let errorMessage = error.message || 'Failed to save channel';
      
      try {
        if (errorMessage.includes('{') && errorMessage.includes('errorMessage')) {
          const startIndex = errorMessage.indexOf('{');
          const lastIndex = errorMessage.lastIndexOf('}');
          if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
            const jsonStr = errorMessage.substring(startIndex, lastIndex + 1);
            const errorObj = JSON.parse(jsonStr);
            if (errorObj.errorMessage) {
              let coreMessage = errorObj.errorMessage;
              const prefixes = [
                'Error saving Channel entity: ',
                'Error saving Template entity: ',
                'Error: ',
              ];
              for (const prefix of prefixes) {
                if (coreMessage.startsWith(prefix)) {
                  coreMessage = coreMessage.substring(prefix.length);
                  break;
                }
              }
              if (coreMessage.includes(':') && !coreMessage.startsWith('Channel with name')) {
                const colonIndex = coreMessage.indexOf(':');
                if (colonIndex > 0 && colonIndex < 50) {
                  coreMessage = coreMessage.substring(colonIndex + 1).trim();
                }
              }
              errorMessage = coreMessage;
            }
          }
        }
      } catch (parseError) {
        // 如果解析失败，使用原始错误消息
        console.error('Error parsing error message:', parseError);
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleAddTemplate = (channelId) => {
    setCurrentChannelId(channelId);
    setEditingTemplate(null);
    setCopyingTemplate(null);
    setAddTemplateDialogOpen(true);
  };

  const handleCloseAddTemplateDialog = () => {
    setAddTemplateDialogOpen(false);
    setCurrentChannelId(null);
    setEditingTemplate(null);
    setCopyingTemplate(null);
  };

  const handleSaveTemplate = async (formData) => {
    try {
      const expandedChannelIds = data
        .filter(item => item.isChannel && item.expanded)
        .map(item => item.id);
      
      if (formData === null) {
        // 刷新数据
        const apiData = await setUpSheetApi.getChannels();
        const filteredData = Array.isArray(apiData) 
          ? apiData.filter(channel => channel.templateType === 'Specific')
          : [];
        const transformedData = transformApiData(filteredData);
        
        // 恢复之前展开的channel状态
        const dataWithExpandedState = transformedData.map(item => {
          if (item.isChannel && expandedChannelIds.includes(item.id)) {
            return { ...item, expanded: true };
          }
          return item;
        });
        
        setData(dataWithExpandedState);
        return;
      }

      if (editingTemplate) {
        await setUpSheetApi.updateTemplate({
          id: editingTemplate.id,
          channelId: currentChannelId,
          name: formData.templateLabel,
          description: formData.description || '',
          templateType: formData.templateType || 'Line',
          templateDataDetails: formData.templateDataDetails || [],
          fileId: formData.fileId || editingTemplate.fileId || null,
        });
        
        setSnackbar({
          open: true,
          message: `Template "${formData.templateLabel}" has been updated successfully.`,
          severity: 'success',
        });
      } else {
        await setUpSheetApi.createTemplate({
          channelId: currentChannelId,
          name: formData.templateLabel,
          description: formData.description || '',
          templateType: formData.templateType || 'Flat',
          templateDataDetails: formData.templateDataDetails || [],
          fileId: formData.fileId || null,
        });
        
        setSnackbar({
          open: true,
          message: `Template "${formData.templateLabel}" has been created successfully.`,
          severity: 'success',
        });
      }
      
      // 刷新数据
      const apiData = await setUpSheetApi.getChannels();
      // 过滤只显示 templateType 为 "Specific" 的渠道
      const filteredData = Array.isArray(apiData) 
        ? apiData.filter(channel => channel.templateType === 'Specific')
        : [];
      const transformedData = transformApiData(filteredData);
      const dataWithExpandedState = transformedData.map(item => {
        if (item.isChannel && expandedChannelIds.includes(item.id)) {
          return { ...item, expanded: true };
        }
        return item;
      });
      
      setData(dataWithExpandedState);
      
      handleCloseAddTemplateDialog();
    } catch (error) {
      console.error('保存模板失败:', error);
      setSnackbar({
        open: true,
        message: `保存失败: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleEdit = (id) => {
    // 先查找是否是 channel
    const channel = data.find(item => item.id === id && item.isChannel);
    if (channel) {
      setEditingChannel(channel);
      setAddChannelDialogOpen(true);
      return;
    }
    
    // 如果不是 channel，查找是否是 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          setEditingTemplate({
            ...template,
            channelId: channelItem.id,
            channelName: channelItem.name,
          });
          setCurrentChannelId(channelItem.id);
          setAddTemplateDialogOpen(true);
          return;
        }
      }
    }
  };

  const handleCopy = (id) => {
    // 先查找是否是 channel
    const channel = data.find(item => item.id === id && item.isChannel);
    if (channel) {
      setCopyingChannel(channel);
      setEditingChannel(null);
      setAddChannelDialogOpen(true);
      return;
    }
    
    // 如果不是 channel，查找是否是 template
    for (const channelItem of data) {
      if (channelItem.templates) {
        const template = channelItem.templates.find(t => t.id === id);
        if (template) {
          setCopyingTemplate({
            ...template,
            channelId: channelItem.id,
            channelName: channelItem.name,
            // 确保 templateDataDetails 被包含在复制数据中
            templateDataDetails: template.templateDataDetails || [],
            // 确保 fileId 被包含在复制数据中
            fileId: template.fileId || null,
            file: template.file || null,
          });
          setEditingTemplate(null);
          setCurrentChannelId(channelItem.id);
          setAddTemplateDialogOpen(true);
          return;
        }
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const channel = data.find(item => item.id === id && item.isChannel);
      if (channel) {
        if (channel.templates && channel.templates.length > 0) {
          setSnackbar({
            open: true,
            message: `Channel "${channel.name}" is being used and cannot be deleted.`,
            severity: 'error',
          });
          return;
        } else {
          await setUpSheetApi.deleteChannel(id);
          
          // 清除图片缓存
          const oldBlobUrl = imageBlobUrlsRef.current.get(id);
          if (oldBlobUrl) {
            URL.revokeObjectURL(oldBlobUrl);
          }
          imageBlobUrlsRef.current.delete(id);
          setImageBlobUrls(new Map(imageBlobUrlsRef.current));
          
          // 刷新数据
          const apiData = await setUpSheetApi.getChannels();
          const filteredData = Array.isArray(apiData) 
            ? apiData.filter(channel => channel.templateType === 'Specific')
            : [];
          const transformedData = transformApiData(filteredData);
          setData(transformedData);
          
          setSnackbar({
            open: true,
            message: `Channel "${channel.name}" has been deleted successfully.`,
            severity: 'success',
          });
        }
      } else {
        for (const channelItem of data) {
          if (channelItem.templates) {
            const template = channelItem.templates.find(t => t.id === id);
            if (template) {
              const expandedChannelIds = data
                .filter(item => item.isChannel && item.expanded)
                .map(item => item.id);
              
              await setUpSheetApi.deleteTemplate(id);
              
              const apiData = await setUpSheetApi.getChannels();
              // 过滤只显示 templateType 为 "Specific" 的渠道
              const filteredData = Array.isArray(apiData) 
                ? apiData.filter(channel => channel.templateType === 'Specific')
                : [];
              const transformedData = transformApiData(filteredData);
              
              const dataWithExpandedState = transformedData.map(item => {
                if (item.isChannel && expandedChannelIds.includes(item.id)) {
                  return { ...item, expanded: true };
                }
                return item;
              });
              
              setData(dataWithExpandedState);
              
              setSnackbar({
                open: true,
                message: `Template "${template.name}" has been deleted successfully.`,
                severity: 'success',
              });
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 处理 default
  const handleDefaultChange = (templateId, checked) => {
    if (checked) {
      setDefaultTemplateId(templateId);
      localStorage.setItem('setupSheetGeneralDefaultTemplateId', templateId.toString());
      setSnackbar({
        open: true,
        message: `Template has been set as default for Setup Sheet (General).`,
        severity: 'success',
      });
    } else {
      // 取消选中
      setDefaultTemplateId(null);
      localStorage.removeItem('setupSheetGeneralDefaultTemplateId');
      setSnackbar({
        open: true,
        message: `Default template for Setup Sheet (General) has been cleared.`,
        severity: 'success',
      });
    }
  };

  const handleDownload = async (id) => {
    for (const channelItem of data) {
      if (!channelItem.templates) continue;
      const template = channelItem.templates.find(t => t.id === id);
      if (!template) continue;

      if (!template.fileId || template.file === '-') {
        setSnackbar({
          open: true,
          message: `Template "${template.name}" has no file to download.`,
          severity: 'error',
        });
        return;
      }

      const safeName = (template.name || template.fileName || `Template_${template.id}`)
        .replace(/[/\\:*?"<>|]/g, '_')
        .trim() || `Template_${template.id}`;
      const downloadFileName = safeName.endsWith('.xlsx') ? safeName : `${safeName}.xlsx`;

      try {
        // 使用 fileApi 下载接口
        const blob = await fileApi.downloadFile(template.fileId, '/srv/v1.0/main/files');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = downloadFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        setSnackbar({
          open: true,
          message: `Downloading template file: ${downloadFileName}`,
          severity: 'success',
        });
      } catch (error) {
        console.error('Failed to download template file:', error);
        setSnackbar({
          open: true,
          message: error?.message || `Failed to download template file: ${template.name}`,
          severity: 'error',
        });
      }
      return;
    }
  };

  return (
    <Box sx={{ backgroundColor: 'grey.200', height: '85vh', paddingTop: 6, paddingLeft: 5, paddingRight: 5, paddingBottom: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ backgroundColor: 'background.paper', padding: 3, boxShadow: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <HeaderContainer>
          <Title>Channel Managment</Title>
          <AddChannelButton onClick={handleAddChannel}>
            ADD CHANNEL
          </AddChannelButton>
        </HeaderContainer>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableWrapper>
          <MainTableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableHeader sx={{ width: '310px', minWidth: '310px' }}>
                    Channel Name/ Template Label
                  </TableHeader>
                  <TableHeader sx={{ width: '184px', minWidth: '184px' }}>
                    Theme
                  </TableHeader>
                  <TableHeader sx={{ width: '169px', minWidth: '169px' }}>
                    Type
                  </TableHeader>
                  <TableHeader sx={{ width: '160px', minWidth: '160px' }}>
                    Tenant
                  </TableHeader>
                  <TableHeader sx={{ width: '198px', minWidth: '198px' }}>
                    Mappings
                  </TableHeader>
                  <TableHeader sx={{ width: '310px', minWidth: '310px' }}>
                    File
                  </TableHeader>
                  <TableHeader sx={{ width: '120px', minWidth: '120px' }}>
                    Default
                  </TableHeader>
                  <TableHeader sx={{ width: '200px', minWidth: '200px' }}>
                    Description
                  </TableHeader>
                  <OperationHeader sx={{ width: '90px', minWidth: '60px' }}>
                    Operation
                  </OperationHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => {
                  let currentIndex = rowIndex;
                  return (
                    <React.Fragment key={row.id}>
                      <TableRowStyled 
                        sx={{ 
                          backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                        }}
                      >
                        <ChannelNameCell sx={{ width: '310px' }}>
                          <ChannelNameContainer>
                            <ExpandIcon onClick={() => handleToggleExpand(row.id)}>
                              <Box
                                component="img"
                                src={row.expanded ? '/assets/minimize_24px.svg' : '/assets/add_24pxsvg.svg'}
                                alt={row.expanded ? 'Collapse' : 'Expand'}
                              />
                            </ExpandIcon>
                            {row.icon ? (
                              <IconContainer>
                                <AuthenticatedImage
                                  src={row.icon}
                                  alt={row.name}
                                  channelId={row.id}
                                  onLoadImage={loadAuthenticatedImage}
                                  blobUrl={imageBlobUrls.get(row.id)}
                                  sx={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                  }}
                                />
                              </IconContainer>
                            ) : (
                              <ImagePlaceholder />
                            )}
                            <ChannelNameText>{row.name}</ChannelNameText>
                          </ChannelNameContainer>
                        </ChannelNameCell>
                        <TableCellStyled sx={{ width: '184px' }}>
                          {row.theme}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '169px' }}>
                          {row.type}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '160px' }}>
                          {row.tenant}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '198px' }}>
                          {row.mappings}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '310px' }}>
                          {row.file || '-'}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '120px' }}>
                          {/* Channel 行不显示复选框 */}
                        </TableCellStyled>
                        <TableCellStyled sx={{ width: '200px' }}>
                          {row.description || '-'}
                        </TableCellStyled>
                        <OperationCell 
                          sx={{ 
                            backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                          }}
                        >
                          <OperationContent>
                            <IconGroup>
                              <ActionIconButton onClick={() => handleEdit(row.id)}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                  edit
                                </span>
                              </ActionIconButton>
                              <ActionIconButton onClick={() => handleCopy(row.id)}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                  content_copy
                                </span>
                              </ActionIconButton>
                              <ActionIconButton onClick={() => handleDelete(row.id)}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                  delete
                                </span>
                              </ActionIconButton>
                            </IconGroup>
                            <ActionButton onClick={() => handleAddTemplate(row.id)}>
                              + ADD
                            </ActionButton>
                          </OperationContent>
                        </OperationCell>
                      </TableRowStyled>
                      {row.expanded && row.templates && row.templates.map((template) => {
                        currentIndex++;
                        return (
                          <TableRowStyled 
                            key={template.id} 
                            sx={{ 
                              backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                            }}
                          >
                            <TableCellStyled sx={{ width: '310px', paddingLeft: '96px' }}>
                              <FileNameText>{template.name}</FileNameText>
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '184px' }}>
                              {template.theme}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '169px' }}>
                              {template.type}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '160px' }}>
                              {template.tenant}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '198px' }}>
                              {template.mappings}
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '310px' }}>
                              <FileNameText>{template.file}</FileNameText>
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '120px' }}>
                              <Checkbox
                                checked={defaultTemplateId === template.id}
                                onChange={(e) => handleDefaultChange(template.id, e.target.checked)}
                                sx={{
                                  padding: '4px',
                                  '&.Mui-checked': {
                                    color: (theme) => theme.palette.primary.main,
                                  },
                                }}
                              />
                            </TableCellStyled>
                            <TableCellStyled sx={{ width: '200px' }}>
                              <FileNameText>{template.description || '-'}</FileNameText>
                            </TableCellStyled>
                            <OperationCell 
                              sx={{ 
                                backgroundColor: currentIndex % 2 === 0 ? '#ffffff' : '#fafafa' 
                              }}
                            >
                              <OperationContent>
                                <IconGroup>
                                  <ActionIconButton onClick={() => handleEdit(template.id)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                      edit
                                    </span>
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleCopy(template.id)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                      content_copy
                                    </span>
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleDownload(template.id)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                      download
                                    </span>
                                  </ActionIconButton>
                                  <ActionIconButton onClick={() => handleDelete(template.id)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                      delete
                                    </span>
                                  </ActionIconButton>
                                </IconGroup>
                              </OperationContent>
                            </OperationCell>
                          </TableRowStyled>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </MainTableContainer>
        </TableWrapper>
        )}
      </Paper>

      {/* Add Template Dialog */}
      <AddTemplateDialog
        open={addTemplateDialogOpen}
        onClose={handleCloseAddTemplateDialog}
        onSave={handleSaveTemplate}
        channelId={currentChannelId}
        editData={editingTemplate}
        copyData={copyingTemplate}
        channels={data.filter(item => item.isChannel)}
      />

      {/* Add Channel Dialog */}
      <AddChannelDialog
        open={addChannelDialogOpen}
        onClose={handleCloseAddChannelDialog}
        onSave={handleSaveChannel}
        editData={editingChannel}
        copyData={copyingChannel}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={(theme) => ({
            backgroundColor: snackbar.severity === 'success' 
              ? theme.palette.primary.main 
              : undefined,
            '&.MuiAlert-filledSuccess': {
              backgroundColor: theme.palette.primary.main,
            },
            '&.MuiAlert-filledError': {
              backgroundColor: theme.palette.error.main,
            }
          })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ChannelManagement;

