import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SectionCard, SectionTitle, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import templateApi from '../services/templateApi';
import { selectCurrentLanguage } from '../store/slices/themesSlice';
import { createNotification, updateThemeWithLocale, validateBrandData } from '../utils/themeUpdateUtils';

// Styled Components
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

const ConfigSection = styled(Box)(() => ({
  marginBottom: 32,
}));

const CheckboxGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}));

const TwoColumnLayout = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
}));

function ThemeConfiguration() {
  const theme = useTheme();
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  
  // State for demo purposes
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [activeFunctionality, setActiveFunctionality] = useState({
    brandBook: true,
    derivateManagement: true,
    feature1: false,
    feature2: false,
    feature3: false,
    feature4: false,
    feature5: false,
    feature6: false,
  });

  const [selectedDataSheet, setSelectedDataSheet] = useState(null); // 存储选中的模板对象 {id, name}
  const [pimConnector, setPimConnector] = useState('Informatica');
  const [serverUrl, setServerUrl] = useState('');
  const [dataSheetTemplates, setDataSheetTemplates] = useState([]);
  const [loadingDataSheets, setLoadingDataSheets] = useState(false);

  // 获取 DataSheet 类型的模板列表
  useEffect(() => {
    const fetchDataSheetTemplates = async () => {
      try {
        setLoadingDataSheets(true);
        const dataSheetTypeId = await templateApi.getTypeId('DataSheet');
        
        if (!dataSheetTypeId) {
          console.warn('Cannot get DataSheet typeId');
        }

        // 获取所有模板（从 /main/publication/templates?tenant=Kendo&theme=kendo 接口）
        const allTemplates = await templateApi.getTemplates();
        
        const filteredTemplates = allTemplates.filter(
          template => template.typeId === (dataSheetTypeId || 3)
        );

        console.log('DataSheet templates fetched successfully:', filteredTemplates);
        setDataSheetTemplates(filteredTemplates);
      } catch (error) {
        console.error('Error fetching DataSheet templates:', error);
        setDataSheetTemplates([]);
      } finally {
        setLoadingDataSheets(false);
      }
    };

    fetchDataSheetTemplates();
  }, []);

  // 从当前品牌数据中加载 mainDataSheet 配置
  useEffect(() => {
    if (currentBrand && dataSheetTemplates.length > 0 && !selectedDataSheet) {
      // 从 mainDataSheet component 字段读取
      const mainDataSheet = currentBrand.strapiData?.mainDataSheet;
      
      if (mainDataSheet?.dataSheetId && mainDataSheet?.dataSheetName) {
        // 查找匹配的模板
        const matchedTemplate = dataSheetTemplates.find(
          t => t.id === mainDataSheet.dataSheetId && t.name === mainDataSheet.dataSheetName
        );
        
        if (matchedTemplate) {
          setSelectedDataSheet({ id: matchedTemplate.id, name: matchedTemplate.name });
        } else {
          // 如果找不到完全匹配的，尝试只匹配 id 或 name
          const templateById = dataSheetTemplates.find(t => t.id === mainDataSheet.dataSheetId);
          const templateByName = dataSheetTemplates.find(t => t.name === mainDataSheet.dataSheetName);
          const fallbackTemplate = templateById || templateByName || dataSheetTemplates[0];
          setSelectedDataSheet({ id: fallbackTemplate.id, name: fallbackTemplate.name });
        }
      } else {
        // 如果没有 mainDataSheet，使用第一个模板作为默认值
        if (dataSheetTemplates.length > 0) {
          setSelectedDataSheet({ id: dataSheetTemplates[0].id, name: dataSheetTemplates[0].name });
        }
      }
    } else if (dataSheetTemplates.length > 0 && !selectedDataSheet && !currentBrand) {
      // 如果没有品牌数据，使用第一个模板作为默认值
      setSelectedDataSheet({ id: dataSheetTemplates[0].id, name: dataSheetTemplates[0].name });
    }
  }, [currentBrand, dataSheetTemplates, selectedDataSheet]);

  // Handlers
  const handleFunctionalityChange = (key) => {
    setActiveFunctionality(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDataSheetChange = (templateId) => {
    const selectedTemplate = dataSheetTemplates.find(t => t.id === parseInt(templateId));
    if (selectedTemplate) {
      setSelectedDataSheet({ id: selectedTemplate.id, name: selectedTemplate.name });
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('Saving Theme Configuration configuration...');

      if (!selectedDataSheet) {
        throw new Error('Please select a DataSheet template');
      }

      // 构建 mainDataSheet component 字段数据
      // 只包含 dataSheetId 和 dataSheetName，不包含 id
      const mainDataSheetData = {
        dataSheetId: selectedDataSheet.id,
        dataSheetName: selectedDataSheet.name
      };

      const updateData = {
        mainDataSheet: mainDataSheetData
      };

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Theme Configuration配置'
      });

      setNotification(createNotification(true, 'Theme Configuration saved successfully!'));
    } catch (error) {
      console.error('Error saving Theme Configuration:', error);
      setNotification(createNotification(false, `Save failed: ${error.message}`));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Activate Functionality */}
      <SectionCard>
        <SectionTitle>Activate Functionality</SectionTitle>
        
        <TwoColumnLayout>
          {/* Left Column */}
          <CheckboxGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.brandBook}
                  onChange={() => handleFunctionalityChange('brandBook')}
                  sx={{ 
                    color: theme.palette.primary.main ,
                    '&.Mui-checked': {
                      color: theme.palette.primary.main ,
                    },
                  }}
                />
              }
              label="Brand Book"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.derivateManagement}
                  onChange={() => handleFunctionalityChange('derivateManagement')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Derivate Management"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature1}
                  onChange={() => handleFunctionalityChange('feature1')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 1"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature2}
                  onChange={() => handleFunctionalityChange('feature2')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 2"
              sx={{ mb: 1 }}
            />
          </CheckboxGroup>

          {/* Right Column */}
          <CheckboxGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature3}
                  onChange={() => handleFunctionalityChange('feature3')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 3"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature4}
                  onChange={() => handleFunctionalityChange('feature4')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 4"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature5}
                  onChange={() => handleFunctionalityChange('feature5')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 5"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={activeFunctionality.feature6}
                  onChange={() => handleFunctionalityChange('feature6')}
                  sx={{ 
                    color: theme.palette.primary.main || '#ff6600',
                    '&.Mui-checked': {
                      color: theme.palette.primary.main || '#ff6600',
                    },
                  }}
                />
              }
              label="Feature 6"
              sx={{ mb: 1 }}
            />
          </CheckboxGroup>
        </TwoColumnLayout>
      </SectionCard>

      {/* Data Sheet */}
      <SectionCard>
        <SectionTitle>Data Sheet</SectionTitle>
        
        <Box sx={{ mb: 3 }}>
          <SubTitle>SELECT MAIN DATA SHEET</SubTitle>
          <Select
            fullWidth
            value={selectedDataSheet?.id || ''}
            onChange={(e) => handleDataSheetChange(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mt: 1 }}
            disabled={loadingDataSheets}
          >
            {loadingDataSheets ? (
              <MenuItem value="" disabled>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Loading...
              </MenuItem>
            ) : dataSheetTemplates.length === 0 ? (
              <MenuItem value="" disabled>
                No DataSheet templates
              </MenuItem>
            ) : (
              dataSheetTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))
            )}
          </Select>
        </Box>
      </SectionCard>

      {/* Settings Control */}
      <SectionCard>
        <SectionTitle>Settings Control</SectionTitle>
        <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Settings control configuration area
          </Typography>
        </Box>
      </SectionCard>

      {/* Filter Logic */}
      <SectionCard>
        <SectionTitle>Filter Logic</SectionTitle>
        <Box sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Filter logic configuration area
          </Typography>
        </Box>
      </SectionCard>

      {/* PIM Settings */}
      <SectionCard>
        <SectionTitle>PIM Settings</SectionTitle>
        
        <TwoColumnLayout>
          {/* PIM Connector */}
          <Box>
            <SubTitle>PIM CONNECTOR</SubTitle>
            <Select
              fullWidth
              value={pimConnector}
              onChange={(e) => setPimConnector(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
            >
              <MenuItem value="Informatica">Informatica</MenuItem>
              <MenuItem value="SAP">SAP</MenuItem>
              <MenuItem value="Oracle">Oracle</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </Box>

          {/* Server URL API */}
          <Box>
            <SubTitle>SERVER URL API</SubTitle>
            <TextField
              fullWidth
              placeholder="Enter API"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
            />
          </Box>
        </TwoColumnLayout>
      </SectionCard>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
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

export default ThemeConfiguration;
