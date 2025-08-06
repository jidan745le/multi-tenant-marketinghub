import SaveIcon from '@mui/icons-material/Save';
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
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { getThemeDocumentIdFromBrand, refreshThemeData, updateCommunication } from '../services/strapiApi';

// 样式化保存按钮 - 使用主题色
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function CommunicationSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
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

  // 保存配置到Strapi
  const handleSave = async () => {
    try {
      setSaving(true);
      
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

      await updateCommunication(documentId, formData);
      
      // 刷新Redux中的数据
      await refreshThemeData(dispatch);

      setNotification({
        open: true,
        message: '通信设置保存成功！',
        severity: 'success'
      });
    } catch (error) {
      console.error('保存通信设置失败:', error);
      setNotification({
        open: true,
        message: `保存失败: ${error.message}`,
        severity: 'error'
      });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Communication & Email Settings
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

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Server Name */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            SERVER NAME
          </Typography>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            PORT
          </Typography>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            URL
          </Typography>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            USER
          </Typography>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            PASSWORD
          </Typography>
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

export default CommunicationSettings; 