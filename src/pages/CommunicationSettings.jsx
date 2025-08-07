import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
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

function CommunicationSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    servername: '',
    port: '',
    requiresSSL: false,
    requiresAuthentication: false,
    url: '',
    user: '',
    password: ''
  });

  // 从当前品牌数据中加载communication配置
  useEffect(() => {
    if (currentBrand?.communication) {
      setFormData({
        servername: currentBrand.communication.servername || '',
        port: currentBrand.communication.port || '',
        requiresSSL: currentBrand.communication.requiresSSL || false,
        requiresAuthentication: currentBrand.communication.requiresAuthentication || false,
        url: currentBrand.communication.url || '',
        user: currentBrand.communication.user || '',
        password: currentBrand.communication.password || ''
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

  // 切换密码可见性
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 保存配置到Strapi - 使用通用工具函数
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('🔄 开始保存Communication配置...');

      // 准备更新数据
      const updateData = {
        communication: formData
      };

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Communication配置'
      });

      setNotification(createNotification(true, '通信设置保存成功！'));
    } catch (error) {
      console.error('保存通信设置失败:', error);
      setNotification(createNotification(false, `保存失败: ${error.message}`));
    } finally {
      setSaving(false);
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <SectionCard>
        {/* Server Name */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>SERVER NAME</SubTitle>
          <TextField
            fullWidth
            placeholder="RG.experience@gmail.com"
            value={formData.servername}
            onChange={(e) => handleFieldChange('servername', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Port */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>PORT</SubTitle>
          <TextField
            fullWidth
            placeholder="Enter Port"
            value={formData.port}
            onChange={(e) => handleFieldChange('port', e.target.value)}
            variant="outlined"
            size="medium"
            type="number"
          />
        </Box>

        {/* Checkboxes */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.requiresSSL}
                onChange={(e) => handleFieldChange('requiresSSL', e.target.checked)}
                sx={{ color: '#4CAF50' }}
              />
            }
            label="Requires SSL"
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.requiresAuthentication}
                onChange={(e) => handleFieldChange('requiresAuthentication', e.target.checked)}
                sx={{ color: '#4CAF50' }}
              />
            }
            label="Requires Authentication"
            sx={{ display: 'block' }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* URL */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>URL</SubTitle>
          <TextField
            fullWidth
            placeholder="Enter URL"
            value={formData.url}
            onChange={(e) => handleFieldChange('url', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* User */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>USER</SubTitle>
          <TextField
            fullWidth
            placeholder="Enter User"
            value={formData.user}
            onChange={(e) => handleFieldChange('user', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Password */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>PASSWORD</SubTitle>
          <TextField
            fullWidth
            placeholder="Enter password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
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

export default CommunicationSettings; 