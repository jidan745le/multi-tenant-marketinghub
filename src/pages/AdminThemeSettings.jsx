import { Construction } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useBrand } from '../hooks/useBrand';
import { selectLanguages, selectThemesLoading } from '../store/slices/themesSlice';

// 样式化组件
const SectionTitle = styled(Typography)(() => ({
  fontSize: '1.2rem',
  fontWeight: 500,
  marginBottom: 16,
}));

const ColorBox = styled(Box)(({ bgColor }) => ({
  width: '100%',
  height: 120,
  backgroundColor: bgColor,
  marginBottom: 8,
  borderRadius: 4,
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

const AdminSidebar = styled(Box)(() => ({
  width: 220,
  flexShrink: 0,
  borderRight: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  height: '100%',
  overflowY: 'auto',
}));

const ContentArea = styled(Box)(() => ({
  flexGrow: 1,
  padding: 24,
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#f5f5f5',
}));

const SidebarMenuItem = styled(ListItem)(({ theme, active }) => ({
  padding: '8px 16px',
  cursor: 'pointer',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

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
  maxHeight: 'calc(100vh - 300px)', // 限制最大高度，避免溢出
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden', // 改回hidden，由内部组件控制滚动
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

  // 图片上传预览组件 - 支持Strapi图片和blob预览
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

    // 处理图片显示 - blob URL直接显示，Strapi URL忽略CORS错误
    const handleImageError = () => {
      console.error('图片加载失败 (可能是CORS问题):', image);
      // 对于CORS错误，我们不做任何处理，因为这是预期的
      // 只有blob URL才能正常显示
    };

    return (
      <Grid item xs={12} md={6}>
        <SectionTitle>{title}</SectionTitle>
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
      </Grid>
    );
  };

// 管理后台菜单项
const menuItems = [
  { id: 'look-feel', label: 'Look & Feel', icon: <FavoriteIcon /> },
  { id: 'theme-general-settings', label: 'Theme General Settings', icon: <SettingsIcon /> },
  { id: 'theme-configuration', label: 'Theme Configuration', icon: <ColorLensIcon /> },
  { id: 'derivate-management', label: 'Derivate Management', icon: <FeaturedPlayListIcon /> },
  { id: 'legal', label: 'Legal', icon: <FeaturedPlayListIcon /> },
  { id: 'communication-email', label: 'Communication & Email', icon: <FeaturedPlayListIcon /> },
  { id: 'data-sheet-config', label: 'Data Sheet Config', icon: <FeaturedPlayListIcon /> },
  { id: 'mass-download', label: 'Mass Download', icon: <DownloadIcon /> },
  { id: 'social-profile', label: 'Social Profile', icon: <FeaturedPlayListIcon /> },
];

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM4 20V15H6V18H18V15H20V20H4Z" fill="currentColor"/>
    </svg>
  );
}

// UnderConstruction组件 - 简化版
function UnderConstructionContent() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <Construction
          sx={{
            fontSize: 120,
            color: 'primary.main',
            mb: 3
          }}
        />
        
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 2
          }}
        >
          {t('under.construction.title', 'Under Construction')}
        </Typography>
        
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: '600px'
          }}
        >
          {t('under.construction.description', 'This section is currently being developed and will be available soon.')}
        </Typography>
      </Box>
    </Container>
  );
}


// 管理后台主题设置页面组件
function AdminThemeSettings() {
  const allLanguages = useSelector(selectLanguages);
  const isLoading = useSelector(selectThemesLoading);
  const { currentBrand } = useBrand();

  // 状态管理
  const [activeMenuItem, setActiveMenuItem] = useState('theme-general');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [strapiLanguages, setStrapiLanguages] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  
  // 图片预览状态
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [onwhiteLogoPreview, setOnwhiteLogoPreview] = useState(null);
  const [oncolorLogoPreview, setOncolorLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [loginBackgroundPreview, setLoginBackgroundPreview] = useState(null);

  // 翻译文件上传状态
  const [uploadedTranslationFile, setUploadedTranslationFile] = useState(null);
  const [translationFileContent, setTranslationFileContent] = useState('');
  
  // 翻译数据管理
  const [translationsData, setTranslationsData] = useState({});
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] = useState('');
  const [hasTranslationChanges, setHasTranslationChanges] = useState(false);

  // 新增：编辑翻译内容的状态
  const [editingTranslationContent, setEditingTranslationContent] = useState('');
  const [isEditingTranslation, setIsEditingTranslation] = useState(false);
  const [translationEditError, setTranslationEditError] = useState('');

  // 配置数据状态
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [loginPretitle, setLoginPretitle] = useState('');
  const [loginTitle, setLoginTitle] = useState('');
  const [loginSubtitle, setLoginSubtitle] = useState('');
  
  // 上传状态管理
  const [uploadingStates, setUploadingStates] = useState({
    theme_logo: false,
    onwhite_logo: false,
    oncolor_logo: false,
    favicon: false,
    loginBg: false
  });

  // 跟踪已上传的图片ID
  const [uploadedImageIds, setUploadedImageIds] = useState({
    theme_logo: null,
    onwhite_logo: null,
    oncolor_logo: null,
    favicon: null,
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
      
      // 记录上传的图片ID，用于后续更新主题配置
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
      
      // 获取所有语言数据，可能需要分页
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
      
      // 处理语言数据，按 order 排序，然后按 label 排序
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
          // 先按 order 排序，如果 order 相同则按 label 排序
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

      console.log('🔄 开始保存完整配置...');
      console.log('当前品牌:', currentBrand);
      console.log('选中的语言:', selectedLanguages);
      console.log('可用的Strapi语言:', strapiLanguages);

      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        alert('Strapi 配置缺失');
        return;
      }

      // 1. 准备语言数据 - 将选中的语言代码映射为documentId数组
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

      console.log('选中语言的 documentIds:', selectedLanguageDocuments);

      // 2. 准备颜色数据
      const colorData = {
        primary_color: primaryColor || currentBrand.colors?.primary_color,
        secondary_color: secondaryColor || currentBrand.colors?.secondary_color
      };

      // 3. 准备login数据（如果有修改）
      const loginData = {
        pretitle: loginPretitle || currentBrand.login?.pretitle || '',
        title: loginTitle || currentBrand.login?.title || '',
        subtitle: loginSubtitle || currentBrand.login?.subtitle || '',
        background: currentBrand.login?.background || null
      };

      // 4. 准备更新数据 - 包含所有配置项
      const updateData = {
        languages: selectedLanguageDocuments,
        theme_colors: colorData,
        login: loginData
      };

      // 5. 添加 logo 更新数据
      // 如果有新上传的 theme_logo，更新主 logo
      if (uploadedImageIds.theme_logo) {
        updateData.theme_logo = uploadedImageIds.theme_logo;
        console.log('🖼️ 更新 theme_logo:', uploadedImageIds.theme_logo);
      }

      // 处理 theme_logos 中的各个 logo
      const themeLogosUpdate = {};
      let hasThemeLogosUpdate = false;

      // 如果没有新上传的图片，保留现有的图片ID
      const currentThemeLogos = currentBrand.strapiData?.theme_logos;

      if (uploadedImageIds.onwhite_logo) {
        themeLogosUpdate.onwhite_logo = uploadedImageIds.onwhite_logo;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 更新 onwhite_logo:', uploadedImageIds.onwhite_logo);
      } else if (currentThemeLogos?.onwhite_logo?.id) {
        themeLogosUpdate.onwhite_logo = currentThemeLogos.onwhite_logo.id;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 保留现有 onwhite_logo:', currentThemeLogos.onwhite_logo.id);
      }

      if (uploadedImageIds.oncolor_logo) {
        themeLogosUpdate.oncolor_logo = uploadedImageIds.oncolor_logo;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 更新 oncolor_logo:', uploadedImageIds.oncolor_logo);
      } else if (currentThemeLogos?.oncolor_logo?.id) {
        themeLogosUpdate.oncolor_logo = currentThemeLogos.oncolor_logo.id;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 保留现有 oncolor_logo:', currentThemeLogos.oncolor_logo.id);
      }

      if (uploadedImageIds.favicon) {
        themeLogosUpdate.favicon = uploadedImageIds.favicon;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 更新 favicon:', uploadedImageIds.favicon);
      } else if (currentThemeLogos?.favicon?.id) {
        themeLogosUpdate.favicon = currentThemeLogos.favicon.id;
        hasThemeLogosUpdate = true;
        console.log('🖼️ 保留现有 favicon:', currentThemeLogos.favicon.id);
      }

      // 如果有 theme_logos 的更新，添加到更新数据中
      if (hasThemeLogosUpdate) {
        // 需要保持现有的 theme_logos ID，只更新特定字段
        updateData.theme_logos = {
          ...themeLogosUpdate
        };
        console.log('🖼️ theme_logos 更新数据:', updateData.theme_logos);
      }

      // 6. 如果有新上传的登录背景图片，更新 login.background
      if (uploadedImageIds.loginBg) {
        updateData.login = {
          ...updateData.login,
          background: uploadedImageIds.loginBg
        };
        console.log('🖼️ 更新 login background:', uploadedImageIds.loginBg);
      } else if (currentBrand.strapiData?.login?.background?.id) {
        // 保留现有的登录背景图片ID
        updateData.login = {
          ...updateData.login,
          background: currentBrand.strapiData.login.background.id
        };
        console.log('🖼️ 保留现有 login background:', currentBrand.strapiData.login.background.id);
      }

      // 7. 如果有翻译数据变化，更新 translations
      if (hasTranslationChanges && Object.keys(translationsData).length > 0) {
        updateData.translations = translationsData;
        console.log('🌍 更新翻译数据:', translationsData);
      } else if (currentBrand.strapiData?.translations) {
        // 保留现有的翻译数据
        updateData.translations = currentBrand.strapiData.translations;
        console.log('🌍 保留现有翻译数据');
      }

      console.log('准备更新的完整数据:', updateData);
      console.log('目标主题 documentId:', currentBrand.strapiData.documentId);

      // 调用 Strapi API 更新 themes
      const response = await fetch(`${strapiBaseUrl}/api/themes/${currentBrand.strapiData.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${strapiToken}`
        },
        body: JSON.stringify({ data: updateData })
      });

      console.log('API 响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 错误响应:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ 完整配置保存成功:', result);
      alert('配置保存成功！');

      // 清空已上传的图片ID记录
      setUploadedImageIds({
        theme_logo: null,
        onwhite_logo: null,
        oncolor_logo: null,
        favicon: null,
        loginBg: null
      });

      // 清空翻译相关状态
      setHasTranslationChanges(false);
      setUploadedTranslationFile(null);
      setTranslationFileContent('');

      // 重新获取主题数据以更新界面
      // dispatch(fetchThemes());

    } catch (error) {
      console.error('❌ 保存配置失败:', error);
      alert(`保存失败: ${error.message}`);
    }
  };

  // 测试调用 Strapi languages 接口
  const testStrapiLanguagesAPI = async () => {
    try {
      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        console.error('Strapi 配置缺失');
        return;
      }

      console.log('🔍 尝试调用 Strapi languages 接口...');
      
      const response = await fetch(`${strapiBaseUrl}/api/languages`, {
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
      console.log('✅ Strapi languages 接口返回数据:', languagesData);
      console.log('📊 数据详情:', {
        数据条数: languagesData.data?.length || 0,
        第一条数据: languagesData.data?.[0] || null,
        完整响应: languagesData
      });

    } catch (error) {
      console.error('❌ 调用 Strapi languages 接口失败:', error);
    }
  };

  // 组件加载时测试接口
  useEffect(() => {
    // 延迟1秒调用，确保组件完全加载
    const timer = setTimeout(() => {
      testStrapiLanguagesAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 获取当前主题
  const currentTheme = currentBrand;

  // 处理语言勾选变化
  const handleLanguageChange = (languageCode) => {
    console.log('点击语言:', languageCode);
    console.log('当前选中的语言:', selectedLanguages);
    
    setSelectedLanguages(prev => {
      const newSelection = prev.includes(languageCode)
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode];
      
      console.log('更新后的语言选择:', newSelection);
      return newSelection;
    });
  };

  useEffect(() => {
    if (currentTheme?.languages) {
      // 修复：使用正确的语言数据结构
      const languageKeys = currentTheme.languages.map(lang => lang.code);
      console.log('设置选中的语言:', languageKeys);
      console.log('当前主题的语言数据:', currentTheme.languages);
      setSelectedLanguages(languageKeys);
    } else {
      console.log('当前主题没有语言数据');
      setSelectedLanguages([]);
    }
  }, [currentTheme]);

  // 初始化配置数据状态
  useEffect(() => {
    if (currentBrand) {
      // 初始化颜色配置
      setPrimaryColor(currentBrand.colors?.primary_color || '');
      setSecondaryColor(currentBrand.colors?.secondary_color || '');
      
      // 初始化登录页面配置
      setLoginPretitle(currentBrand.login?.pretitle || '');
      setLoginTitle(currentBrand.login?.title || '');
      setLoginSubtitle(currentBrand.login?.subtitle || '');
      
      // 初始化翻译数据
      if (currentBrand.translations) {
        setTranslationsData(currentBrand.translations);
        // 设置默认选中第一个可用的语言
        const availableLanguages = Object.keys(currentBrand.translations);
        if (availableLanguages.length > 0 && !selectedTranslationLanguage) {
          setSelectedTranslationLanguage(availableLanguages[0]);
        }
        console.log('初始化翻译数据:', {
          languages: availableLanguages,
          defaultLanguage: availableLanguages[0]
        });
      } else {
        setTranslationsData({});
        setSelectedTranslationLanguage('');
      }
      
      console.log('初始化配置数据:', {
        colors: currentBrand.colors,
        login: currentBrand.login,
        translations: currentBrand.translations
      });
    }
  }, [currentBrand, selectedTranslationLanguage]);

  useEffect(() => {
    console.log('所有可用语言:', allLanguages);
    console.log('Strapi语言数据:', strapiLanguages);
    console.log('当前选中的语言:', selectedLanguages);
  }, [allLanguages, strapiLanguages, selectedLanguages]);

  // 检查语言是否被选中 - 使用 selectedLanguages 状态而不是主题数据
  const isLanguageSelected = (languageCode) => {
    return selectedLanguages.includes(languageCode);
  };

  // 初始化图片预览 - 从Redux回显已存在的图片
  useEffect(() => {
    console.log('初始化图片预览，currentBrand:', currentBrand);
    if (currentBrand) {
      const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
      
      // 修复：设置 brand logo - 在Redux中存储为 logo 字段
      if (currentBrand.logo?.url) {
        const logoUrl = `${baseUrl}${currentBrand.logo.url}`;
        console.log('设置 Brand Logo (从logo字段):', logoUrl);
        setBrandLogoPreview(logoUrl);
      } else if (currentBrand.strapiData?.theme_logo?.url) {
        const logoUrl = `${baseUrl}${currentBrand.strapiData.theme_logo.url}`;
        console.log('设置 Brand Logo (从strapiData.theme_logo):', logoUrl);
        setBrandLogoPreview(logoUrl);
      } else {
        console.log('未找到 Brand Logo 数据');
        setBrandLogoPreview(null);
      }
      
      // 设置 onwhite logo
      if (currentBrand.onwhite_logo?.url) {
        const onwhiteUrl = `${baseUrl}${currentBrand.onwhite_logo.url}`;
        console.log('设置 Onwhite Logo:', onwhiteUrl);
        setOnwhiteLogoPreview(onwhiteUrl);
      } else if (currentBrand.strapiData?.theme_logos?.onwhite_logo?.url) {
        const onwhiteUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.onwhite_logo.url}`;
        console.log('设置 Onwhite Logo (从strapiData):', onwhiteUrl);
        setOnwhiteLogoPreview(onwhiteUrl);
      } else {
        setOnwhiteLogoPreview(null);
      }
      
      // 设置 oncolor logo
      if (currentBrand.oncolor_logo?.url) {
        const oncolorUrl = `${baseUrl}${currentBrand.oncolor_logo.url}`;
        console.log('设置 Oncolor Logo:', oncolorUrl);
        setOncolorLogoPreview(oncolorUrl);
      } else if (currentBrand.strapiData?.theme_logos?.oncolor_logo?.url) {
        const oncolorUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.oncolor_logo.url}`;
        console.log('设置 Oncolor Logo (从strapiData):', oncolorUrl);
        setOncolorLogoPreview(oncolorUrl);
      } else {
        setOncolorLogoPreview(null);
      }
      
      // 设置 favicon
      if (currentBrand.favicon?.url) {
        const faviconUrl = `${baseUrl}${currentBrand.favicon.url}`;
        console.log('设置 Favicon:', faviconUrl);
        setFaviconPreview(faviconUrl);
      } else if (currentBrand.strapiData?.theme_logos?.favicon?.url) {
        const faviconUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.favicon.url}`;
        console.log('设置 Favicon (从strapiData):', faviconUrl);
        setFaviconPreview(faviconUrl);
      } else {
        setFaviconPreview(null);
      }
      
      // 设置 login background
      if (currentBrand.login?.background?.url) {
        const loginBgUrl = `${baseUrl}${currentBrand.login.background.url}`;
        console.log('设置 Login Background:', loginBgUrl);
        setLoginBackgroundPreview(loginBgUrl);
      } else if (currentBrand.strapiData?.login?.background?.url) {
        const loginBgUrl = `${baseUrl}${currentBrand.strapiData.login.background.url}`;
        console.log('设置 Login Background (从strapiData):', loginBgUrl);
        setLoginBackgroundPreview(loginBgUrl);
      } else {
        setLoginBackgroundPreview(null);
      }
    } else {
      // 如果没有品牌数据，重置所有图片状态
      setBrandLogoPreview(null);
      setOnwhiteLogoPreview(null);
      setOncolorLogoPreview(null);
      setFaviconPreview(null);
      setLoginBackgroundPreview(null);
    }
  }, [currentBrand]);

  // 文件预览函数
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setTranslationFileContent(content);
      
      // 尝试解析文件内容并更新translations数据
      try {
        const parsedContent = JSON.parse(content);
        if (selectedTranslationLanguage) {
          setTranslationsData(prev => ({
            ...prev,
            [selectedTranslationLanguage]: parsedContent
          }));
          setHasTranslationChanges(true);
          console.log('翻译文件解析成功，更新语言:', selectedTranslationLanguage);
        }
      } catch (error) {
        console.warn('翻译文件不是有效的JSON格式:', error);
      }
    };
    reader.readAsText(file);
  };

  // 新增：编辑翻译内容的相关函数
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
      console.log('直接编辑的翻译内容已保存:', selectedTranslationLanguage);
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

  // 图片上传处理函数 - blob预览 + 调用上传接口
  const handleImageUpload = async (file, logoType) => {
    console.log('开始处理图片:', logoType, file.name);
    
    // 设置上传状态
    setUploadingStates(prev => ({
      ...prev,
      [logoType]: true
    }));

    // 先创建blob URL立即显示预览（避免CORS问题）
    const blobUrl = URL.createObjectURL(file);
    console.log('创建blob URL用于立即预览:', blobUrl);
    
    // 立即设置blob预览
    switch (logoType) {
      case 'theme_logo':
        setBrandLogoPreview(blobUrl);
        break;
      case 'onwhite_logo':
        setOnwhiteLogoPreview(blobUrl);
        break;
      case 'oncolor_logo':
        setOncolorLogoPreview(blobUrl);
        break;
      case 'favicon':
        setFaviconPreview(blobUrl);
        break;
      case 'loginBg':
        setLoginBackgroundPreview(blobUrl);
        break;
    }

    try {
      // 后台调用上传接口（但不用返回的URL显示）
      const uploadedFile = await uploadFileToStrapi(file, logoType);
      console.log('文件上传到Strapi成功:', uploadedFile);
      
      // 可以在这里触发Redux更新或保存文件ID供后续保存配置时使用
      // TODO: 保存uploadedFile.id到某个状态，供保存配置时使用
      
      // 清除上传状态
      setUploadingStates(prev => ({
        ...prev,
        [logoType]: false
      }));
      
      console.log('图片处理完成 - 预览使用blob，文件已上传到Strapi');
      
    } catch (error) {
      console.error('图片上传失败:', error);
      
      // 上传失败，恢复原始图片
      if (currentBrand) {
        const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
        switch (logoType) {
          case 'theme_logo': {
            setBrandLogoPreview(currentBrand.logo?.url ? `${baseUrl}${currentBrand.logo.url}` : null);
            break;
          }
          case 'onwhite_logo': {
            const onwhiteUrl = currentBrand.onwhite_logo?.url || currentBrand.strapiData?.theme_logos?.onwhite_logo?.url;
            setOnwhiteLogoPreview(onwhiteUrl ? `${baseUrl}${onwhiteUrl}` : null);
            break;
          }
          case 'oncolor_logo': {
            const oncolorUrl = currentBrand.oncolor_logo?.url || currentBrand.strapiData?.theme_logos?.oncolor_logo?.url;
            setOncolorLogoPreview(oncolorUrl ? `${baseUrl}${oncolorUrl}` : null);
            break;
          }
          case 'favicon': {
            const faviconUrl = currentBrand.favicon?.url || currentBrand.strapiData?.theme_logos?.favicon?.url;
            setFaviconPreview(faviconUrl ? `${baseUrl}${faviconUrl}` : null);
            break;
          }
          case 'loginBg': {
            setLoginBackgroundPreview(currentBrand.login?.background?.url ? `${baseUrl}${currentBrand.login.background.url}` : null);
            break;
          }
        }
      }
      
      // 清除上传状态
      setUploadingStates(prev => ({
        ...prev,
        [logoType]: false
      }));
      
      alert(`图片上传失败: ${error.message}`);
    }
  };

  // 删除图片
  const handleImageDelete = (logoType) => {
    switch (logoType) {
      case 'theme_logo':
        setBrandLogoPreview(null);
        break;
      case 'onwhite_logo':
        setOnwhiteLogoPreview(null);
        break;
      case 'oncolor_logo':
        setOncolorLogoPreview(null);
        break;
      case 'favicon':
        setFaviconPreview(null);
        break;
      case 'loginBg':
        setLoginBackgroundPreview(null);
        break;
    }
    // TODO: 实现删除API调用
  };

  // 处理菜单项选择
  const handleMenuItemClick = (menuId) => {
    setActiveMenuItem(menuId);
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

  // 提取当前品牌的主题数据
  const themeColors = currentTheme?.theme_colors || {};
  const themeLogo = currentTheme?.theme_logo || {};



  // 渲染Theme General Settings内容 - 所有配置项按顺序排列
  const renderThemeGeneralSettings = () => (
    <>
      {/* Logos 部分 */}
      <SectionCard>
        <SectionTitle>Logos</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>BRAND LOGO</Typography>
                          <ImageUpload 
                title="BRAND LOGO"
                image={brandLogoPreview} 
                logoType="theme_logo" 
                isUploading={uploadingStates.theme_logo}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
              />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>ONWHITE LOGO</Typography>
            <ImageUpload 
              title="ONWHITE LOGO"
              image={onwhiteLogoPreview} 
              logoType="onwhite_logo" 
              isUploading={uploadingStates.onwhite_logo}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>ONCOLOR LOGO</Typography>
            <ImageUpload 
              title="ONCOLOR LOGO"
              image={oncolorLogoPreview} 
              logoType="oncolor_logo" 
              isUploading={uploadingStates.oncolor_logo}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Colors 部分 */}
      <SectionCard>
        <SectionTitle>Colors</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {currentBrand.name} PRIMARY
              </Typography>
              <TextField
                fullWidth
                label="Primary Color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '50px',
                    padding: '8px',
                    cursor: 'pointer'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Current: {primaryColor || themeColors.primary_color || '#ff6600'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {currentBrand.name} SECONDARY
              </Typography>
              <TextField
                fullWidth
                label="Secondary Color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    height: '50px',
                    padding: '8px',
                    cursor: 'pointer'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Current: {secondaryColor || themeColors.secondary_color || '#003366'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Favicon 部分 */}
      <SectionCard>
        <SectionTitle>Favicon</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ImageUpload 
              title="FAVICON"
              image={faviconPreview} 
              logoType="favicon" 
              isUploading={uploadingStates.favicon}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Font & Size 部分 */}
      <SectionCard>
        <SectionTitle>Font & Size</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>SELECT FONT</Typography>
            <TextField
              select
              fullWidth
              defaultValue="Roboto"
              SelectProps={{
                native: true,
              }}
            >
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>TITLE</Typography>
            <Box>
              <Typography variant="h4">Heading 1</Typography>
              <Typography variant="h5">Heading 2</Typography>
              <Typography variant="h6">Heading 3</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>BODY</Typography>
            <Box>
              <Typography variant="body1">This is a regular body text</Typography>
              <Typography variant="body2">This is a semibold body text</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>This is a bold body text</Typography>
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Login Screen 部分 */}
      <SectionCard>
        <SectionTitle>Login Screen</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Title</Typography>
            <TextField
              fullWidth
              placeholder="title"
              defaultValue={`${currentBrand.strapiData.login.title || ''}`}
            />

            <Typography variant="subtitle2" gutterBottom>Pre Title</Typography>
            <TextField
              fullWidth
              placeholder="pre_title"
              defaultValue={` ${currentBrand.strapiData.login.pre_title || ''}`}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>ENTERPRISE NAME</Typography>
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
                    src={brandLogoPreview || getFullImageUrl(themeLogo.url)} 
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
                    {`Welcome to the ${currentBrand.name} Media Portal`}
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
        <SectionTitle>Basic Data</SectionTitle>
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
        
        {/* 修改添加语言按钮 */}
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
          <TextField
            select
            fullWidth
            value={selectedTranslationLanguage}
            onChange={(e) => {
              setSelectedTranslationLanguage(e.target.value);
              // 如果选择的语言有现有数据，显示在预览中
              if (translationsData[e.target.value]) {
                setTranslationFileContent(JSON.stringify(translationsData[e.target.value], null, 2));
              } else {
                setTranslationFileContent('');
              }
              setUploadedTranslationFile(null);
              // 重置编辑状态
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
          {/* 左栏：极简上传区域 */}
          <Box sx={{ flex: 1, pr: 1 }}>
            {uploadedTranslationFile ? (
              // 显示已上传的文件信息
              <UploadedFileContainer>
                {/* 文件信息 */}
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

                {/* 重新上传提示 */}
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
              // 显示空状态上传区域
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

                {/* 左下角附件图标 */}
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

                {/* 右下角上传按钮 */}
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
                  {/* 文件头部信息 */}
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
                  
                  {/* 文件内容 */}
                  <PreviewContent>
                    {translationFileContent}
                  </PreviewContent>
                </Box>
              ) : selectedTranslationLanguage ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* 现有翻译数据头部 */}
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
                  
                  {/* 翻译内容 - 编辑模式或只读模式 */}
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
                            '& textarea': {
                              overflow: 'auto !important',
                              scrollbarWidth: 'thin',
                              '&::-webkit-scrollbar': {
                                width: '8px',
                              },
                              '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#c1c1c1',
                                borderRadius: '4px',
                                '&:hover': {
                                  background: '#a8a8a8',
                                },
                              },
                            },
                          }}
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          gap: 1,
                          flexShrink: 0, // 防止按钮被压缩
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
                              flexShrink: 0, // 防止按钮被压缩
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
          保存配置
        </SaveButton>
      </Box>
    </>
  );

  // 渲染当前选择的菜单内容
  const renderContent = () => {
    // 只有Theme General Settings是激活的，其他的都显示UnderConstruction
    if (activeMenuItem === 'theme-general-settings') {
      return renderThemeGeneralSettings();
    } else {
      return <UnderConstructionContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* 左侧边栏 */}
      <AdminSidebar>
        <List component="nav">
          {menuItems.map(item => (
            <SidebarMenuItem
              key={item.id}
              active={activeMenuItem === item.id}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemText primary={item.label} />
            </SidebarMenuItem>
          ))}
        </List>
      </AdminSidebar>

      {/* 主内容区域 */}
      <ContentArea>
        {renderContent()}
      </ContentArea>
    </Box>
  );
}

export default AdminThemeSettings;