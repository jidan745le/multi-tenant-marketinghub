import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { selectThemesLoading } from '../store/slices/themesSlice';

// 样式化组件
const SectionTitle = styled(Typography)(() => ({
  fontSize: '1.2rem',
  fontWeight: 500,
  marginBottom: 16,
}));

const ImagePreviewBox = styled(Box)(() => ({
  width: '100%',
  height: 120,
  border: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
  position: 'relative',
  borderRadius: 4,
  overflow: 'hidden',
}));

const EditButton = styled(Button)(() => ({
  position: 'absolute',
  right: 8,
  bottom: 8,
  minWidth: 'auto',
  width: 32,
  height: 32,
  padding: 0,
}));

const DeleteButton = styled(Button)(() => ({
  position: 'absolute',
  right: 48,
  bottom: 8,
  minWidth: 'auto',
  width: 32,
  height: 32,
  padding: 0,
  backgroundColor: '#f44336',
  '&:hover': {
    backgroundColor: '#d32f2f',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SectionCard = styled(Paper)(() => ({
  padding: 24,
  marginBottom: 24,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

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
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
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

// 图片上传预览组件
const ImageUpload = ({ title, image, logoType, isUploading, onUpload, onDelete }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && onUpload) {
      await onUpload(file, logoType);
    }
  };

  const handleEdit = () => {
    document.getElementById(`file-input-${logoType}`).click();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(logoType);
    }
  };

  const handleImageError = () => {
    console.error('图片加载失败 (可能是CORS问题):', image);
  };

  return (
    <Box>
      <ImagePreviewBox>
        {isUploading ? (
          <CircularProgress />
        ) : image ? (
          <>
            <img
              src={image}
              alt={title}
              onError={handleImageError}
              onLoad={() => {
                console.log('图片加载成功:', image);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            <EditButton
              variant="contained"
              color="primary"
              onClick={handleEdit}
              size="small"
            >
              <EditIcon fontSize="small" />
            </EditButton>
            <DeleteButton
              variant="contained"
              onClick={handleDelete}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </DeleteButton>
          </>
        ) : (
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload {title}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        )}
        <VisuallyHiddenInput
          id={`file-input-${logoType}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </ImagePreviewBox>
    </Box>
  );
};

function ThemeGeneralSettings() {
  const isLoading = useSelector(selectThemesLoading);
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
      if (!currentBrand) {
        alert('未找到当前品牌数据');
        return;
      }

      if (!currentBrand.strapiData?.documentId) {
        alert('未找到品牌的 documentId');
        return;
      }

      console.log('🔄 开始保存Theme General Settings配置...');

      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        alert('Strapi 配置缺失');
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
        subtitle: loginSubtitle || currentBrand.login?.subtitle || '',
        background: currentBrand.login?.background || null
      };

      // 准备更新数据
      const updateData = {
        languages: selectedLanguageDocuments,
        login: loginData
      };

      // 如果有新上传的登录背景图片，更新 login.background
      if (uploadedImageIds.loginBg) {
        updateData.login = {
          ...updateData.login,
          background: uploadedImageIds.loginBg
        };
      } else if (currentBrand.strapiData?.login?.background?.id) {
        updateData.login = {
          ...updateData.login,
          background: currentBrand.strapiData.login.background.id
        };
      }

      // 如果有翻译数据变化，更新 translations
      if (hasTranslationChanges && Object.keys(translationsData).length > 0) {
        updateData.translations = translationsData;
      } else if (currentBrand.strapiData?.translations) {
        updateData.translations = currentBrand.strapiData.translations;
      }

      console.log('准备更新的Theme General Settings数据:', updateData);

      // 调用 Strapi API 更新 themes
      const response = await fetch(`${strapiBaseUrl}/api/themes/${currentBrand.strapiData.documentId}`, {
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
      alert('Theme General Settings配置保存成功！');

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
      alert(`保存失败: ${error.message}`);
    }
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
      if (currentBrand.login?.background?.url) {
        const loginBgUrl = `${baseUrl}${currentBrand.login.background.url}`;
        setLoginBackgroundPreview(loginBgUrl);
      } else if (currentBrand.strapiData?.login?.background?.url) {
        const loginBgUrl = `${baseUrl}${currentBrand.strapiData.login.background.url}`;
        setLoginBackgroundPreview(loginBgUrl);
      } else {
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

  const themeColors = currentBrand?.theme_colors || {};
  const themeLogo = currentBrand?.theme_logo || {};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Theme General Settings
      </Typography>

      {/* Login Screen 部分 */}
      <SectionCard>
        <SectionTitle>Login Screen</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Title</Typography>
            <TextField
              fullWidth
              placeholder="title"
              value={loginTitle}
              onChange={(e) => setLoginTitle(e.target.value)}
            />

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Pre Title</Typography>
            <TextField
              fullWidth
              placeholder="pre_title"
              value={loginPretitle}
              onChange={(e) => setLoginPretitle(e.target.value)}
            />

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Subtitle</Typography>
            <TextField
              fullWidth
              placeholder="subtitle"
              value={loginSubtitle}
              onChange={(e) => setLoginSubtitle(e.target.value)}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>LOGIN BACKGROUND</Typography>
              <ImageUpload 
                title="LOGIN BACKGROUND"
                image={loginBackgroundPreview} 
                logoType="loginBg" 
                isUploading={uploadingStates.loginBg}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ImagePreviewBox sx={{ height: 350 }}>
              {/* 登录页预览 */}
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                padding: 2,
                borderRadius: 1,
                backgroundImage: loginBackgroundPreview ? `url(${loginBackgroundPreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                  padding: 2, 
                  backgroundColor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    {loginPretitle && `${loginPretitle} - `}
                    {loginTitle || `Welcome to the ${currentBrand.name} Media Portal`}
                    {loginSubtitle && ` - ${loginSubtitle}`}
                  </Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Username" 
                    sx={{ mb: 2 }}
                  />
                  <TextField 
                    fullWidth 
                    size="small" 
                    type="password"
                    placeholder="Password" 
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: themeColors.primary_color || '#ff6600',
                      '&:hover': { backgroundColor: themeColors.secondary_color || '#003366' }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </ImagePreviewBox>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Basic Data 部分 */}
      <SectionCard>
        <SectionTitle>Basic Data (ID & Name)</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>ENTERPRISE ID</Typography>
            <TextField
              fullWidth
              placeholder="Enter ID"
              defaultValue=""
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>ENTERPRISE NAME</Typography>
            <TextField
              fullWidth
              placeholder="Enter name"
              defaultValue=""
            />
          </Grid>
        </Grid>
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {strapiLanguages.map((language) => (
              <FormControlLabel 
                key={language.code}
                control={
                  <Checkbox 
                    checked={isLanguageSelected(language.code)}
                    onChange={() => handleLanguageChange(language.code)}
                  />
                } 
                label={language.label || language.name}
              />
            ))}
          </Box>
        )}
        
        <Box sx={{ mt: 3 }}>
          <AddLanguageButton variant="text" startIcon={<AddIcon />}>
            Add Language
          </AddLanguageButton>
        </Box>
      </SectionCard>

      {/* Menu 部分 (待后续开发) */}
      <SectionCard>
        <SectionTitle>Menu (To be developed later)</SectionTitle>
        <Typography variant="body2" color="text.secondary">
          Menu configuration will be available in future updates.
        </Typography>
      </SectionCard>

      {/* Translations 部分 */}
      <SectionCard>
        <SectionTitle>Translations</SectionTitle>
        
        {/* 语言选择器 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Language for Translation
          </Typography>
          <TextField
            select
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
            SelectProps={{
              native: true,
            }}
            sx={{ maxWidth: 300 }}
          >
            <option value="">Select a language...</option>
            {strapiLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label} ({language.code})
                {translationsData[language.code] ? ' ✓' : ''}
              </option>
            ))}
          </TextField>
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
          <Box sx={{ flex: 1, pr: 1 }}>
            {uploadedTranslationFile ? (
              <UploadedFileContainer>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <FileTypeBox>
                      <Typography sx={{ 
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {uploadedTranslationFile.name.split('.').pop().toUpperCase()}
                      </Typography>
                    </FileTypeBox>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333' }}>
                        {uploadedTranslationFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(uploadedTranslationFile.size / 1024).toFixed(1)} KB • Uploaded successfully
                      </Typography>
                    </Box>
                  </Box>
                  <DeleteIconButton 
                    size="small"
                    onClick={() => setUploadedTranslationFile(null)}
                  >
                    <DeleteIcon fontSize="small" />
                  </DeleteIconButton>
                </Box>

                <ReplaceUploadZone
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <CloudUploadIcon sx={{ 
                    fontSize: 32, 
                    color: '#92c020', 
                    mb: 1 
                  }} />
                  <Typography variant="body2" sx={{ 
                    color: '#92c020',
                    fontWeight: 500
                  }}>
                    Click to replace file
                  </Typography>
                </ReplaceUploadZone>

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
              </UploadedFileContainer>
            ) : (
              <DropZone
                onDragOver={handleDragOver}
                onDrop={selectedTranslationLanguage ? handleDrop : undefined}
                onClick={selectedTranslationLanguage ? () => document.getElementById('file-upload-input').click() : undefined}
                sx={{ 
                  opacity: selectedTranslationLanguage ? 1 : 0.5,
                  cursor: selectedTranslationLanguage ? 'pointer' : 'not-allowed'
                }}
              >
                <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
                  <Typography variant="h6" sx={{ 
                    color: selectedTranslationLanguage ? '#333' : '#999',
                    fontWeight: 400,
                    mb: 2,
                    fontSize: '1.1rem'
                  }}>
                    {selectedTranslationLanguage ? 'Drop your file here' : 'Select a language first'}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: selectedTranslationLanguage ? '#666' : '#999',
                    lineHeight: 1.6,
                    mb: 4,
                    fontSize: '0.9rem'
                  }}>
                    {selectedTranslationLanguage 
                      ? `Upload translation file for ${selectedTranslationLanguage}. Supports TXT and JSON formats.`
                      : 'Please select a language from the dropdown above to upload translations.'
                    }
                  </Typography>
                </Box>

                <Box sx={{ 
                  position: 'absolute',
                  bottom: 16,
                  left: 16
                }}>
                  <AttachFileIcon sx={{ 
                    color: '#ccc',
                    fontSize: 24,
                    transform: 'rotate(45deg)'
                  }} />
                </Box>

                <Box sx={{ 
                  position: 'absolute',
                  bottom: 16,
                  right: 16
                }}>
                  <UploadButton>
                    <CloudUploadIcon sx={{ 
                      color: 'white',
                      fontSize: 20
                    }} />
                  </UploadButton>
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
              </DropZone>
            )}
          </Box>

          {/* 右栏：预览区域 */}
          <Box sx={{ flex: 1, pl: 1 }}>
            <PreviewContainer>
              {uploadedTranslationFile ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <PreviewHeader>
                    <FileTypeBox sx={{ width: 24, height: 24, borderRadius: 0.5, mr: 1.5 }}>
                      <Typography sx={{ 
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {uploadedTranslationFile.name.split('.').pop().toUpperCase()}
                      </Typography>
                    </FileTypeBox>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {uploadedTranslationFile.name} (New Upload)
                    </Typography>
                  </PreviewHeader>
                  
                  <PreviewContent>
                    {translationFileContent}
                  </PreviewContent>
                </Box>
              ) : selectedTranslationLanguage ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <PreviewHeader>
                    <FileTypeBox sx={{ width: 24, height: 24, borderRadius: 0.5, mr: 1.5 }}>
                      <Typography sx={{ 
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        JSON
                      </Typography>
                    </FileTypeBox>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {selectedTranslationLanguage} Translations {isEditingTranslation ? '(Editing)' : '(Current)'}
                    </Typography>
                  </PreviewHeader>
                  
                  <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    {isEditingTranslation ? (
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 1 }}>
                        <TextField
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
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                            },
                            '& .MuiInputBase-input': {
                              height: '100% !important',
                              padding: '12px',
                              overflow: 'auto !important',
                              resize: 'none',
                            },
                          }}
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          gap: 1,
                          flexShrink: 0,
                          p: 1,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: 'grey.50'
                        }}>
                          <Button variant="outlined" onClick={cancelEditingTranslation}>
                            Cancel
                          </Button>
                          <Button variant="contained" onClick={saveEditingTranslation}>
                            Save Changes
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {translationsData[selectedTranslationLanguage] ? (
                          <>
                            <PreviewContent sx={{ flex: 1, mb: 2, minHeight: 0 }}>
                              {JSON.stringify(translationsData[selectedTranslationLanguage], null, 2)}
                            </PreviewContent>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'flex-end',
                              flexShrink: 0,
                              p: 1,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                              backgroundColor: 'grey.50'
                            }}>
                              <Button variant="outlined" onClick={startEditingTranslation}>
                                Edit Translations
                              </Button>
                            </Box>
                          </>
                        ) : (
                          <Box sx={{ 
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: 3,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              No translations available for {selectedTranslationLanguage}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                              <Button 
                                variant="contained" 
                                onClick={createNewTranslation}
                                size="small"
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
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <EmptyPreview>
                  <EmptyPreviewIcon>
                    <UploadFileIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
                  </EmptyPreviewIcon>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Select a language to edit translations
                  </Typography>
                </EmptyPreview>
              )}
            </PreviewContainer>
          </Box>
        </Box>
      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton variant="contained" onClick={handleSaveConfiguration}>
          Save Configuration
        </SaveButton>
      </Box>
    </Box>
  );
}

export default ThemeGeneralSettings; 