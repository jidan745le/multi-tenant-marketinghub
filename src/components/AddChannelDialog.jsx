import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SelectChannel from './SelectChannel';
import fileApi from '../services/fileApi';
import CookieService from '../utils/cookieService';
import setUpSheetApi from '../services/setUpSheetApi';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '2px',
  padding: '24px',
  height: '630px',
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

const RadioButtonGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginBottom: '24px',
}));

const RadioButton = styled(FormControlLabel)(({ selected, disabled, theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: disabled ? '#a0a0a0' : (selected ? (theme.palette.primary.main || '#f16508') : '#e6e6e6'),
  borderWidth: '1px',
  padding: '6px 16px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '205px',
  minHeight: '60px',
  margin: 0,
  backgroundColor: disabled ? '#f5f5f5' : (selected ? 'rgba(141, 77, 45, 0.08)' : 'transparent'),
  opacity: disabled ? 0.6 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
  pointerEvents: disabled ? 'none' : 'auto',
  '& .MuiFormControlLabel-label': {
    color: disabled ? '#808080' : '#4d4d4d',
    fontFamily: '"OpenSans-SemiBold", sans-serif',
    fontSize: '17px',
    fontWeight: 600,
    marginLeft: '0px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

const FormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconUploadSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconLabel = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  marginBottom: '8px',
  position: 'relative',
  display: 'inline-block',
}));

const RequiredStar = styled('span')(() => ({
  color: '#d32f2f',
  fontSize: '14px',
  fontWeight: 400,
  marginLeft: '4px',
  position: 'relative',
  top: '-2px',
}));

const IconUploadContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconPreviewBox = styled(Box)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#dbdbdb',
  borderWidth: '1px',
  padding: '6px 4px 6px 8px',
  width: '110px',
  height: '110px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const UploadButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '111.32px',
  height: '110px',
}));

const UploadButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#dbdbdb',
  borderWidth: '1px',
  padding: '6px 4px 6px 8px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'none',
  color: '#bdbdbd',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: '#999999',
  },
}));

const FormField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const FieldLabel = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  position: 'relative',
  display: 'inline-block',
}));

const StyledTextField = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    borderColor: '#dbdbdb',
    fontFamily: '"OpenSans-Regular", sans-serif',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#dbdbdb',
    },
    '&:hover fieldset': {
      borderColor: '#999999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dbdbdb',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"OpenSans-Regular", sans-serif',
    fontSize: '14px',
    color: '#4d4d4d',
  },
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'absolute',
  right: '24px',
  bottom: '24px',
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#eb6100',
  borderWidth: '1px',
  padding: '8px 16px',
  color: theme.palette.primary.main || '#eb6100',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'uppercase',
  background: '#ffffff',
  '&:hover': {
    borderColor: theme.palette.primary.main || '#eb6100',
    backgroundColor: `${theme.palette.primary.main}12`,
  },
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#eb6100',
  borderRadius: '4px',
  padding: '6px 16px',
  color: '#ffffff',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  fontWeight: 400,
  textTransform: 'uppercase',
  height: '32px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main || '#eb6100',
    opacity: 0.9,
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

const AddChannelDialog = ({ open, onClose, onSave, editData, copyData }) => {
  const [channelType, setChannelType] = useState('Custom'); // 'Custom' or 'Channel'
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFileId, setIconFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectChannelOpen, setSelectChannelOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [internalEditData, setInternalEditData] = useState(null);
  const [iconBlobUrl, setIconBlobUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // 加载带认证的图片
  const loadAuthenticatedImage = useCallback(async (imageUrl) => {
    try {
      const token = CookieService.getToken();
      if (!token) {
        console.error('No authentication token available');
        return null;
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
      
      return blobUrl;
    } catch (error) {
      console.error('Error loading authenticated image:', error);
      return null;
    }
  }, []);

  // 清理 blob URL
  useEffect(() => {
    return () => {
      if (iconBlobUrl) {
        URL.revokeObjectURL(iconBlobUrl);
      }
    };
  }, [iconBlobUrl]);

  useEffect(() => {
    const loadEditIcon = async () => {
      if (open && editData) {
        // 编辑模式
        setInternalEditData(editData);
        setName(editData.name || '');
        setDescription(editData.description || '');
        setIconFileId(editData.iconId || null);
        setSelectedFile(null);
        setChannelType('Custom');
        
        // 加载图标预览（如果需要认证）
        if (editData.icon) {
          if (editData.icon.startsWith('/srv/v1.0/main/files/')) {
            // 需要认证的URL
            const blobUrl = await loadAuthenticatedImage(editData.icon);
            if (blobUrl) {
              setIconBlobUrl(blobUrl);
              setIconPreview(blobUrl);
            } else {
              setIconPreview(null);
            }
          } else {
            // 不需要认证的URL（如blob URL）
            setIconPreview(editData.icon);
          }
        } else {
          setIconPreview(null);
        }
      } else if (open && copyData) {
        // 复制模式
        setInternalEditData(null);
        setName(copyData.name ? `${copyData.name} (copy)` : '');
        setDescription(copyData.description || '');
        setIconFileId(copyData.iconId || null);
        setSelectedFile(null);
        if (copyData.type === 'Channel') {
          setChannelType('Channel');
        } else {
          setChannelType('Custom');
        }
        
        // 加载图标预览（如果需要认证）
        if (copyData.icon) {
          if (copyData.icon.startsWith('/srv/v1.0/main/files/')) {
            // 需要认证的URL
            const blobUrl = await loadAuthenticatedImage(copyData.icon);
            if (blobUrl) {
              setIconBlobUrl(blobUrl);
              setIconPreview(blobUrl);
            } else {
              setIconPreview(null);
            }
          } else {
            // 不需要认证的URL（如blob URL）
            setIconPreview(copyData.icon);
          }
        } else {
          setIconPreview(null);
        }
      } else if (open && !editData && !copyData) {
        setInternalEditData(null);
        setChannelType('Custom');
        setName('');
        setDescription('');
        setIconPreview(null);
        setIconFileId(null);
        setSelectedFile(null);
        setIconBlobUrl(null);
      }
    };
    
    loadEditIcon();
  }, [open, editData, copyData, loadAuthenticatedImage]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        // 清理blob URL
        if (iconBlobUrl) {
          URL.revokeObjectURL(iconBlobUrl);
          setIconBlobUrl(null);
        }
        setInternalEditData(null);
        setChannelType('Custom');
        setName('');
        setDescription('');
        setIconPreview(null);
        setIconFileId(null);
        setSelectedFile(null);
      }, 300); //防止关闭时提前置空
      return () => clearTimeout(timer);
    } else {
      // 当对话框打开时，重置 snackbar 状态
      setSnackbar({ open: false, message: '', severity: 'error' });
    }
  }, [open, iconBlobUrl]);

  const handleTypeChange = (event) => {
    setChannelType(event.target.value);
  };

  const handleSelectChannelClick = () => {
    setSelectChannelOpen(true);
  };

  const handleChannelSelect = async (channel) => {
    if (channel.name) {
      setName(channel.name);
    }
    if (channel.description) {
      setDescription(channel.description);
    } else if (channel.theme) {
      setDescription(`${channel.theme} - ${channel.name}`);
    }
    
    // 设置iconFileId以便后续保存时使用
    if (channel.iconId) {
      setIconFileId(channel.iconId);
      
      // 如果有icon URL，使用带认证的方式加载图片
      const imageUrl = channel.icon || `/srv/v1.0/main/files/${channel.iconId}`;
      if (imageUrl && imageUrl.startsWith('/srv/v1.0/main/files/')) {
        // 需要认证的URL，使用带认证的方式加载
        const blobUrl = await loadAuthenticatedImage(imageUrl);
        if (blobUrl) {
          setIconBlobUrl(blobUrl);
          setIconPreview(blobUrl);
        } else {
          setIconPreview(null);
        }
      } else {
        // 不需要认证的URL（如blob URL或data URL）
        setIconPreview(imageUrl);
      }
    } else {
      setIconPreview(null);
    }
    
    setSelectChannelOpen(false);
  };

  const handleCancel = () => {
    // 清理blob URL
    if (iconBlobUrl) {
      URL.revokeObjectURL(iconBlobUrl);
      setIconBlobUrl(null);
    }
    // 重置表单
    setChannelType('Custom');
    setName('');
    setDescription('');
    setIconPreview(null);
    setIconFileId(null);
    setSelectedFile(null);
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!name.trim()) {
      setSnackbar({
        open: true,
        message: 'Channel name is required',
        severity: 'error',
      });
      return;
    }

    // 检查Icon是否已填写
    const isIconFilled = iconPreview || iconFileId;
    if (!isIconFilled) {
      setSnackbar({
        open: true,
        message: 'Channel icon is required',
        severity: 'error',
      });
      return;
    }

    try {
      setUploading(true);
      let finalIconId = iconFileId;

      // 如果有新选择的文件，先上传
      if (selectedFile) {
        const uploadResult = await fileApi.uploadFile(selectedFile);
        if (uploadResult && uploadResult.id) {
          finalIconId = uploadResult.id;
        } else if (uploadResult && uploadResult.fileId) {
          finalIconId = uploadResult.fileId;
        }
      }

      // 复制模式这块换id的逻辑
      if (!finalIconId && copyData && copyData.iconId) {
        finalIconId = copyData.iconId;
      }

      if (internalEditData && internalEditData.id) {
        // 编辑的话调用 updateChannel API
        const channelUsage = internalEditData.usage || [];
        const channelUsageString = Array.isArray(channelUsage) 
          ? channelUsage.join(',') 
          : (typeof channelUsage === 'string' ? channelUsage : '');
        
        const newIconId = finalIconId || internalEditData.iconId;
        
        await setUpSheetApi.updateChannel({
          id: internalEditData.id,
          name: name.trim(),
          description: description || '',
          iconId: newIconId,
          channelUsage: channelUsageString,
          templateType: internalEditData.templateType || 'Global',
        });
        
        setSnackbar({
          open: true,
          message: `Channel "${name}" has been updated successfully.`,
          severity: 'success',
        });
      } else {
        // 新增模式或复制模式：调用 createChannel API
        // 根据 channelType 设置 templateType：Custom 对应 Specific，Channel 对应 Global
        const templateType = channelType === 'Custom' ? 'Specific' : 'Global';
        
        // 复制模式：使用 copyData 中的 usage，如果没有则为空数组
        let usage = [];
        if (copyData && copyData.usage) {
          // 如果 copyData 有 usage，使用它
          usage = Array.isArray(copyData.usage) ? copyData.usage : [];
        }
        
        await setUpSheetApi.createChannel({
          name: name.trim(),
          description: description || '',
          iconId: finalIconId || null,
          usage: usage,
          templateType: templateType,
        });
        
        setSnackbar({
          open: true,
          message: `Channel "${name}" has been created successfully.`,
          severity: 'success',
        });
      }

      if (onSave) {
        await onSave(null);
      }

      setTimeout(() => {
        handleCancel();
      }, 500);
    } catch (error) {
      console.error('failed to save channel', error);
      
      // 提取需要显示的错误消息
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
        console.error('Error parsing error message:', parseError);
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUploadIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '450px',
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
            <img src="/assets/channel.png" alt="Channel" style={{ width: 28, height: 28 }} />
            <Title>{internalEditData ? 'Edit Channel' : 'Add Channel'}</Title>
            <CloseButton onClick={handleCancel}>
              <CloseIcon sx={{ width: '16px', height: '16px' }} />
            </CloseButton>
          </HeaderContainer>

          {/* Radio Button Group */}
          <RadioButtonGroup>
              <RadioButton
                control={
                  <Radio
                    checked={channelType === 'Custom'}
                    onChange={handleTypeChange}
                    value="Custom"
                    sx={{ display: 'none' }}
                    disabled={!!internalEditData}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, gap: '1px', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={(theme) => ({
                          width: '20px',
                          height: '20px',
                          maskImage: `url(/assets/X.png)`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          backgroundColor: internalEditData ? '#808080' : (theme.palette.primary.main || '#f16508'),
                        })}
                      />
                      <span style={{ color: internalEditData ? '#808080' : '#4d4d4d' }}>Custom</span>
                    </Box>
                  </Box>
                }
                selected={channelType === 'Custom'}
                disabled={!!internalEditData}
                onClick={() => {
                  if (!internalEditData) {
                    setChannelType('Custom');
                  }
                }}
              />
              <RadioButton
                control={
                  <Radio
                    checked={channelType === 'Channel'}
                    onChange={handleTypeChange}
                    value="Channel"
                    sx={{ display: 'none' }}
                    disabled={!!internalEditData}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, gap: '1px', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Box
                        sx={(theme) => ({
                          width: '20px',
                          height: '20px',
                          maskImage: `url(/assets/global.png)`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          backgroundColor: internalEditData ? '#808080' : (theme.palette.primary.main || '#f16508'),
                        })}
                      />
                      <span style={{ color: internalEditData ? '#808080' : '#4d4d4d' }}>Channel</span>
                    </Box>
                    {/* Channel Selection Hint */}
                    {channelType === 'Channel' && !internalEditData && (
                      <Typography
                        onClick={handleSelectChannelClick}
                        sx={(theme) => ({
                          color: theme.palette.primary.main || '#f16508',
                          fontFamily: '"OpenSans-Regular", sans-serif',
                          fontSize: '10px',
                          fontWeight: 400,
                          lineHeight: '1.2',
                          marginLeft: '30px',
                          marginTop: '0px',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        })}
                      >
                        Click to Select Channel
                      </Typography>
                    )}
                  </Box>
                }
                selected={channelType === 'Channel'}
                disabled={!!internalEditData}
                onClick={() => {
                  if (!internalEditData) {
                    setChannelType('Channel');
                  }
                }}
              />
          </RadioButtonGroup>

          {/* Form Container */}
          <FormContainer>
            {/* Icon Upload Section */}
            <IconUploadSection>
              <IconLabel>
                Icon
                <RequiredStar>*</RequiredStar>
              </IconLabel>
              <IconUploadContainer>
                <IconPreviewBox onClick={handleUploadIcon}>
                  {iconPreview ? (
                    <img 
                      src={iconPreview} 
                      alt="Icon preview"
                      onError={() => {
                        console.error('icon preview error:', iconPreview);
                        // 如果加载失败，清除预览
                        setIconPreview(null);
                        setIconBlobUrl(null);
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CloudUploadIcon sx={{ width: '50px', height: '50px', color: '#bdbdbd', marginBottom: '8px' }} />
                    <Typography sx={{ color: '#bdbdbd', fontSize: '14px', fontWeight: 500 }}>
                      UPLOAD
                    </Typography>
                    </Box>
                  )}
                </IconPreviewBox>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </IconUploadContainer>
            </IconUploadSection>

            {/* Name Field */}
            <FormField>
              <FieldLabel>
                Name
                <RequiredStar>*</RequiredStar>
              </FieldLabel>
              <StyledTextField
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                  },
                }}
              />
            </FormField>

            {/* Description Field */}
            <FormField>
              <FieldLabel>Description</FieldLabel>
              <StyledTextField
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '91px',
                  },
                }}
              />
            </FormField>
          </FormContainer>

          {/* Buttons */}
          <ButtonContainer>
            <CancelButton onClick={handleCancel}>
              CANCEL
            </CancelButton>
            <ConfirmButton 
              onClick={handleConfirm} 
              disabled={uploading || !name.trim() || (!iconPreview && !iconFileId)}
            >
              {uploading ? 'UPLOADING...' : 'CONFIRM'}
            </ConfirmButton>
          </ButtonContainer>
        </DialogContainer>
      </DialogContent>

      {/* Select Channel Dialog */}
      <SelectChannel
        open={selectChannelOpen}
        onClose={() => setSelectChannelOpen(false)}
        onSelect={handleChannelSelect}
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
    </Dialog>
  );
};

export default AddChannelDialog;

