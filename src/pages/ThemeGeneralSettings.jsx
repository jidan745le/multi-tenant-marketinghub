import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DragDropUpload from '../components/DragDropUpload';
import { SectionCard, SectionTitle, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import { refreshThemeData } from '../services/strapiApi';
import { selectCurrentLanguage, selectThemesLoading } from '../store/slices/themesSlice';
import { createNotification } from '../utils/themeUpdateUtils';

// 动态从Redux获取语言代码到Strapi locale的映射
const getLocaleForAPI = (languageCode) => {
  try {
    // 检查是否有window.store可用
    if (typeof window !== 'undefined' && window.store) {
      const state = window.store.getState();
      const currentLangData = state.themes.languageCache[state.themes.currentLanguage];

      if (currentLangData?.languages) {
        // 在当前品牌的语言配置中查找对应的iso_639_code
        const languageInfo = currentLangData.languages.find(lang => lang.code === languageCode);
        if (languageInfo?.isoCode) {
          console.log(`🗂️ ThemeGeneralSettings从Redux获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
          return languageInfo.isoCode;
        }
      }

      // 回退：检查所有语言缓存中的数据
      for (const langCache of Object.values(state.themes.languageCache)) {
        if (langCache.languages) {
          const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
          if (languageInfo?.isoCode) {
            console.log(`🗂️ ThemeGeneralSettings从其他缓存获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
            return languageInfo.isoCode;
          }
        }
      }
    }

    // 最后回退：使用静态映射
    const staticMapping = {
      'en_GB': 'en', 'en_US': 'en', 'en_AU': 'en',
      'zh_CN': 'zh', 'zh_TW': 'zh', 'cht': 'zh', 'ch': 'zh',
      'de_DE': 'de', 'fr_FR': 'fr', 'es_ES': 'es', 'ja_JP': 'ja',
      'ko_KR': 'ko', 'it_IT': 'it', 'pt_PT': 'pt', 'ru_RU': 'ru',
      'ar_SA': 'ar', 'nl_NL': 'nl', 'pl_PL': 'pl', 'cs_CZ': 'cs',
      'da_DK': 'da', 'fi_FI': 'fi', 'hu_HU': 'hu', 'nb_NO': 'no',
      'sv_SE': 'sv', 'bg_BG': 'bg', 'hr_HR': 'hr', 'et_EE': 'et',
      'el_GR': 'el', 'lt_LT': 'lt', 'lv_LV': 'lv'
    };

    const locale = staticMapping[languageCode] || languageCode.split('_')[0] || 'en';
    console.log(`⚠️ ThemeGeneralSettings使用静态映射回退: ${languageCode} -> ${locale}`);
    return locale;

  } catch (error) {
    console.error('❌ ThemeGeneralSettings getLocaleForAPI错误:', error);
    return languageCode.split('_')[0] || 'en';
  }
};

// 样式化组件

const DropZone = styled(Box)(({ theme }) => ({
  height: '100%',
  border: '2px dashed #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  backgroundColor: '#fafafa',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
  },
}));

const UploadedFileContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
}));

const FileTypeBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
}));

const UploadButton = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const ReplaceUploadZone = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': { 
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

// Styled TextField with theme color hover
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Styled Select with theme color hover
const StyledSelect = styled(Select)(({ theme }) => ({
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

const AddLanguageButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  maxHeight: 'calc(100vh - 300px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
}));

const PreviewHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
  display: 'flex',
  alignItems: 'center',
}));

const PreviewContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflow: 'auto',
  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const EmptyPreview = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50],
}));

const EmptyPreviewIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));


function ThemeGeneralSettings() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectThemesLoading);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { currentBrand } = useBrand();

  // 状态管理
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [strapiLanguages, setStrapiLanguages] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  
  // 登录背景图片预览状态
  const [loginBackgroundPreview, setLoginBackgroundPreview] = useState(null);

  // 翻译文件上传状态
  const [uploadedTranslationFile, setUploadedTranslationFile] = useState(null);
  const [translationFileContent, setTranslationFileContent] = useState('');
  
  // 翻译数据管理
  const [translationsData, setTranslationsData] = useState({});
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState('');
  const [hasTranslationChanges, setHasTranslationChanges] = useState(false);

  // 编辑翻译内容的状态
  const [editingTranslationContent, setEditingTranslationContent] = useState('');
  const [isEditingTranslation, setIsEditingTranslation] = useState(false);
  const [translationEditError, setTranslationEditError] = useState('');

  // 配置数据状态
  const [loginPretitle, setLoginPretitle] = useState('');
  const [loginTitle, setLoginTitle] = useState('');
  const [loginSubtitle, setLoginSubtitle] = useState('');
  
  // 上传状态管理
  const [uploadingStates, setUploadingStates] = useState({
    loginBg: false
  });
  
  // 保存状态和通知
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // 跟踪已上传的图片ID
  const [uploadedImageIds, setUploadedImageIds] = useState({
    loginBg: null
  });

  // 更新图片上传成功后的ID记录
  const updateUploadedImageId = (logoType, imageId) => {
    setUploadedImageIds(prev => ({
      ...prev,
      [logoType]: imageId
    }));
  };

  // 上传文件到 Strapi
  const uploadFileToStrapi = async (file, logoType) => {
    try {
      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        throw new Error('Strapi 配置缺失');
      }

      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(`${strapiBaseUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${strapiToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const uploadedFiles = await response.json();
      console.log('✅ 图片上传成功:', uploadedFiles);
      
      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedImage = uploadedFiles[0];
        updateUploadedImageId(logoType, uploadedImage.id);
        console.log(`📝 记录${logoType}图片ID:`, uploadedImage.id);
        return uploadedImage;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      throw error;
    }
  };

  // 获取 Strapi languages 数据
  const fetchStrapiLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        console.error('Strapi 配置缺失');
        return;
      }

      console.log('🔍 获取 Strapi languages 数据...');
      
      const response = await fetch(`${strapiBaseUrl}/api/languages?pagination[pageSize]=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const languagesData = await response.json();
      console.log('✅ 获取到 Strapi languages 数据:', languagesData);
      
      const processedLanguages = languagesData.data
        .map(lang => ({
          id: lang.id,
          documentId: lang.documentId,
          code: lang.key,
          key: lang.key,
          label: lang.label,
          iso_639_code: lang.iso_639_code,
          order: lang.order || 999
        }))
        .sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.label.localeCompare(b.label);
        });

      setStrapiLanguages(processedLanguages);
      console.log('📊 处理后的语言数据:', processedLanguages);

    } catch (error) {
      console.error('❌ 获取 Strapi languages 失败:', error);
    } finally {
      setLanguagesLoading(false);
    }
  };

  // 组件加载时获取语言数据
  useEffect(() => {
    fetchStrapiLanguages();
  }, []);

  // 保存配置到 Strapi
  const handleSaveConfiguration = async () => {
    try {
      setSaving(true);
      
      if (!currentBrand) {
        setNotification(createNotification(false, '未找到当前品牌数据'));
        setSaving(false);
        return;
      }

      if (!currentBrand.strapiData?.documentId) {
        setNotification(createNotification(false, '未找到品牌的 documentId'));
        setSaving(false);
        return;
      }

      console.log('🔄 开始保存Theme General Settings配置...');

      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        setNotification(createNotification(false, 'Strapi 配置缺失'));
        return;
      }

      // 准备语言数据
      const selectedLanguageDocuments = selectedLanguages
        .map(langCode => {
          const foundLang = strapiLanguages.find(lang => lang.code === langCode);
          if (!foundLang) {
            console.warn(`未找到语言代码对应的数据: ${langCode}`);
            return null;
          }
          return foundLang.documentId;
        })
        .filter(id => id !== null);

      // 准备login数据
      const loginData = {
        pretitle: loginPretitle || currentBrand.login?.pretitle || '',
        title: loginTitle || currentBrand.login?.title || '',
        subtitle: loginSubtitle || currentBrand.login?.subtitle || ''
      };

      // 处理背景图片数据 - 需要格式化为 [documentId] 数组
      let backgroundValue = null;
      
      if (uploadedImageIds.loginBg) {
        // 如果有新上传的图片，使用新上传的图片ID
        backgroundValue = [uploadedImageIds.loginBg];
      } else if (currentBrand.login?.background?.[0]?.id) {
        // 如果有现有的背景图片，保持现有的documentId
        backgroundValue = [currentBrand.login.background[0].id];
      } else if (currentBrand.strapiData?.login?.background?.id) {
        // 回退：使用strapiData中的ID
        backgroundValue = [currentBrand.strapiData.login.background.id];
      }

      // 设置最终的login数据
      loginData.background = backgroundValue;
      
      console.log('🖼️ 背景图片处理结果:', {
        uploadedImageIds: uploadedImageIds.loginBg,
        currentBackground: currentBrand.login?.background?.[0]?.documentId,
        strapiBackground: currentBrand.strapiData?.login?.background?.id,
        finalBackground: backgroundValue
      });

      // 准备更新数据
      const updateData = {
        languages: selectedLanguageDocuments,
        login: loginData
      };

      // 如果有翻译数据变化，更新 translations
      if (hasTranslationChanges && Object.keys(translationsData).length > 0) {
        updateData.translations = translationsData;
      } else if (currentBrand.strapiData?.translations) {
        updateData.translations = currentBrand.strapiData.translations;
      }

      console.log('准备更新的Theme General Settings数据:', updateData);

      // 获取当前语言对应的locale
      const locale = getLocaleForAPI(currentLanguage);
      console.log(`🌐 更新请求: ${currentLanguage} -> locale=${locale}`);

      // 调用 Strapi API 更新 themes - 带locale参数
      const response = await fetch(`${strapiBaseUrl}/api/themes/${currentBrand.strapiData.documentId}?locale=${locale}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`
        },
        body: JSON.stringify({ data: updateData })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Theme General Settings配置保存成功:', result);
      
      // 刷新Redux中的主题数据
      console.log(`🔄 刷新${currentLanguage}语言的主题数据 (locale=${locale})`);
      await refreshThemeData(dispatch, currentLanguage);
      console.log(`✅ 刷新${currentLanguage}语言的主题数据完成`);
      
      setNotification(createNotification(true, 'Theme General Settings配置保存成功！'));

      // 清空已上传的图片ID记录
      setUploadedImageIds({
        loginBg: null
      });

      // 清空翻译相关状态
      setHasTranslationChanges(false);
      setUploadedTranslationFile(null);
      setTranslationFileContent('');

    } catch (error) {
      console.error('❌ 保存配置失败:', error);
      setNotification(createNotification(false, `保存失败: ${error.message}`));
    } finally {
      setSaving(false);
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // 处理语言勾选变化
  const handleLanguageChange = (languageCode) => {
    console.log('点击语言:', languageCode);
    
    setSelectedLanguages(prev => {
      const newSelection = prev.includes(languageCode)
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode];
      
      console.log('更新后的语言选择:', newSelection);
      return newSelection;
    });
  };

  useEffect(() => {
    if (currentBrand?.languages) {
      const languageKeys = currentBrand.languages.map(lang => lang.code);
      setSelectedLanguages(languageKeys);
    } else {
      setSelectedLanguages([]);
    }
  }, [currentBrand]);

  // 初始化配置数据状态
  useEffect(() => {
    if (currentBrand) {
      // 初始化登录页面配置
      setLoginPretitle(currentBrand.login?.pretitle || '');
      setLoginTitle(currentBrand.login?.title || '');
      setLoginSubtitle(currentBrand.login?.subtitle || '');
      
      // 初始化翻译数据
      if (currentBrand.translations) {
        setTranslationsData(currentBrand.translations);
        const availableLanguages = Object.keys(currentBrand.translations);
        if (availableLanguages.length > 0 && !selectedTranslationLanguage) {
          setSelectedTranslationLanguage(availableLanguages[0]);
        }
      } else {
        setTranslationsData({});
        setSelectedTranslationLanguage('');
      }
    }
  }, [currentBrand, selectedTranslationLanguage]);

  // 检查语言是否被选中
  const isLanguageSelected = (languageCode) => {
    return selectedLanguages.includes(languageCode);
  };

  // 初始化登录背景图片预览
  useEffect(() => {
    if (currentBrand) {
      const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
      
      // 设置 login background
      if (currentBrand.login?.background?.[0]?.url) {
        const loginBgUrl = `${baseUrl}${currentBrand.login.background[0].url}`;
        setLoginBackgroundPreview(loginBgUrl);
      }  else {
        setLoginBackgroundPreview(null);
      }
    } else {
      setLoginBackgroundPreview(null);
    }
  }, [currentBrand]);

  // 文件预览函数
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setTranslationFileContent(content);
      
      try {
        const parsedContent = JSON.parse(content);
        if (selectedTranslationLanguage) {
          setTranslationsData(prev => ({
            ...prev,
            [selectedTranslationLanguage]: parsedContent
          }));
          setHasTranslationChanges(true);
        }
      } catch (error) {
        console.warn('翻译文件不是有效的JSON格式:', error);
      }
    };
    reader.readAsText(file);
  };

  // 编辑翻译内容的相关函数
  const startEditingTranslation = () => {
    if (selectedTranslationLanguage) {
      const currentContent = translationsData[selectedTranslationLanguage] || {};
      setEditingTranslationContent(JSON.stringify(currentContent, null, 2));
      setIsEditingTranslation(true);
      setTranslationEditError('');
    }
  };

  const saveEditingTranslation = () => {
    try {
      const parsedContent = JSON.parse(editingTranslationContent);
      setTranslationsData(prev => ({
        ...prev,
        [selectedTranslationLanguage]: parsedContent
      }));
      setHasTranslationChanges(true);
      setIsEditingTranslation(false);
      setTranslationEditError('');
    } catch (error) {
      setTranslationEditError('JSON格式错误: ' + error.message);
    }
  };

  const cancelEditingTranslation = () => {
    setIsEditingTranslation(false);
    setEditingTranslationContent('');
    setTranslationEditError('');
  };

  const createNewTranslation = () => {
    if (selectedTranslationLanguage) {
      const defaultContent = {
        "nav.home": "Home",
        "common.loading": "Loading...",
        "common.save": "Save",
        "common.cancel": "Cancel"
      };
      setEditingTranslationContent(JSON.stringify(defaultContent, null, 2));
      setIsEditingTranslation(true);
      setTranslationEditError('');
    }
  };

  const handleTranslationContentChange = (event) => {
    setEditingTranslationContent(event.target.value);
    setTranslationEditError('');
  };

  // 拖拽处理函数
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    
    if (!selectedTranslationLanguage) {
      alert('Please select a language first');
      return;
    }
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!['txt', 'json'].includes(fileExtension)) {
        alert('Only TXT and JSON files are supported');
        return;
      }

      const fileItem = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        file: file
      };

      setUploadedTranslationFile(fileItem);
      previewFile(file);
    }
  };

  // 图片上传处理函数
  const handleImageUpload = async (file, logoType) => {
    console.log('开始处理图片:', logoType, file.name);
    
    setUploadingStates(prev => ({
      ...prev,
      [logoType]: true
    }));

    const blobUrl = URL.createObjectURL(file);
    setLoginBackgroundPreview(blobUrl);

    try {
      const uploadedFile = await uploadFileToStrapi(file, logoType);
      console.log('文件上传到Strapi成功:', uploadedFile);
      
      setUploadingStates(prev => ({
        ...prev,
        [logoType]: false
      }));
      
    } catch (error) {
      console.error('图片上传失败:', error);
      
      if (currentBrand) {
        const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
        setLoginBackgroundPreview(currentBrand.login?.background?.url ? `${baseUrl}${currentBrand.login.background.url}` : null);
      }
      
      setUploadingStates(prev => ({
        ...prev,
        [logoType]: false
      }));
      
      alert(`图片上传失败: ${error.message}`);
    }
  };

  // 删除图片
  const handleImageDelete = (logoType) => {
    console.log('删除图片:', logoType);
    setLoginBackgroundPreview(null);
  };

  // 辅助函数：获取完整图片URL
  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
    return relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl}`;
  };

  // 如果正在加载或数据不存在，显示加载状态
  if (isLoading || !currentBrand) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const themeColors = currentBrand?.colors || {};
  const themeLogo = currentBrand?.theme_logo || {};

  console.log('currentBrand',currentBrand, themeColors);

  return (
    <Box sx={{ p: 3 }}>
      {/* Login Screen 部分 */}
      <SectionCard>
        <SectionTitle>Login Screen</SectionTitle>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <SubTitle>TITLE</SubTitle>
            <StyledTextField
              sx={{ width: "80%" }}
              placeholder="title"
              value={loginTitle}
              onChange={(e) => setLoginTitle(e.target.value)}
            />

            <Box sx={{ mt: 3 }}>
              <SubTitle>PRE TITLE</SubTitle>
            <StyledTextField
                sx={{ width: "80%" }}
              placeholder="pre_title"
              value={loginPretitle}
              onChange={(e) => setLoginPretitle(e.target.value)}
            />
            </Box>

            <Box sx={{ mt: 3 }}>
              <SubTitle>SUBTITLE</SubTitle>
            <StyledTextField
                sx={{ width: "80%" }}
              placeholder="subtitle"
              value={loginSubtitle}
              onChange={(e) => setLoginSubtitle(e.target.value)}
            />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <SubTitle>LOGIN BACKGROUND</SubTitle>
              <DragDropUpload 
                title="LOGIN BACKGROUND"
                image={loginBackgroundPreview} 
                logoType="loginBg" 
                isUploading={uploadingStates.loginBg}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
              />
            </Box>
          </Box>
          
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box sx={{ 
              width: 800,
              height: 600,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex'
            }}>
              {/* 登录页预览 - 3:1 双列布局 */}
              
              {/* 左侧登录面板 (3/4 宽度) */}
              <Box sx={{ 
                width: '75%', 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                padding: 3,
              }}>
                {themeLogo?.url && (
                  <img 
                    src={getFullImageUrl(themeLogo.url)} 
                    alt="Login Logo" 
                    style={{ maxWidth: '200px', marginBottom: '20px' }} 
                  />
                )}
                <Box sx={{ 
                  width: '80%', 
                  maxWidth: '400px',
                  padding: 3, 
                  backgroundColor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    {loginPretitle && (
                      <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 1 }}>
                        {loginPretitle}
                      </Box>
                    )}
                    <Box sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                    {loginTitle || `Welcome to the ${currentBrand.name} Media Portal`}
                    </Box>
                    {loginSubtitle && (
                      <Box sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                        {loginSubtitle}
                      </Box>
                    )}
                  </Box>
                  <StyledTextField 
                    fullWidth 
                    size="small" 
                    placeholder="Username" 
                    sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1.2 } }}
                  />
                  <StyledTextField 
                    fullWidth 
                    size="small" 
                    type="password"
                    placeholder="Password" 
                    sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1.2 } }}
                  />
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: themeColors.primary_color || '#ff6600',
                      color: 'white',
                      fontSize: '0.9rem',
                      py: 1.2,
                      '&:hover': { 
                        backgroundColor: themeColors.primary_color || '#ff6600',
                        opacity: 0.9
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>

              {/* 右侧背景图片预览 (1/4 宽度) */}
              <Box sx={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: '#f0f0f0',
                borderLeft: '1px solid #e0e0e0',
                backgroundImage: loginBackgroundPreview ? `url(${loginBackgroundPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!loginBackgroundPreview && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: '#999',
                    fontSize: '0.8rem',
                    padding: 1
                  }}>
                    Background Preview
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </SectionCard>

 

      {/* Language 部分 */}
      <SectionCard>
        <SectionTitle>Language</SectionTitle>
        {languagesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>加载语言数据...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 4 }}>
            {(() => {
              // 按字母顺序排序语言
              const sortedLanguages = [...strapiLanguages].sort((a, b) => {
                const nameA = (a.label || a.name || '').toLowerCase();
                const nameB = (b.label || b.name || '').toLowerCase();
                return nameA.localeCompare(nameB);
              });
              
              const halfLength = Math.ceil(sortedLanguages.length / 2);
              const leftColumn = sortedLanguages.slice(0, halfLength);
              const rightColumn = sortedLanguages.slice(halfLength);
              
              return (
                <>
                  {/* 左栏 */}
                  <Box sx={{ flex: 1 }}>
                    {leftColumn.map((language) => (
                      <FormControlLabel 
                        key={language.code}
                        control={
                          <Checkbox 
                            checked={isLanguageSelected(language.code)}
                            onChange={() => handleLanguageChange(language.code)}
                          />
                        } 
                        label={language.label || language.name}
                        sx={{ display: 'block', mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  {/* 右栏 */}
                  <Box sx={{ flex: 1 }}>
                    {rightColumn.map((language) => (
                      <FormControlLabel 
                        key={language.code}
                        control={
                          <Checkbox 
                            checked={isLanguageSelected(language.code)}
                            onChange={() => handleLanguageChange(language.code)}
                          />
                        } 
                        label={language.label || language.name}
                        sx={{ display: 'block', mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              );
            })()}
          </Box>
        )}
        
        <Box sx={{ mt: 3 }}>
          <AddLanguageButton variant="text" startIcon={<AddIcon />}>
            Add Language
          </AddLanguageButton>
        </Box>
      </SectionCard>


      {/* Translations 部分 */}
      <SectionCard>
        <SectionTitle>Translations</SectionTitle>
        
        {/* 语言选择器 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Language for Translation
          </Typography>
          <StyledSelect
            fullWidth
            value={selectedTranslationLanguage}
            onChange={(e) => {
              setSelectedTranslationLanguage(e.target.value);
              if (translationsData[e.target.value]) {
                setTranslationFileContent(JSON.stringify(translationsData[e.target.value], null, 2));
              } else {
                setTranslationFileContent('');
              }
              setUploadedTranslationFile(null);
              setIsEditingTranslation(false);
              setEditingTranslationContent('');
              setTranslationEditError('');
            }}
            displayEmpty
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="">
              <Typography color="text.secondary">Select a language...</Typography>
            </MenuItem>
            {strapiLanguages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography>
                    {language.label} ({language.code})
                  </Typography>
                  {translationsData[language.code] && (
                    <CheckCircleIcon 
                      sx={{ 
                        color: 'success.main', 
                        fontSize: '1.2rem',
                        ml: 'auto'
                      }} 
                    />
                  )}
                </Box>
              </MenuItem>
            ))}
          </StyledSelect>
          {selectedTranslationLanguage && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                {translationsData[selectedTranslationLanguage] 
                  ? `Current translations available for ${selectedTranslationLanguage}` 
                  : `No translations found for ${selectedTranslationLanguage}. Upload a file to add translations.`}
              </Typography>
              {translationsData[selectedTranslationLanguage] && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete translations for ${selectedTranslationLanguage}?`)) {
                      setTranslationsData(prev => {
                        const updated = { ...prev };
                        delete updated[selectedTranslationLanguage];
                        return updated;
                      });
                      setHasTranslationChanges(true);
                      setTranslationFileContent('');
                      setUploadedTranslationFile(null);
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0, height: 400 }}>
          {/* 左栏：上传区域 */}
          <Box sx={{ flex: 1, height: 400 }}>
                <Box sx={{ 
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden'
            }}>
                      <Typography sx={{ 
                position: 'absolute',
                top: 16,
                left: 16,
                color: '#999',
                fontSize: '0.875rem',
                zIndex: 1
              }}>
                Drop your files here
                      </Typography>
              
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '0.875rem',
                textAlign: 'center',
                padding: 3,
                cursor: selectedTranslationLanguage ? 'pointer' : 'not-allowed',
                opacity: selectedTranslationLanguage ? 1 : 0.5
              }}
              onClick={selectedTranslationLanguage ? () => document.getElementById('file-upload-input').click() : undefined}
              onDragOver={handleDragOver}
              onDrop={selectedTranslationLanguage ? handleDrop : undefined}
              >
                {uploadedTranslationFile ? (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
                        {uploadedTranslationFile.name}
                      </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                      {(uploadedTranslationFile.size / 1024).toFixed(1)} KB
                      </Typography>
                    <Button
                      variant="outlined"
                    size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedTranslationFile(null);
                      }}
                  >
                      Remove
                    </Button>
                </Box>
                ) : (
                  <Box>
                    <Typography sx={{ mb: 2 }}>
                    {selectedTranslationLanguage 
                        ? `Simply drag and drop your PDF, Word (.docx) to convert them into JSON format using our document translation tool.`
                      : 'Please select a language from the dropdown above to upload translations.'
                    }
                  </Typography>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#ccc' }} />
                </Box>
                )}
                </Box>

                <input
                  id="file-upload-input"
                  type="file"
                  accept=".txt,.json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (!selectedTranslationLanguage) {
                        alert('Please select a language first');
                        e.target.value = '';
                        return;
                      }
                      setUploadedTranslationFile({ id: Date.now(), name: file.name, size: file.size, file: file });
                      previewFile(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
            </Box>
          </Box>

          {/* 右栏：预览区域 */}
          <Box sx={{ flex: 1, height: 400 }}>
            <Box sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden',
              '&:hover .edit-button': {
                opacity: 1
              }
            }}>
                    {isEditingTranslation ? (
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2
                }}>
                        <StyledTextField
                          fullWidth
                          multiline
                          variant="outlined"
                          value={editingTranslationContent}
                          onChange={handleTranslationContentChange}
                          error={!!translationEditError}
                          helperText={translationEditError}
                          sx={{
                            flex: 1,
                            minHeight: 0,
                            '& .MuiInputBase-root': {
                              height: '100%',
                              alignItems: 'flex-start',
                              fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                            },
                            '& .MuiInputBase-input': {
                              height: '100% !important',
                              padding: '12px',
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
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          gap: 1,
                    mt: 1
                  }}>
                    <Button variant="outlined" onClick={cancelEditingTranslation} size="small">
                            Cancel
                          </Button>
                                            <Button 
                          variant="contained" 
                          onClick={saveEditingTranslation} 
                          size="small" 
                          sx={{ 
                            color: 'white',
                            backgroundColor: (theme) => theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.primary.main,
                              opacity: 0.9,
                            },
                          }}
                        >
                          Save
                          </Button>
                        </Box>
                      </Box>
              ) : uploadedTranslationFile ? (
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  padding: 2,
                  fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  color: '#333'
                }}>
                  {translationFileContent}
                </Box>
              ) : selectedTranslationLanguage && translationsData[selectedTranslationLanguage] ? (
                <>
                            <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    padding: 2,
                    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    color: '#333'
                  }}>
                    {JSON.stringify(translationsData[selectedTranslationLanguage], null, 2)}
                            </Box>
                                        <Button
                        className="edit-button"
                        variant="contained"
                        size="small"
                        onClick={startEditingTranslation}
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          color: 'white',
                          backgroundColor: (theme) => theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Edit
                      </Button>
                          </>
                        ) : (
                          <Box sx={{ 
                  width: '100%',
                  height: '100%',
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                  color: '#999',
                            textAlign: 'center'
                          }}>
                  {selectedTranslationLanguage ? (
                    <>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              No translations available for {selectedTranslationLanguage}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button 
                                variant="contained" 
                                onClick={createNewTranslation}
                                size="small"
                          sx={{ color: 'white' }}
                              >
                                Create New
                              </Button>
                              <Button 
                                variant="outlined" 
                                onClick={() => document.getElementById('file-upload-input').click()}
                                size="small"
                              >
                                Upload File
                              </Button>
                            </Box>
                    </>
                  ) : (
                    <Typography variant="body2">
                      Select a language to view translations
                    </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
          </Box>
        </Box>
      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSaveConfiguration}
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

export default ThemeGeneralSettings; 