import SaveIcon from '@mui/icons-material/Save';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { getThemeDocumentIdFromBrand, refreshThemeData, updateSocialProfile } from '../services/strapiApi';

// 样式化保存按钮 - 使用主题色
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function SocialProfileSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    wechat: '',
    linkedIn: '',
    pinterest: ''
  });

  // 从当前品牌数据中加载socialprofile配置
  useEffect(() => {
    if (currentBrand?.socialprofile) {
      setFormData({
        website: currentBrand.socialprofile.website || '',
        facebook: currentBrand.socialprofile.facebook || '',
        twitter: currentBrand.socialprofile.twitter || '',
        instagram: currentBrand.socialprofile.instagram || '',
        wechat: currentBrand.socialprofile.wechat || '',
        linkedIn: currentBrand.socialprofile.linkedIn || '',
        pinterest: currentBrand.socialprofile.pinterest || ''
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

  // 保存社交媒体配置
  const handleSave = async () => {
    try {
      setLoading(true);
      
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

      await updateSocialProfile(documentId, formData);
      
      // 刷新Redux中的数据
      await refreshThemeData(dispatch);

      setNotification({
        open: true,
        message: '社交媒体设置保存成功！',
        severity: 'success'
      });
    } catch (error) {
      console.error('保存社交媒体设置失败:', error);
      setNotification({
        open: true,
        message: `保存失败: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // 社交媒体字段配置
  const socialFields = [
    { key: 'website', label: 'Website', placeholder: 'Enter website link' },
    { key: 'facebook', label: 'Facebook', placeholder: 'Enter Facebook' },
    { key: 'twitter', label: 'Twitter', placeholder: 'Enter Twitter' },
    { key: 'instagram', label: 'Instagram', placeholder: 'Enter Instagram' },
    { key: 'wechat', label: 'Wechat', placeholder: 'Enter Wechat' },
    { key: 'linkedIn', label: 'LinkedIn', placeholder: 'Enter LinkedIn' },
    { key: 'pinterest', label: 'Pinterest', placeholder: 'Enter Pinterest' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Social Profile
        </Typography>
        <SaveButton
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? '保存中...' : '保存设置'}
        </SaveButton>
      </Box>

      <Paper elevation={1} sx={{ p: 3 }}>
        {socialFields.map((field, index) => (
          <Box key={field.key} sx={{ mb: index === socialFields.length - 1 ? 0 : 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fafafa',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff'
                  }
                }
              }}
            />
          </Box>
        ))}
      </Paper>

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

export default SocialProfileSettings; 