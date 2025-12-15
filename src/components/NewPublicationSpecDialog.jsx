import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef, useEffect } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import CookieService from '../utils/cookieService';
import { useBrand } from '../hooks/useBrand';
import fileApi from '../services/fileApi';

// 样式化组件
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '2px',
  padding: '24px',
  height: '100%',
  position: 'relative',
  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const HeaderSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '5px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '340px',
  position: 'absolute',
  left: '23px',
  top: '26px',
}));

const Title = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"OpenSans-SemiBold", sans-serif',
  fontSize: '22px',
  lineHeight: '140%',
  fontWeight: 600,
  marginLeft: '5px',
}));

const FormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '56px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  position: 'absolute',
  left: '30px',
  top: '100px',
}));

const FormColumn = styled(Box)(() => ({
  flexShrink: 0,
  width: '300px',
  position: 'relative',
}));

const FormField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '300px',
  marginBottom: '24px',
}));

const FieldTitle = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 600,
  marginBottom: '4px',
  position: 'relative',
  display: 'inline-block',
}));

const RequiredAsterisk = styled('span')(() => ({
  color: '#d32f2f',
  marginLeft: '2px',
  fontSize: '14px',
  fontWeight: 600,
}));

const UploadSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '114px',
  position: 'relative',
}));

const UploadContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '6px 4px 6px 8px',
  width: '110px',
  height: '110px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    borderColor: '#f16508',
  },
}));


const DescriptionSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '300px',
  marginTop: '28px',
}));

const DescriptionHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: '100%'
}));

const DescriptionTitle = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  fontWeight: 600,
}));

const CharacterLimit = styled(Typography)(() => ({
  color: '#ba1a1a',
  textAlign: 'left',
  fontFamily: '"Lato-Light", sans-serif',
  fontSize: '12px',
  fontWeight: 300,
  marginLeft: 'auto',
}));

const DescriptionTextArea = styled(TextField)(({ theme, hasError }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    minHeight: '100px',
    '& fieldset': {
      borderColor: hasError ? '#ba1a1a' : '#b3b3b3',
    },
    '&:hover fieldset': {
      borderColor: hasError ? '#ba1a1a' : '#b3b3b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: hasError ? '#ba1a1a' : (theme.palette.primary.main || '#f16508'),
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Roboto-Regular", sans-serif',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
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
  right: '48px',
  bottom: '20px',
}));

const CancelButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#e6e6e6',
  borderWidth: '1px',
  padding: '8px 24px',
  color: '#4d4d4d',
  textTransform: 'none',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 300,
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  minWidth: 'auto',
  width: 'auto',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    borderColor: '#e6e6e6',
  },
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  padding: '6px 24px',
  height: '32px',
  color: '#ffffff',
  textTransform: 'uppercase',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  fontWeight: 300,
  minWidth: 'auto',
  width: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark || '#d5570a',
  },
  '&:disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    cursor: 'not-allowed',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  height: '40px',
  fontSize: '14px',
  fontFamily: '"Roboto-Regular", sans-serif',
  '& .MuiSelect-select': {
    fontSize: '14px',
    fontFamily: '"Roboto-Regular", sans-serif',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main || '#f16508',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      borderColor: '#b3b3b3',
    },
    '&:hover fieldset': {
      borderColor: '#b3b3b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main || '#f16508',
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    borderColor: '#b3b3b3',
    height: '40px',
    '& fieldset': {
      borderColor: '#b3b3b3',
    },
    '&:hover fieldset': {
      borderColor: '#b3b3b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main || '#f16508',
    },
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    minHeight: '40px',
    height: 'auto',
    '& fieldset': {
      borderColor: '#b3b3b3',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#b3b3b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main || '#f16508',
    },
  },
  '& .MuiAutocomplete-inputRoot': {
    padding: '5px 14px !important',
    minHeight: '40px',
    height: 'auto',
    '&.MuiOutlinedInput-root': {
      padding: '5px 14px !important',
    },
    '& .MuiAutocomplete-input': {
      padding: '0px !important',
      fontSize: '14px',
      fontFamily: '"Roboto-Regular", sans-serif',
      color: '#4d4d4d',
      height: '20px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
    fontFamily: '"Roboto-Regular", sans-serif',
    color: '#4d4d4d',
    padding: '0px !important',
    height: '20px',
  },
  '& .MuiAutocomplete-clearIndicator': {
    display: 'none',
  },
  '& .MuiAutocomplete-tag': {
    height: '24px',
    fontSize: '12px',
    marginRight: '4px',
    backgroundColor: theme.palette.grey[200],
    border: `1px solid ${theme.palette.grey[400]}`,
    color: '#4d4d4d',
    fontFamily: '"Roboto-Regular", sans-serif',
    '& .MuiChip-deleteIcon': {
      fontSize: '16px',
      color: theme.palette.text.secondary,
      margin: '0 4px 0 -4px',
      '&:hover': {
        color: theme.palette.error.main,
        backgroundColor: 'transparent',
      },
    },
  },
}));

function NewPublicationDialog({ open, onClose, onConfirm, initialData }) {
  const { currentBrandCode } = useBrand();
  const userInfo = CookieService.getUserInfo();
  const tenantName = userInfo?.tenantName || userInfo?.tenant?.name || '';
  const currentTheme = currentBrandCode ? currentBrandCode.toUpperCase() : 'KENDO';

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    theme: currentTheme,
    usage: initialData?.usage || [],
    templateType: 'Tenant Specific',
    type: initialData?.type || '',
    tenant: tenantName,
    description: initialData?.description || '',
  });

  // 当 initialData 变化时更新表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        theme: currentTheme,
        usage: initialData.usage || [],
        templateType: 'Tenant Specific',
        type: initialData.type || '',
        tenant: tenantName,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        theme: currentTheme,
        usage: [],
        templateType: 'Tenant Specific',
        type: '',
        tenant: tenantName,
        description: '',
      });
    }
  }, [initialData, currentTheme, tenantName]);

  // 对话框关闭时重置文件状态
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImagePreview(null);
      setPdfFile(null);
      setIconFileId(null);
      setPdfFileId(null);
      setUploadingImage(false);
      setUploadingPdf(false);
    }
  }, [open]);

  const usageOptions = ['Internal', 'External'];
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
  // 上传文件状态
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [iconFileId, setIconFileId] = useState(null);
  const [pdfFileId, setPdfFileId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // 必填字段
  const [focusedRequiredField, setFocusedRequiredField] = useState(null);

  const isFieldEmpty = (fieldName) => {
    switch (fieldName) {
      case 'name':
        return !formData.name || formData.name.trim() === '';
      case 'tenant':
        return !formData.tenant || formData.tenant.trim() === '';
      case 'theme':
        return !formData.theme || formData.theme.trim() === '';
      case 'templateType':
        return !formData.templateType || formData.templateType.trim() === '';
      case 'usage':
        return !formData.usage || formData.usage.length === 0;
      case 'type':
        return !formData.type || formData.type.trim() === '';
      default:
        return false;
    }
  };

  const areAllRequiredFieldsFilled = () => {
    return (
      !isFieldEmpty('name') &&
      !isFieldEmpty('tenant') &&
      !isFieldEmpty('theme') &&
      !isFieldEmpty('templateType') &&
      !isFieldEmpty('usage') &&
      !isFieldEmpty('type')
    );
  };

  // 检查字段是否应该被禁用
  const isFieldDisabled = (fieldName) => {
    if (!focusedRequiredField) {
      return false;
    }
    if (focusedRequiredField === fieldName) {
      return false;
    }
    if (!isFieldEmpty(focusedRequiredField)) {
      return false;
    }
    // 其他情况禁用
    return true;
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    if (focusedRequiredField === field && event.target.value.trim() !== '') {
      setFocusedRequiredField(null);
    }
  };

  const handleUsageChange = (event, newValue) => {
    setFormData({
      ...formData,
      usage: newValue,
    });
    if (focusedRequiredField === 'usage' && newValue.length > 0) {
      setFocusedRequiredField(null);
    }
  };

  const handleFieldFocus = (fieldName) => {
    if (isFieldEmpty(fieldName)) {
      setFocusedRequiredField(fieldName);
    }
  };

  const handleFieldBlur = (fieldName) => {
    if (!isFieldEmpty(fieldName)) {
      setFocusedRequiredField(null);
    }
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handlePdfUpload = () => {
    pdfInputRef.current?.click();
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadingImage(true);
      
      // 创建图片预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      try {
        // 调用 uploadFile 接口上传文件
        const uploadResult = await fileApi.uploadFile(file);
        const fileId = uploadResult.fileId;
        if (fileId) {
          setIconFileId(fileId);
          console.log('Image uploaded successfully, fileId:', fileId);
        } else {
          console.warn('Upload response does not contain fileId:', uploadResult);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setImageFile(null);
        setImagePreview(null);
      } finally {
        setUploadingImage(false);
      }
    }
    // 这里可以再次选择同一个文件
    if (event.target) {
      event.target.value = '';
    }
  };

  const handlePdfFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setUploadingPdf(true);
      
      try {
        const uploadResult = await fileApi.uploadFile(file);
        const fileId = uploadResult.fileId;
        if (fileId) {
          setPdfFileId(fileId);
          console.log('PDF uploaded successfully, fileId:', fileId);
        } else {
          console.warn('Upload response does not contain fileId:', uploadResult);
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
        setPdfFile(null);
      } finally {
        setUploadingPdf(false);
      }
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleCancel = () => {
    // 重置表单
    setFormData({
      name: '',
      theme: currentTheme,
      usage: [],
      templateType: 'Tenant Specific',
      type: '',
      tenant: tenantName,
      description: '',
    });
    // 清理上传的文件和预览
    setImageFile(null);
    setImagePreview(null);
    setPdfFile(null);
    setIconFileId(null);
    setPdfFileId(null);
    setUploadingImage(false);
    setUploadingPdf(false);
    // 重置聚焦状态
    setFocusedRequiredField(null);
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        ...formData,
        imageFile,
        pdfFile,
        iconFileId,
        pdfFileId, 
      });
    }
    handleCancel();
  };

  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 150;

  const menuProps = {
    PaperProps: {
      sx: {
        '& .MuiMenuItem-root': {
          fontSize: '14px',
          fontFamily: '"Roboto-Regular", sans-serif',
        },
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '736px',
          height: '670px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <DialogContainer>
          {/* 标题区域 */}
          <HeaderSection>
            <img src="/assets/add_pub.png" alt="Add" style={{ width: 28, height: 28 }} />
            <Title>New Publication</Title>
          </HeaderSection>

          {/* 表单区域 */}
          <FormContainer>
            {/* 左侧表单 */}
            <FormColumn>
              <FormField sx={{ top: '0px' }}>
                <FieldTitle>Name<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <StyledTextField
                  fullWidth
                  placeholder="Please enter the template's name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onFocus={() => handleFieldFocus('name')}
                  onBlur={() => handleFieldBlur('name')}
                  disabled={isFieldDisabled('name')}
                  InputProps={{
                    sx: {
                      fontFamily: '"Roboto-Regular", sans-serif',
                      fontSize: '14px',
                      color: formData.name ? '#4d4d4d' : '#808080',
                    },
                  }}
                />
              </FormField>

              <FormField sx={{ top: '94px' }}>
                <FieldTitle>Theme<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <StyledTextField
                  fullWidth
                  value={currentTheme}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                      fontFamily: '"Roboto-Regular", sans-serif',
                      fontSize: '14px',
                      pointerEvents: 'none',
                      '& .MuiOutlinedInput-input': {
                        color: '#808080',
                        fontFamily: '"Roboto-Regular", sans-serif',
                        fontSize: '14px',
                        cursor: 'not-allowed',
                      },
                      '& fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                    },
                  }}
                />
              </FormField>

              <FormField sx={{ top: '188px' }}>
                <FieldTitle>Usage<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <StyledAutocomplete
                  fullWidth
                  multiple
                  disableClearable
                  disabled={isFieldDisabled('usage')}
                  options={usageOptions}
                  value={formData.usage}
                  onChange={handleUsageChange}
                  onFocus={() => handleFieldFocus('usage')}
                  onBlur={() => handleFieldBlur('usage')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder={formData.usage.length === 0 ? 'Select Usage' : ''}
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          '& input::placeholder': {
                            color: '#808080',
                            opacity: 1,
                            fontSize: '14px',
                            fontFamily: '"Roboto-Regular", sans-serif',
                          },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        deleteIcon={<CloseIcon />}
                        sx={(theme) => ({
                          height: '24px',
                          fontSize: '12px',
                          marginRight: '4px',
                          backgroundColor: theme.palette.grey[200],
                          border: `1px solid ${theme.palette.grey[400]}`,
                          color: '#4d4d4d',
                          fontFamily: '"Roboto-Regular", sans-serif',
                          '& .MuiChip-deleteIcon': {
                            fontSize: '16px',
                            color: theme.palette.text.secondary,
                            margin: '0 4px 0 -4px',
                            '&:hover': {
                              color: theme.palette.error.main,
                              backgroundColor: 'transparent',
                            },
                          },
                        })}
                      />
                    ))
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option}
                    </Box>
                  )}
                  PaperComponent={({ children, ...other }) => (
                    <Box
                      {...other}
                      sx={{
                        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
                        borderRadius: '4px',
                        marginTop: '4px',
                        backgroundColor: '#ffffff !important',
                        '& .MuiAutocomplete-listbox': {
                          backgroundColor: '#ffffff !important',
                          padding: 0,
                        },
                        '& .MuiAutocomplete-option': {
                          fontSize: '14px',
                          fontFamily: '"Roboto-Regular", sans-serif',
                          padding: '8px 16px',
                          minHeight: 'auto',
                          backgroundColor: '#ffffff !important',
                          opacity: '1 !important',
                          '&:hover': {
                            backgroundColor: '#f5f5f5 !important',
                            opacity: '1 !important',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#f5f5f5 !important',
                            opacity: '1 !important',
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: '#f5f5f5 !important',
                            opacity: '1 !important',
                            '&.Mui-focused': {
                              backgroundColor: '#eeeeee !important',
                              opacity: '1 !important',
                            },
                          },
                        },
                      }}
                    >
                      {children}
                    </Box>
                  )}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  filterOptions={(options) => {
                    // 只显示未选择的选项
                    return options.filter((option) => !formData.usage.includes(option));
                  }}
                />
              </FormField>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '42px',
                  position: 'absolute',
                  left: '0px',
                  top: '275px',
                }}
              >
                <UploadSection>
                  <FieldTitle sx={{ fontSize: '14px', marginBottom: '-1px',marginTop: '-4px' }}>Image</FieldTitle>
                  <UploadContainer onClick={handleImageUpload}>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                    />
                    {uploadingImage ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <CircularProgress size={30} />
                        <Typography
                          sx={{
                            color: '#4d4d4d',
                            fontFamily: '"Roboto-Regular", sans-serif',
                            fontSize: '12px',
                          }}
                        >
                          Uploading...
                        </Typography>
                      </Box>
                    ) : imagePreview ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ width: 50, height: 50, color: '#b3b3b3' }} />
                        <Typography
                          sx={{
                            color: '#b3b3b3',
                            fontFamily: '"Roboto-Medium", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            textTransform: 'uppercase',
                          }}
                        >
                          UPLOAD
                        </Typography>
                      </>
                    )}
                  </UploadContainer>
                </UploadSection>

                <UploadSection>
                  <FieldTitle sx={{ fontSize: '14px', marginBottom: '-1px',marginTop: '-4px' }}>PDF Example</FieldTitle>
                  <UploadContainer onClick={handlePdfUpload}>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      style={{ display: 'none' }}
                    />
                    {uploadingPdf ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <CircularProgress size={30} />
                        <Typography
                          sx={{
                            color: '#4d4d4d',
                            fontFamily: '"Roboto-Regular", sans-serif',
                            fontSize: '12px',
                          }}
                        >
                          Uploading...
                        </Typography>
                      </Box>
                    ) : pdfFile ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          gap: '4px',
                        }}
                      >
                        <CloudUploadIcon sx={{ width: 30, height: 30, color: '#b3b3b3' }} />
                        <Typography
                          sx={{
                            color: '#4d4d4d',
                            fontFamily: '"Roboto-Regular", sans-serif',
                            fontSize: '10px',
                            fontWeight: 400,
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {pdfFile.name}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ width: 50, height: 50, color: '#b3b3b3' }} />
                        <Typography
                          sx={{
                            color: '#b3b3b3',
                            fontFamily: '"Roboto-Medium", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            textTransform: 'uppercase',
                          }}
                        >
                          UPLOAD
                        </Typography>
                      </>
                    )}
                  </UploadContainer>
                </UploadSection>
              </Box>
            </FormColumn>

            {/* 右侧表单 */}
            <FormColumn>
              <FormField sx={{ top: '0px' }}>
                <FieldTitle>Tenant<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <StyledTextField
                  fullWidth
                  value={tenantName}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                      fontFamily: '"Roboto-Regular", sans-serif',
                      fontSize: '14px',
                      pointerEvents: 'none',
                      '& .MuiOutlinedInput-input': {
                        color: '#808080',
                        fontFamily: '"Roboto-Regular", sans-serif',
                        fontSize: '14px',
                        cursor: 'not-allowed',
                      },
                      '& fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                    },
                  }}
                />
              </FormField>

              <FormField sx={{ top: '94px' }}>
                <FieldTitle>Template Type<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <StyledTextField
                  fullWidth
                  value="Tenant Specific"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                      fontFamily: '"Roboto-Regular", sans-serif',
                      fontSize: '14px',
                      pointerEvents: 'none',
                      '& .MuiOutlinedInput-input': {
                        color: '#808080',
                        fontFamily: '"Roboto-Regular", sans-serif',
                        fontSize: '14px',
                        cursor: 'not-allowed',
                      },
                      '& fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#b3b3b3 !important',
                      },
                    },
                  }}
                />
              </FormField>

              <FormField sx={{ top: '188px' }}>
                <FieldTitle>Type<RequiredAsterisk>*</RequiredAsterisk></FieldTitle>
                <FormControl fullWidth>
                  <StyledSelect
                    value={formData.type}
                    onChange={handleInputChange('type')}
                    onFocus={() => handleFieldFocus('type')}
                    onBlur={() => handleFieldBlur('type')}
                    disabled={isFieldDisabled('type')}
                    displayEmpty
                    MenuProps={menuProps}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: '#808080' }}>Select Type</span>;
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="Catalog">Catalog</MenuItem>
                    <MenuItem value="Shelfcard">Shelfcard</MenuItem>
                    <MenuItem value="DataSheet">DataSheet</MenuItem>
                    <MenuItem value="Flyer">Flyer</MenuItem>
                  </StyledSelect>
                </FormControl>
              </FormField>

              <DescriptionSection>
                <DescriptionHeader>
                  <DescriptionTitle>Description</DescriptionTitle>
                  {descriptionLength > maxDescriptionLength && (
                    <>
                      <WarningIcon sx={{ color: '#ba1a1a', width: 20, height: 20 }} />
                      <CharacterLimit>Only 150 characters</CharacterLimit>
                    </>
                  )}
                </DescriptionHeader>
                <DescriptionTextArea
                  multiline
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  helperText={`${descriptionLength}/${maxDescriptionLength}`}
                  hasError={descriptionLength > maxDescriptionLength}
                  FormHelperTextProps={{
                    sx: {
                      color: descriptionLength > maxDescriptionLength ? '#ba1a1a' : '#4d4d4d',
                      fontSize: '12px',
                    },
                  }}
                />
              </DescriptionSection>
            </FormColumn>
          </FormContainer>

          {/* 底部按钮 */}
          <ButtonContainer>
            <CancelButton onClick={handleCancel}>CANCEL</CancelButton>
            <ConfirmButton onClick={handleConfirm} disabled={!areAllRequiredFieldsFilled()}>CONFIRM</ConfirmButton>
          </ButtonContainer>
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
}

export default NewPublicationDialog;

