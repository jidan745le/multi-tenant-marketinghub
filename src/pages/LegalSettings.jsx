import CheckIcon from '@mui/icons-material/Check';
import {
    Alert,
    Box,
    CircularProgress,
    Fab,
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { getThemeDocumentIdFromBrand, refreshThemeData, updateLegal } from '../services/strapiApi';

// 样式化保存按钮 - 使用主题色
const SaveFab = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: '#ccc'
  }
}));

function LegalSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ terms: false, privacy: false });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    termsCondition: '',
    privayPolicy: ''
  });

  // 从当前品牌数据中加载legal配置
  useEffect(() => {
    if (currentBrand?.legal) {
      setFormData({
        termsCondition: currentBrand.legal.termsCondition || '',
        privayPolicy: currentBrand.legal.privayPolicy || ''
      });
    }
  }, [currentBrand]);

  // 处理表单字段变化
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 刷新数据的通用函数
  const refreshData = async () => {
    await refreshThemeData(dispatch);
  };

  // 保存Terms & Condition
  const handleSaveTerms = async () => {
    try {
      setLoading(prev => ({ ...prev, terms: true }));
      
      if (!currentBrand) {
        throw new Error('未找到当前品牌数据');
      }

      if (!currentBrand.strapiData?.documentId) {
        throw new Error('未找到品牌的 documentId');
      }

      const documentId = getThemeDocumentIdFromBrand(currentBrand);
      
      if (!documentId) {
        throw new Error('无法获取主题documentId');
      }

      await updateLegal(documentId, {
        ...formData,
        termsCondition: formData.termsCondition
      });
      
      await refreshData();

      setNotification({
        open: true,
        message: 'Terms & Condition 保存成功！',
        severity: 'success'
      });
    } catch (error) {
      console.error('保存Terms & Condition失败:', error);
      setNotification({
        open: true,
        message: `保存失败: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, terms: false }));
    }
  };

  // 保存Privacy Policy
  const handleSavePrivacy = async () => {
    try {
      setLoading(prev => ({ ...prev, privacy: true }));
      
      if (!currentBrand) {
        throw new Error('未找到当前品牌数据');
      }

      if (!currentBrand.strapiData?.documentId) {
        throw new Error('未找到品牌的 documentId');
      }

      const documentId = getThemeDocumentIdFromBrand(currentBrand);
      
      if (!documentId) {
        throw new Error('无法获取主题documentId');
      }

      await updateLegal(documentId, {
        ...formData,
        privayPolicy: formData.privayPolicy
      });
      
      await refreshData();

      setNotification({
        open: true,
        message: 'Privacy Policy 保存成功！',
        severity: 'success'
      });
    } catch (error) {
      console.error('保存Privacy Policy失败:', error);
      setNotification({
        open: true,
        message: `保存失败: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, privacy: false }));
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Terms & Condition Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
          Terms & Condition
        </Typography>
        <Paper elevation={1} sx={{ position: 'relative', overflow: 'visible' }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            placeholder="Enter Terms & Condition here..."
            value={formData.termsCondition}
            onChange={(e) => handleFieldChange('termsCondition', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          {/* Floating Save Button */}
          <SaveFab
            size="small"
            onClick={handleSaveTerms}
            disabled={loading.terms}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
            }}
          >
            {loading.terms ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          </SaveFab>
        </Paper>
      </Box>

      {/* Privacy Policy Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
          Privacy Policy
        </Typography>
        <Paper elevation={1} sx={{ position: 'relative', overflow: 'visible' }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            placeholder="Enter Privacy Policy here..."
            value={formData.privayPolicy}
            onChange={(e) => handleFieldChange('privayPolicy', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          {/* Floating Save Button */}
          <SaveFab
            size="small"
            onClick={handleSavePrivacy}
            disabled={loading.privacy}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
            }}
          >
            {loading.privacy ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          </SaveFab>
        </Paper>
      </Box>

      {/* 通知消息 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LegalSettings; 