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
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import NumberInputField from './NumberInputField';
import setUpSheetApi from '../services/setUpSheetApi';
import fileApi from '../services/fileApi';
import CookieService from '../utils/cookieService';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  minHeight: '750px',
  position: 'relative',
  overflow: 'visible',
  padding: '24px',
  boxSizing: 'border-box',
}));

const Title = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 700,
  marginBottom: '40px',
}));

const Label = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  marginBottom: '10px',
  position: 'relative',
  display: 'inline-block',
}));

const LabelBold = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  marginBottom: '10px',
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


const SectionContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
  marginBottom: '20px',
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  marginBottom: '4px',
  flex: 1,
}));

const SectionHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '4px',
}));

const Subtitle = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
}));

const WorksheetHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '20px',
  marginBottom: '10px',
}));

const WorksheetTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Bold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const WorksheetActions = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
}));

const IconButtonStyled = styled(IconButton)(() => ({
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const DividerLine = styled(Box)(() => ({
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px 0 0 0',
  width: '100%',
  marginBottom: '20px',
}));

const ValueContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
}));

const ValueText = styled(Typography)(() => ({
  color: '#666666',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
}));


const ExcelUploadArea = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#999999',
  borderWidth: '1px',
  width: '426px',
  height: '343px',
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '8px 16px',
  color: theme.palette.primary.main || '#f16508',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'uppercase',
  background: '#ffffff',
  '&:hover': {
    borderColor: theme.palette.primary.main || '#f16508',
    backgroundColor: `${theme.palette.primary.main}12`,
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#e6e6e6',
  borderWidth: '1px',
  padding: '8px 16px',
  color: '#4d4d4d',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'none',
  background: '#ffffff',
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: theme.palette.primary.main || '#f16508',
  },
}));

const AddSheetButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '32px',
  color: '#ffffff',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.main || '#f16508',
    borderColor: theme.palette.primary.main || '#f16508',
    opacity: 0.9,
  },
}));

const AddSheetLinkButton = styled(Button)(() => ({
  background: 'transparent',
  border: 'none',
  padding: '0px',
  color: '#1890ff',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  textTransform: 'none',
  textDecoration: 'none',
  boxShadow: 'none',
  '&:hover': {
    background: 'transparent',
    color: '#40a9ff',
    textDecoration: 'underline',
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '85px',
  height: '32px',
  color: '#ffffff',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: theme.palette.primary.main || '#f16508',
    borderColor: theme.palette.primary.main || '#f16508',
    opacity: 0.9,
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

const DropdownContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '40px',
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
}));

const DropdownLabel = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  letterSpacing: '0.2px',
  fontWeight: 400,
  flex: 1,
}));

const StyledTextField = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    borderColor: '#b3b3b3',
    height: '40px',
    fontFamily: '"Lato-Regular", sans-serif',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#b3b3b3',
    },
    '&:hover fieldset': {
      borderColor: '#999999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b3b3b3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Lato-Regular", sans-serif',
    fontSize: '14px',
    color: '#666666',
  },
}));

const StyledSelect = styled(Select)(() => ({
  borderRadius: '4px',
  height: '40px',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#999999',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b3b3b3',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f5f5f5',
    color: '#808080',
    cursor: 'not-allowed',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#a0a0a0',
    },
    '& .MuiSelect-icon': {
      color: '#808080',
    },
  },
}));

const FormRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '28px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginBottom: '20px',
}));

const FormField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const AddTemplateDialog = ({ open, onClose, onSave, channelId, editData, copyData, channels = [] }) => {
  const [templateLabel, setTemplateLabel] = useState('');
  const [channelName, setChannelName] = useState('');
  // 从URL获取当前主题，转换为大写
  const getCurrentTheme = () => {
    const themeFromUrl = setUpSheetApi.getThemeFromUrl();
    return themeFromUrl ? themeFromUrl.toUpperCase() : 'KENDO';
  };
  const [theme, setTheme] = useState(getCurrentTheme());
  const [templateType, setTemplateType] = useState('Line');
  const [sheets, setSheets] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [internalEditData, setInternalEditData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (open && editData) {
      // 编辑模式
      setInternalEditData(editData);
      setTemplateLabel(editData.name || editData.label || '');
      setChannelName(editData.channelName || editData.tenant || '');
      setTheme(editData.theme || getCurrentTheme());
      setTemplateType(editData.type || editData.templateType || 'Line');
      setFileName(editData.file || editData.fileName || '');
      setUploadedFile(null);
      // 如果有 fileId，设置 uploadedFileId（用于编辑模式）
      if (editData.fileId) {
        setUploadedFileId(editData.fileId);
      } else {
        setUploadedFileId(null);
      }
      
      // 设置 templateDataDetails
      if (editData.templateDataDetails && Array.isArray(editData.templateDataDetails)) {
        const initSheets = editData.templateDataDetails.map((item, index) => ({
          id: item.id || `sheet_${Date.now()}_${index}`,
          worksheet: item.worksheet !== undefined ? item.worksheet : index,
          firstDataColumn: item.firstDataColumn !== undefined ? item.firstDataColumn : 0,
          firstDataRow: item.firstDataRow !== undefined ? item.firstDataRow : 3,
          lastDataColumn: item.lastDataColumn !== undefined ? item.lastDataColumn : 0,
          expanded: false,
        }));
        setSheets(initSheets);
      } else {
        setSheets([]);
      }
    } else if (open && copyData) {
      // 复制模式
      setInternalEditData(null);
      setTemplateLabel(copyData.name ? `${copyData.name} (Copy)` : (copyData.label ? `${copyData.label} (Copy)` : ''));
      setChannelName(copyData.channelName || copyData.tenant || '');
      setTheme(copyData.theme || getCurrentTheme());
      setTemplateType(copyData.type || copyData.templateType || 'Line');
      setFileName(copyData.file || copyData.fileName || '');
      setUploadedFile(null);
      // 复制时保留原 template 的 fileId
      setUploadedFileId(copyData.fileId || null);
      
      if (copyData.templateDataDetails && Array.isArray(copyData.templateDataDetails) && copyData.templateDataDetails.length > 0) {
        const initSheets = copyData.templateDataDetails.map((item, index) => ({
          id: `sheet_${Date.now()}_${index}`,
          worksheet: item.worksheet !== undefined ? item.worksheet : index,
          firstDataColumn: item.firstDataColumn !== undefined ? item.firstDataColumn : 0,
          firstDataRow: item.firstDataRow !== undefined ? item.firstDataRow : 3,
          lastDataColumn: item.lastDataColumn !== undefined ? item.lastDataColumn : 0,
          expanded: false,
        }));
        setSheets(initSheets);
      } else {
        setSheets([]);
      }
    } else if (open && channelId) {
      // 根据 channelId 设置默认值
      setInternalEditData(null);
      setTemplateLabel('');
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        setChannelName(channel.name || '');
        setTheme(channel.theme || getCurrentTheme());
      } else {
        setChannelName('');
        setTheme(getCurrentTheme());
      }
      setTemplateType('Line');
      setFileName('');
      setUploadedFile(null);
      setUploadedFileId(null);
      setSheets([]);
    } else if (open && !editData && !copyData && !channelId) {
      // 完全新增模式
      setInternalEditData(null);
      setTemplateLabel('');
      setChannelName('');
      setTheme(getCurrentTheme());
      setTemplateType('Line');
      setFileName('');
      setUploadedFile(null);
      setUploadedFileId(null);
      setSheets([]);
    }
  }, [open, editData, copyData, channelId, channels]);

  // 当对话框关闭时，延迟重置状态
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setInternalEditData(null);
        setTemplateLabel('');
        setChannelName('');
        setTheme('KENDO');
        setTemplateType('Line');
        setFileName('');
        setUploadedFile(null);
        setUploadedFileId(null);
        setSheets([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleCancel = () => {
    // 重置表单
    setTemplateLabel('');
    setChannelName('');
    setTheme(getCurrentTheme());
    setTemplateType('Flat');
    setFileName('');
    setUploadedFile(null);
    setUploadedFileId(null);
    setSheets([]);
    if (onClose) {
      onClose();
    }
  };

  const handleSave = async () => {
    // 验证必填字段
    if (!templateLabel || !templateLabel.trim()) {
      setSnackbar({
        open: true,
        message: 'Template label is mandatory',
        severity: 'error',
      });
      return;
    }
    if (!channelName || !channelName.trim()) {
      setSnackbar({
        open: true,
        message: 'Channel name is mandatory',
        severity: 'error',
      });
      return;
    }
    if (!theme || !theme.trim()) {
      setSnackbar({
        open: true,
        message: 'Theme is mandatory',
        severity: 'error',
      });
      return;
    }
    if (!templateType || !templateType.trim()) {
      setSnackbar({
        open: true,
        message: 'Template type is mandatory',
        severity: 'error',
      });
      return;
    }
    // 文件验证
    if (!internalEditData || !internalEditData.id) {
      if (!uploadedFile && !fileName) {
        setSnackbar({
          open: true,
          message: 'Excel file is mandatory',
          severity: 'error',
        });
        return;
      }
    } else {
      if (!uploadedFile && !uploadedFileId && !fileName && !internalEditData.fileId) {
        setSnackbar({
          open: true,
          message: 'Excel file is mandatory',
          severity: 'error',
        });
        return;
      }
    }

    try {
      setSaving(true);

      // 获取 channelId
      let finalChannelId = channelId;
      
      if (internalEditData && internalEditData.channelId) {
        finalChannelId = internalEditData.channelId;
      }
      
      if (!finalChannelId && channelName) {
        const channel = channels.find(c => c.name === channelName.trim());
        if (channel) {
          finalChannelId = channel.id;
        } else {
          throw new Error(`Channel "${channelName}" not found`);
        }
      }

      if (!finalChannelId) {
        throw new Error('Channel ID is required');
      }

      // 获取 fileId
      let fileId = null;
      if (uploadedFileId) {
        fileId = uploadedFileId;
      } else if (internalEditData?.fileId) {
        fileId = internalEditData.fileId;
      } else if (copyData?.fileId) {
        fileId = copyData.fileId;
      } else if (editData?.fileId) {
        fileId = editData.fileId;
      } else if (editData?.file && editData.file.startsWith('/srv/v1.0/main/files/')) {
        const match = editData.file.match(/\/srv\/v1\.0\/main\/files\/([^/]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      } else if (copyData?.file && copyData.file.startsWith('/srv/v1.0/main/files/')) {
        // 复制模式：从 file URL 中提取 fileId
        const match = copyData.file.match(/\/srv\/v1\.0\/main\/files\/([^/]+)/);
        if (match && match[1]) {
          fileId = match[1];
        }
      }
      
      if (!fileId && uploadedFile) {
        setSnackbar({
          open: true,
          message: 'Please upload the Excel file first.',
          severity: 'error',
        });
        setSaving(false);
        return;
      }

      const userInfo = CookieService.getUserInfo();
      const tenantName = userInfo?.tenant?.name || userInfo?.tenantName || 'Kendo';
      
      // 准备模板数据
      const templateData = {
        tenant: tenantName,
        channelId: finalChannelId,
        name: templateLabel.trim(),
        description: '',
        templateType: templateType || 'Flat',
        theme: theme || 'KENDO', 
        templateDataDetails: sheets.map(sheet => ({
          worksheet: sheet.worksheet,
          firstDataColumn: sheet.firstDataColumn,
          firstDataRow: sheet.firstDataRow,
          lastDataColumn: sheet.lastDataColumn,
        })),
      };

      if (fileId) {
        templateData.fileId = fileId;
      }

      if (internalEditData && internalEditData.id) {
        templateData.id = internalEditData.id;
        await setUpSheetApi.updateTemplate(templateData);
        
        setSnackbar({
          open: true,
          message: `Template "${templateLabel}" has been updated successfully.`,
          severity: 'success',
        });
      } else {
        await setUpSheetApi.createTemplate(templateData);
        
        setSnackbar({
          open: true,
          message: `Template "${templateLabel}" has been created successfully.`,
          severity: 'success',
        });
      }

      if (onSave) {
        onSave(null);
      }

      setTimeout(() => {
        handleCancel();
      }, 500);
    } catch (error) {
      console.error('Failed to save template:', error);
      setSnackbar({
        open: true,
        message: `Failed to save template: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setUploadedFile(file);
        setFileName(file.name);
        
        // 立即上传文件
        const uploadResult = await fileApi.uploadFile(file);
        const fileId = uploadResult?.id || uploadResult?.fileId || null;
        
        if (fileId) {
          setUploadedFileId(fileId);
          setSnackbar({
            open: true,
            message: `File "${file.name}" uploaded successfully.`,
            severity: 'success',
          });
        } else {
          throw new Error('Failed to get file ID from upload response');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setSnackbar({
          open: true,
          message: `Failed to upload file: ${error.message}`,
          severity: 'error',
        });
        // 上传失败时清除文件
        setUploadedFile(null);
        setFileName('');
        setUploadedFileId(null);
        // 重置文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setUploading(false);
      }
    }
  };

  const addSheet = () => {
    const newSheet = {
      id: `sheet_${Date.now()}`,
      worksheet: sheets.length,
      firstDataColumn: 0,
      firstDataRow: 3,
      lastDataColumn: 0,
      expanded: false,
    };
    const newSheets = [...sheets, newSheet];
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const syncToParent = (newSheets) => {
    // 同步到本地状态
    setSheets(newSheets);
  };

  const handleDeleteSheet = (sheetId) => {
    const newSheets = sheets
      .filter(sheet => sheet.id !== sheetId)
      .map((sheet, index) => ({
        ...sheet,
        worksheet: index,
      }));
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const handleCopySheet = (sheetId) => {
    const sheetToCopy = sheets.find(sheet => sheet.id === sheetId);
    if (sheetToCopy) {
      const newSheet = {
        ...sheetToCopy,
        id: `sheet_${Date.now()}`,
        worksheet: sheets.length,
      };
      const newSheets = [...sheets, newSheet];
      setSheets(newSheets);
      syncToParent(newSheets);
    }
  };

  const handleUpdateSheetField = (sheetId, field, value) => {
    const newSheets = sheets.map(sheet =>
      sheet.id === sheetId ? { ...sheet, [field]: value } : sheet
    );
    setSheets(newSheets);
    syncToParent(newSheets);
  };

  const handleToggleSheetExpand = (sheetId) => {
    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === sheetId ? { ...sheet, expanded: !sheet.expanded } : sheet
      )
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '1100px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden', maxHeight: '90vh' }}>
        <DialogContainer>
          <Title>{internalEditData ? 'Edit template' : 'Add template'}</Title>

          {/* Template Basic Information - Two Column Layout */}
          <FormRow>
            {/* Left Column */}
            <SectionContainer>
              <Label>
                Template Label
                <RequiredStar>*</RequiredStar>
              </Label>
              <StyledTextField
                placeholder="Enter template label"
                value={templateLabel}
                onChange={(e) => setTemplateLabel(e.target.value)}
                variant="outlined"
              />
              <Box sx={{ marginTop: '20px', width: '100%' }}>
                <LabelBold>
                  Theme
                  <RequiredStar>*</RequiredStar>
                </LabelBold>
                <FormControl fullWidth>
                  <StyledSelect
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    IconComponent={ArrowDropDownIcon}
                    disabled={!!internalEditData}
                    sx={internalEditData ? {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b3b3b3',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b3b3b3',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b3b3b3',
                      },
                      backgroundColor: '#f5f5f5',
                    } : {}}
                  >
                    <MenuItem value="KENDO">KENDO</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Box>
            </SectionContainer>

            {/* Right Column */}
            <SectionContainer>
              <LabelBold>
                Channel Name
                <RequiredStar>*</RequiredStar>
              </LabelBold>
              <StyledTextField
                placeholder="Enter channel name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#b3b3b3',
                    },
                    '&:hover fieldset': {
                      borderColor: '#b3b3b3',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b3b3b3',
                    },
                  },
                }}
              />
              <Box sx={{ marginTop: '20px', width: '100%' }}>
                <LabelBold>
                  Template Type
                  <RequiredStar>*</RequiredStar>
                </LabelBold>
                <FormControl fullWidth>
                  <StyledSelect
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    IconComponent={ArrowDropDownIcon}
                  >
                    <MenuItem value="Line">Line</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Box>
            </SectionContainer>
          </FormRow>


          {/* Template Data Details Configuration */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '28px', alignItems: 'flex-start', marginTop: '40px', marginBottom: '20px' }}>
            {/* Left Panel - Configuration */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '550px', flexShrink: 0 }}>
              {/* Header with Title and Add Sheet Button */}
              <SectionHeader>
                <SectionTitle>Template Data Details Configuration</SectionTitle>
                {sheets.length === 0 ? (
                  <AddSheetLinkButton onClick={addSheet}>
                    Add your first sheet
                  </AddSheetLinkButton>
                ) : (
                  <AddSheetButton onClick={addSheet} sx={{ width: 'fit-content', flexShrink: 0 }}>
                    <AddIcon sx={{ fontSize: '16px' }} />
                    Add Sheet
                  </AddSheetButton>
                )}
              </SectionHeader>
              <Subtitle>Configure Excel sheet data extraction settings</Subtitle>
              <DividerLine sx={{ marginTop: '4px', marginBottom: '0px' }} />
              
              {/* Worksheet Configuration */}
              {sheets.length === 0 ? (
                <Box sx={{ marginTop: '20px', padding: '20px', textAlign: 'center', color: '#999999' }}>
                  <Typography sx={{ fontFamily: '"Lato-Regular", sans-serif', fontSize: '14px' }}>
                    No worksheets configured. Click "Add your first sheet" to get started.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  marginTop: '20px', 
                  maxHeight: '315px', // 约 4.5 个 worksheet 的高度（每个约 70px）
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE and Edge
                  '&::-webkit-scrollbar': {
                    display: 'none', // Chrome, Safari, Opera
                  },
                }}>
                  {sheets.map((sheet) => (
                    <Box key={sheet.id} sx={{ marginBottom: '20px' }}>
                      <WorksheetHeader>
                        <WorksheetTitle>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleToggleSheetExpand(sheet.id)}
                            sx={{ padding: '2px', marginRight: '4px' }}
                          >
                            {sheet.expanded ? (
                              <ExpandMoreIcon sx={{ fontSize: '20px' }} />
                            ) : (
                              <ExpandLessIcon sx={{ fontSize: '20px' }} />
                            )}
                          </IconButtonStyled>
                          Worksheet {sheet.worksheet}
                          <Typography
                            component="span"
                            sx={{
                              color: '#666666',
                              fontFamily: '"Lato-Regular", sans-serif',
                              fontSize: '14px',
                              lineHeight: '140%',
                              letterSpacing: '0.2px',
                              fontWeight: 400,
                              marginLeft: '8px',
                            }}
                          >
                            ID: {sheet.id}
                          </Typography>
                        </WorksheetTitle>
                        <WorksheetActions>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleCopySheet(sheet.id)}
                          >
                            <ContentCopyIcon sx={{ fontSize: '18px' }} />
                          </IconButtonStyled>
                          <IconButtonStyled 
                            size="small"
                            onClick={() => handleDeleteSheet(sheet.id)}
                          >
                            <DeleteIcon sx={{ fontSize: '18px' }} />
                          </IconButtonStyled>
                        </WorksheetActions>
                      </WorksheetHeader>
                      
                      {/* 横线始终显示，无论展开还是闭合 */}
                      <DividerLine sx={{ marginTop: '10px', marginBottom: '20px' }} />
                      
                      {sheet.expanded && (
                        <>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                              <Box sx={{ flex: 1 }}>
                                <LabelBold>Worksheet Index</LabelBold>
                                <NumberInputField
                                  value={sheet.worksheet}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'worksheet', value)}
                                  min={0}
                                />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <LabelBold>First Data Column</LabelBold>
                                <NumberInputField
                                  value={sheet.firstDataColumn}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'firstDataColumn', value)}
                                  min={0}
                                />
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                              <Box sx={{ flex: 1 }}>
                                <LabelBold>First Data Row</LabelBold>
                                <NumberInputField
                                  value={sheet.firstDataRow}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'firstDataRow', value)}
                                  min={0}
                                />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <LabelBold>Last Data Column</LabelBold>
                                <NumberInputField
                                  value={sheet.lastDataColumn}
                                  onChange={(value) => handleUpdateSheetField(sheet.id, 'lastDataColumn', value)}
                                  min={0}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Panel - JSON Preview */}
            <Box sx={{ flex: 1, maxWidth: '475px', alignSelf: 'flex-start' }}>
              <Box sx={{
                p: 2,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                height: '400px',
                overflow: 'auto'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#000000', fontFamily: '"Lato-Bold", sans-serif', fontSize: '14px', lineHeight: '140%', letterSpacing: '0.2px' }}>
                  JSON Preview
                </Typography>
                <pre style={{
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: '1.4',
                  color: '#333',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                }}>
                  {JSON.stringify(sheets.map((sheet) => ({
                    worksheet: sheet.worksheet,
                    firstDataColumn: sheet.firstDataColumn,
                    firstDataRow: sheet.firstDataRow,
                    lastDataColumn: sheet.lastDataColumn,
                  })), null, 2)}
                </pre>
              </Box>
            </Box>
          </Box>

          {/* Buttons */}
          <Box sx={{ marginTop: '20px', paddingTop: '20px' }}>
            <ButtonContainer>
              <UploadButton onClick={handleUploadExcel} disabled={uploading}>
                {uploading ? (
                  <>
                    <CircularProgress size={16} sx={{ color: '#666666', mr: 1 }} />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload Excel File
                    <RequiredStar>*</RequiredStar>
                  </>
                )}
              </UploadButton>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box sx={{ flex: 1 }} />
              <CancelButton onClick={handleCancel}>
                CANCEL
              </CancelButton>
              <SaveButton onClick={handleSave} disabled={saving}>
                {saving ? <CircularProgress size={16} sx={{ color: '#ffffff' }} /> : 'SAVE'}
              </SaveButton>
            </ButtonContainer>
            {(fileName || uploadedFile) && (
              <Typography sx={{ 
                color: '#666666', 
                fontFamily: '"Lato-Regular", sans-serif', 
                fontSize: '14px',
                lineHeight: '140%',
                letterSpacing: '0.2px',
                fontWeight: 400,
                marginTop: '8px',
                marginLeft: '0px',
              }}>
                Current file: {uploadedFile ? uploadedFile.name : fileName}
              </Typography>
            )}
          </Box>
        </DialogContainer>
      </DialogContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default AddTemplateDialog;

