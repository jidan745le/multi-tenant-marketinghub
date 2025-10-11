import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { SectionCard, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';
import emailApi from '../services/emailApi';
import CookieService from '../utils/cookieService';

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
  const { currentBrandCode } = useBrand();
  const { currentLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    host: '',
    port: 587,
    ssl: false,
    authRequired: false,
    fromEmail: '',
    username: '',
    password: '',
    theme: '',
    tenant: ''
  });
  
  // Email template ID for updates
  const [templateId, setTemplateId] = useState(null);

  // Email Templates state
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('Welcome email');
  const [templateData, setTemplateData] = useState({
    tenant: '',
    templateName: '',
    templateBody: '',
    keyword: '',
    subject: ''
  });
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  // 默认模板列表
  const defaultTemplates = [
    'Welcome email',
    'Password Reset email', 
    'Mass Download Email',
    'Derivate eMail',
    'Send Feedback'
  ];

  // 加载邮件模板配置
  useEffect(() => {
    const loadEmailTemplate = async () => {
      if (currentBrandCode) {
        try {
          setSaving(true);
          
          // Try to load existing email template
          // Get tenant info from CookieService
          const userInfo = CookieService.getUserInfo();
          const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
          
          const response = await emailApi.getEmailTemplate(currentBrandCode, tenant);
          
          if (response.success && response.data) {
            setFormData({
              host: response.data.host || '',
              port: response.data.port || 587,
              ssl: response.data.ssl || false,
              authRequired: response.data.authRequired || false,
              fromEmail: response.data.fromEmail || '',
              username: response.data.username || '',
              password: response.data.password || '',
              theme: response.data.theme || currentBrandCode,
              tenant: response.data.tenant || tenant
            });
            setTemplateId(response.data.id);
            console.log('✅ 成功加载邮件模板配置');
          } else {
            // Set default values with current brand info
            setFormData(prev => ({
              ...prev,
              theme: currentBrandCode,
              tenant: tenant
            }));
            console.log('📝 使用默认邮件配置');
          }
        } catch (error) {
          console.log('📋 未找到现有邮件模板，使用默认配置');
          // Set default values with current brand info
          setFormData(prev => ({
            ...prev,
            theme: currentBrandCode,
            tenant: tenant
          }));
        } finally {
          setSaving(false);
        }
      }
    };

    loadEmailTemplate();
    loadEmailTemplates();
    initializeTemplateData();
  }, [currentBrandCode, currentLanguage]);

  // 初始化模板数据
  const initializeTemplateData = () => {
    const userInfo = CookieService.getUserInfo();
    const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
    
    setTemplateData(prev => ({
      ...prev,
      tenant: tenant,
      templateName: selectedTemplate
    }));
  };

  // 当模板数据和可用模板列表都加载完成后，触发当前选中模板的数据加载
  useEffect(() => {
    if (availableTemplates.length > 0 && emailTemplates !== null) {
      // 如果当前选中的模板不在可用列表中，选择第一个可用模板
      if (!availableTemplates.includes(selectedTemplate)) {
        const firstTemplate = availableTemplates[0];
        setSelectedTemplate(firstTemplate);
        handleTemplateSelectionChange(firstTemplate);
      } else {
        // 如果当前模板有效，重新加载其数据（确保回显）
        handleTemplateSelectionChange(selectedTemplate);
      }
    }
  }, [availableTemplates, emailTemplates]);

  // 加载邮件模板列表
  const loadEmailTemplates = async () => {
    try {
      const userInfo = CookieService.getUserInfo();
      const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
      const theme = currentBrandCode;
      const lang = currentLanguage || 'en_GB';
      
      console.log('🔄 加载邮件模板列表，参数:', { tenant, theme, lang });
      
      const response = await emailApi.getEmailTemplatesByTenant(tenant, theme, lang);
      
      if (response.success && response.data) {
        // 保存API返回的模板数据
        setEmailTemplates(response.data);
        console.log('✅ 成功加载邮件模板数据:', response.data);
      } else {
        // 如果接口返回为空
        setEmailTemplates([]);
        console.log('📋 API返回空数据');
      }
      
      // 始终显示完整的默认模板列表供用户选择
      setAvailableTemplates(defaultTemplates);
      console.log('📋 使用完整的默认模板列表:', defaultTemplates);
      
    } catch (error) {
      // 如果API调用失败
      console.log('📋 加载邮件模板列表失败:', error);
      setEmailTemplates([]);
      setAvailableTemplates(defaultTemplates);
    }
  };

  // 处理表单字段变化
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理模板字段变化
  const handleTemplateFieldChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理模板选择变化
  const handleTemplateSelectionChange = (templateName) => {
    setSelectedTemplate(templateName);
    
    // 查找对应的模板数据
    const template = emailTemplates.find(t => t.templateName === templateName);
    if (template) {
      // 找到已存在的模板，回显所有数据
      setTemplateData({
        tenant: template.tenant || '',
        templateName: template.templateName || '',
        templateBody: template.templateBody || '',
        keyword: template.keyword || '',
        subject: template.subject || ''
      });
      setCurrentTemplateId(template.id);
      console.log('📝 回显现有模板数据:', template);
    } else {
      // 如果没有找到，说明是新模板，重置为空的默认值
      const userInfo = CookieService.getUserInfo();
      const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
      
      setTemplateData({
        tenant: tenant,
        templateName: templateName,
        templateBody: '',
        keyword: '',
        subject: ''
      });
      setCurrentTemplateId(null);
      console.log('✨ 创建新模板:', templateName);
    }
  };

  // 切换密码可见性
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 测试邮件配置
  const handleTestEmail = async () => {
    try {
      setSaving(true);
      
      console.log('🔄 开始测试Email配置...');
      
      const response = await emailApi.testEmailConfiguration(formData);
      
      if (response.success) {
        setNotification({ 
          open: true, 
          message: '邮件配置测试成功！', 
          severity: 'success' 
        });
      } else {
        throw new Error(response.message || 'Test failed');
      }
    } catch (error) {
      console.error('测试邮件配置失败:', error);
      setNotification({ 
        open: true, 
        message: `测试失败: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  // 保存配置 - 完全使用新的 Email API
  const handleSave = async () => {
    try {
      setSaving(true);
      
      console.log('🔄 开始保存Email配置...');

      let response;
      if (templateId) {
        // Update existing template
        response = await emailApi.updateEmailTemplate(templateId, formData);
        console.log('📝 更新现有邮件模板');
      } else {
        // Create new template
        response = await emailApi.createEmailTemplate(formData);
        console.log('✨ 创建新邮件模板');
      }

      if (response.success) {
        // Update template ID if it was a new creation
        if (!templateId && response.data?.id) {
          setTemplateId(response.data.id);
          console.log('🆔 设置模板ID:', response.data.id);
        }

        setNotification({ 
          open: true, 
          message: '邮件设置保存成功！', 
          severity: 'success' 
        });
        console.log('✅ 邮件配置保存成功');
      } else {
        throw new Error(response.message || 'Save failed');
      }
    } catch (error) {
      console.error('保存邮件设置失败:', error);
      setNotification({ 
        open: true, 
        message: `保存失败: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  // 删除邮件模板
  const handleDeleteTemplate = async () => {
    if (!templateId) {
      setNotification({ 
        open: true, 
        message: '没有可删除的邮件模板', 
        severity: 'warning' 
      });
      return;
    }

    if (!window.confirm('确定要删除当前的邮件模板配置吗？此操作不可撤销。')) {
      return;
    }

    try {
      setSaving(true);
      
      console.log('🗑️ 开始删除邮件模板...');
      
      const response = await emailApi.deleteEmailTemplate(templateId);
      
      if (response.success) {
        // Reset form to default values
        const userInfo = CookieService.getUserInfo();
        const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
        
        setFormData({
          host: '',
          port: 587,
          ssl: false,
          authRequired: false,
          fromEmail: '',
          username: '',
          password: '',
          theme: currentBrandCode,
          tenant: tenant
        });
        setTemplateId(null);
        
        setNotification({ 
          open: true, 
          message: '邮件模板删除成功！', 
          severity: 'success' 
        });
        console.log('✅ 邮件模板删除成功');
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('删除邮件模板失败:', error);
      setNotification({ 
        open: true, 
        message: `删除失败: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  // 重置表单
  const handleResetForm = () => {
    if (!window.confirm('确定要重置所有设置吗？未保存的更改将丢失。')) {
      return;
    }

    const userInfo = CookieService.getUserInfo();
    const tenant = userInfo?.tenant?.name || userInfo?.tenantName || currentBrandCode;
    
    setFormData({
      host: '',
      port: 587,
      ssl: false,
      authRequired: false,
      fromEmail: '',
      username: '',
      password: '',
      theme: currentBrandCode,
      tenant: tenant
    });
    
    setNotification({ 
      open: true, 
      message: '表单已重置', 
      severity: 'info' 
    });
  };

  // 保存邮件模板
  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      
      console.log('🔄 开始保存邮件模板...', {
        templateName: templateData.templateName,
        currentTemplateId: currentTemplateId,
        action: currentTemplateId ? 'UPDATE' : 'CREATE'
      });

      let response;
      if (currentTemplateId) {
        // Update existing template
        response = await emailApi.updateEmailTemplateById(currentTemplateId, templateData);
        console.log('📝 更新现有邮件模板，ID:', currentTemplateId);
      } else {
        // Create new template
        response = await emailApi.createEmailTemplateV2(templateData);
        console.log('✨ 创建新邮件模板:', templateData.templateName);
      }

      if (response.success) {
        // Update template ID if it was a new creation
        if (!currentTemplateId && response.data?.id) {
          setCurrentTemplateId(response.data.id);
          console.log('🆔 设置模板ID:', response.data.id);
        }

        // Reload templates list
        await loadEmailTemplates();

        setNotification({ 
          open: true, 
          message: '邮件模板保存成功！', 
          severity: 'success' 
        });
        console.log('✅ 邮件模板保存成功');
      } else {
        throw new Error(response.message || 'Save template failed');
      }
    } catch (error) {
      console.error('保存邮件模板失败:', error);
      setNotification({ 
        open: true, 
        message: `保存失败: ${error.message}`, 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  // 提取模板中的关键词
  const extractKeywordsFromTemplate = (templateContent) => {
    if (!templateContent) return '';
    
    // 使用正则表达式提取所有的占位符 [keyword]
    const regex = /\[([^\]]+)\]/g;
    const keywords = [];
    let match;
    
    while ((match = regex.exec(templateContent)) !== null) {
      keywords.push(match[1]);
    }
    
    // 去重并用逗号分隔
    return [...new Set(keywords)].join(', ');
  };


  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <SectionCard>
        {/* From Email */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>FROM EMAIL</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="notification@rg-experience.com"
            value={formData.fromEmail}
            onChange={(e) => handleFieldChange('fromEmail', e.target.value)}
            variant="outlined"
            size="medium"
            type="email"
          />
        </Box>

        {/* Host */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>HOST</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="smtp.zoho.com"
            value={formData.host}
            onChange={(e) => handleFieldChange('host', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Port */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>PORT</SubTitle>
          <TextField
            sx={{ width: "60%" }}
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
                checked={formData.ssl}
                onChange={(e) => handleFieldChange('ssl', e.target.checked)}
                sx={{ 
                  color: (theme) => theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: (theme) => theme.palette.primary.main,
                  }
                }}
              />
            }
            label="SSL"
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.authRequired}
                onChange={(e) => handleFieldChange('authRequired', e.target.checked)}
                sx={{ 
                  color: (theme) => theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: (theme) => theme.palette.primary.main,
                  }
                }}
              />
            }
            label="Authentication Required"
            sx={{ display: 'block' }}
          />
        </Box>

        {/* Username */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>USERNAME</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="notification@rg-experience.com"
            value={formData.username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Password */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>PASSWORD</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="ReRock520241"
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

      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
        {/* 左侧按钮 */}
        {/* <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={handleResetForm}
            disabled={loading}
          >
            Reset Form
          </Button>
          {templateId && (
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleDeleteTemplate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
              Delete Template
            </Button>
          )}
        </Box> */}

        {/* 右侧按钮 */}
        <Box sx={{ display: 'flex', gap: 2 , justifyContent: 'right',width: '100%'}}>
          {/* <Button 
            variant="outlined" 
            onClick={handleTestEmail}
            disabled={loading || !formData.host || !formData.fromEmail}
          >
            {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
            Test Configuration
          </Button> */}
        <SaveButton 
          variant="contained" 
          onClick={handleSave}
            disabled={loading || !formData.host || !formData.fromEmail}
        >
          {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
            {templateId ? 'Update Configuration' : 'Save Configuration'}
        </SaveButton>
        </Box>
      </Box>

      {/* Email Templates Section */}
      <SectionCard sx={{ mt: 4 }}>
        <SubTitle sx={{ mb: 3, fontSize: '1.5rem', fontWeight: 'bold' }}>Email Templates</SubTitle>
        
        {/* Template Selection */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>TEMPLATE</SubTitle>
          <Select
            value={availableTemplates.includes(selectedTemplate) ? selectedTemplate : ''}
            onChange={(e) => handleTemplateSelectionChange(e.target.value)}
            sx={{ width: "60%" }}
            size="medium"
            displayEmpty
          >
            {availableTemplates.length === 0 && (
              <MenuItem value="" disabled>
                Loading templates...
              </MenuItem>
            )}
            {availableTemplates.map((templateName) => (
              <MenuItem key={templateName} value={templateName}>
                {templateName}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Subject */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>SUBJECT</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="Enter Subject"
            value={templateData.subject}
            onChange={(e) => handleTemplateFieldChange('subject', e.target.value)}
            variant="outlined"
            size="medium"
          />
        </Box>

        {/* Message Body */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>MESSAGE</SubTitle>
          <TextField
            placeholder="Enter your email template content here..."
            value={templateData.templateBody}
            onChange={(e) => {
              const newValue = e.target.value;
              handleTemplateFieldChange('templateBody', newValue);
              // 自动提取keywords
              const extractedKeywords = extractKeywordsFromTemplate(newValue);
              handleTemplateFieldChange('keyword', extractedKeywords);
            }}
            variant="outlined"
            multiline
            rows={12}
            sx={{
              width: "100%",
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '14px',
                backgroundColor: '#2d2d2d',
                color: '#ffffff',
                '& fieldset': {
                  borderColor: '#555',
                },
                '&:hover fieldset': {
                  borderColor: '#777',
                },
                '&.Mui-focused fieldset': {
                  borderColor: (theme) => theme.palette.primary.main,
                },
              }
            }}
          />
        </Box>

        {/* Keywords (自动提取) */}
        <Box sx={{ mb: 3 }}>
          <SubTitle>KEYWORDS</SubTitle>
          <TextField
            sx={{ width: "60%" }}
            placeholder="Keywords will be extracted automatically"
            value={templateData.keyword}
            onChange={(e) => handleTemplateFieldChange('keyword', e.target.value)}
            variant="outlined"
            size="medium"
            disabled
            // helperText="从模板内容中自动提取的占位符，如: [data], [downloadLink]"
          />
        </Box>

        {/* Template Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <SaveButton 
            variant="contained" 
            onClick={handleSaveTemplate}
            disabled={loading || !templateData.subject || !templateData.templateBody}
          >
            {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
            {currentTemplateId ? 'Update Template' : 'Save Template'}
          </SaveButton>
        </Box>
      </SectionCard>

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