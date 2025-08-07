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

// 样式化保存按钮 - 参考 Look&Feel 页面
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

function LegalSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const [loading, setLoading] = useState(false);
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

  // 保存Legal配置 - 使用通用工具函数
  const handleSaveLegal = async () => {
    try {
      setLoading(true);
      
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('🔄 开始保存Legal配置...');

      // 准备更新数据
      const updateData = {
        legal: formData
      };

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Legal配置'
      });

      setNotification(createNotification(true, 'Legal配置保存成功！'));
    } catch (error) {
      console.error('保存Legal配置失败:', error);
      setNotification(createNotification(false, `保存失败: ${error.message}`));
    } finally {
      setLoading(false);
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Terms & Condition Section */}
      <SectionCard sx={{ position: 'relative', overflow: 'visible' }}>
        <SubTitle>TERMS & CONDITION</SubTitle>
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            placeholder="Enter Terms & Condition here..."
            value={formData.termsCondition}
            onChange={(e) => handleFieldChange('termsCondition', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              },
              '& .MuiInputBase-input': {
                padding: '20px',
                overflow: 'auto !important',
                resize: 'none',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />
        </Box>

      </SectionCard>

      {/* Privacy Policy Section */}
      <SectionCard sx={{ position: 'relative', overflow: 'visible' }}>
        <SubTitle>PRIVACY POLICY</SubTitle>
        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <TextField
            fullWidth
            multiline
            rows={12}
            placeholder="Enter Privacy Policy here..."
            value={formData.privayPolicy}
            onChange={(e) => handleFieldChange('privayPolicy', e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'white',
                fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              },
              '& .MuiInputBase-input': {
                padding: '20px',
                overflow: 'auto !important',
                resize: 'none',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />
        </Box>

      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSaveLegal}
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

export default LegalSettings; 