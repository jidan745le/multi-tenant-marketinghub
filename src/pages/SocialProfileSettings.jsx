import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SectionCard, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import { selectCurrentLanguage } from '../store/slices/themesSlice';
import { createNotification, updateThemeWithLocale, validateBrandData } from '../utils/themeUpdateUtils';

// 样式化保存按钮 - 使用主题色
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

function SocialProfileSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
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

  // 保存社交媒体配置 - 使用通用工具函数
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('🔄 开始保存Social Profile配置...');

      // 准备更新数据
      const updateData = {
        socialprofile: formData
      };

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Social Profile配置'
      });

      setNotification(createNotification(true, '社交媒体设置保存成功！'));
    } catch (error) {
      console.error('保存社交媒体设置失败:', error);
      setNotification(createNotification(false, `保存失败: ${error.message}`));
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
      <SectionCard>
        {socialFields.map((field, index) => (
          <Box key={field.key} sx={{ mb: index === socialFields.length - 1 ? 0 : 3 }}>
            <SubTitle>{field.label}</SubTitle>
            <TextField
              sx={{ 
                width: "60%",
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              variant="outlined"
              size="medium"
            />
          </Box>
        ))}
      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
          Save Configuration
        </SaveButton>
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

export default SocialProfileSettings; 