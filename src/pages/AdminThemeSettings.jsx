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
import { selectBrands, selectLanguages, selectThemesLoading } from '../store/slices/themesSlice';

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
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
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
const ImageUpload = ({ initialImage = null, height = 120, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // 当initialImage变化时更新预览
  useEffect(() => {
    if (initialImage) {
      console.log('ImageUpload组件收到初始图片:', initialImage);
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        console.log('用户上传了新图片');
        setPreviewUrl(dataUrl);
        if (onImageChange) {
          onImageChange(file, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    console.log('用户移除了图片');
    setPreviewUrl(null);
    if (onImageChange) {
      onImageChange(null, null);
    }
  };
  
  return (
    <ImagePreviewBox sx={{ height }}>
      {previewUrl ? (
        <>
          <img 
            src={previewUrl} 
            alt="预览" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          />
          <DeleteButton size="small" variant="contained" onClick={handleRemoveImage}>
            <DeleteIcon fontSize="small" />
          </DeleteButton>
          <EditButton size="small" variant="contained" component="label">
            <EditIcon fontSize="small" />
            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
          </EditButton>
        </>
      ) : (
        <Button
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          上传图片
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
      )}
    </ImagePreviewBox>
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
  const [selectedMenuItem, setSelectedMenuItem] = useState('theme-general-settings');
  const brands = useSelector(selectBrands);
  const loading = useSelector(selectThemesLoading);
  const [localThemeData, setLocalThemeData] = useState(null);
  const allLanguages = useSelector(selectLanguages); // 获取所有可用语言
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // 图片状态
  const [logoImage, setLogoImage] = useState(null);
  const [onwhiteLogoImage, setOnwhiteLogoImage] = useState(null);
  const [oncolorLogoImage, setOncolorLogoImage] = useState(null);
  const [faviconImage, setFaviconImage] = useState(null);
  const [loginBgImage, setLoginBgImage] = useState(null);
  
  // Translations文件状态
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // 文件处理函数
  const handleFileUpload = (event) => {
    const files = event.target.files;
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

      setUploadedFile(fileItem);
      previewFile(fileItem);
    }
  };

  const previewFile = (fileItem) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFileContent(e.target.result);
      setSelectedFileName(fileItem.name);
    };
    reader.readAsText(fileItem.file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setSelectedFileContent('');
    setSelectedFileName('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
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

      setUploadedFile(fileItem);
      previewFile(fileItem);
    }
  };
  
  console.log(brands,"brands")
   
  // 当品牌数据加载完成后，设置当前选中品牌的数据
  useEffect(() => {
    console.log('初始化主题数据...', brands?.length || 0);
    
    if (brands && brands.length > 0) {
      const currentTheme = brands[0].strapiData;
      console.log('获取到主题数据:', currentTheme?.theme_key, '图片数据:', {
        logo: currentTheme?.theme_logo?.url || '无logo',
        favicon: currentTheme?.theme_logos?.favicon?.url || '无favicon',
        onwhite_logo: currentTheme?.theme_logos?.onwhite_logo?.url || '无onwhite_logo',
        oncolor_logo: currentTheme?.theme_logos?.oncolor_logo?.url || '无oncolor_logo'
      });
      
      setLocalThemeData(brands[0]);
      
      // 如果有API数据，设置初始图片
      if (currentTheme) {
        if (currentTheme.theme_logo?.url) {
          const logoUrl = getFullImageUrl(currentTheme.theme_logo.url);
          console.log('设置Logo URL:', logoUrl);
          setLogoImage(logoUrl);
        }
        
        if (currentTheme.theme_logos?.favicon?.url) {
          const faviconUrl = getFullImageUrl(currentTheme.theme_logos.favicon.url);
          console.log('设置Favicon URL:', faviconUrl);
          setFaviconImage(faviconUrl);
        }
        
        // 设置onwhite_logo和oncolor_logo
        if (currentTheme.theme_logos?.onwhite_logo?.url) {
          const onwhiteLogoUrl = getFullImageUrl(currentTheme.theme_logos.onwhite_logo.url);
          console.log('设置Onwhite Logo URL:', onwhiteLogoUrl);
          setOnwhiteLogoImage(onwhiteLogoUrl);
        }
        
        if (currentTheme.theme_logos?.oncolor_logo?.url) {
          const oncolorLogoUrl = getFullImageUrl(currentTheme.theme_logos.oncolor_logo.url);
          console.log('设置Oncolor Logo URL:', oncolorLogoUrl);
          setOncolorLogoImage(oncolorLogoUrl);
        }

        // 设置当前主题的选中语言
        if (currentTheme.languages && Array.isArray(currentTheme.languages)) {
          const languageCodes = currentTheme.languages.map(lang => lang.key);
          setSelectedLanguages(languageCodes);
        }
      }
    }
    
    // 组件卸载时的清理函数
    return () => {
      console.log('AdminThemeSettings组件卸载');
    };
  }, [brands]);

  // 处理菜单项选择
  const handleMenuItemClick = (menuId) => {
    setSelectedMenuItem(menuId);
  };

  // 获取Strapi API的基础URL
  const getBaseUrl = () => {
    return import.meta.env.VITE_STRAPI_BASE_URL || '';
  };

  // 获取完整的图片URL
  const getFullImageUrl = (url) => {
    if (!url) {
      console.log('获取图片URL: 输入为空');
      return '';
    }
    
    // 已经是完整URL
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      console.log('获取图片URL: 已经是完整URL:', url.substring(0, 50) + (url.length > 50 ? '...' : ''));
      return url;
    }
    
    // 是相对URL，需要添加基础URL
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}${url}`;
    console.log('获取图片URL: 添加基础URL:', fullUrl);
    return fullUrl;
  };

  // 处理语言选择状态变化
  const handleLanguageChange = (langCode) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  // 文件处理函数已在上方定义

  // 如果正在加载或数据不存在，显示加载状态
  if (loading || !localThemeData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 提取当前品牌的主题数据
  const currentTheme = localThemeData.strapiData;
  const themeColors = currentTheme?.theme_colors || {};
  const themeLogo = currentTheme?.theme_logo || {};

  // 处理图片上传变化
  const handleImageChange = (type, file, previewUrl) => {
    switch (type) {
      case 'logo':
        setLogoImage(previewUrl);
        break;
      case 'onwhiteLogo':
        setOnwhiteLogoImage(previewUrl);
        break;
      case 'oncolorLogo':
        setOncolorLogoImage(previewUrl);
        break;
      case 'favicon':
        setFaviconImage(previewUrl);
        break;
      case 'loginBg':
        setLoginBgImage(previewUrl);
        break;
      default:
        break;
    }
    
    console.log(`图片 ${type} 已上传:`, file);
  };

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
              initialImage={logoImage} 
              onImageChange={(file, url) => handleImageChange('logo', file, url)} 
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>ONWHITE LOGO</Typography>
            <ImageUpload 
              initialImage={onwhiteLogoImage} 
              onImageChange={(file, url) => handleImageChange('onwhiteLogo', file, url)} 
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>ONCOLOR LOGO</Typography>
            <ImageUpload 
              initialImage={oncolorLogoImage} 
              onImageChange={(file, url) => handleImageChange('oncolorLogo', file, url)} 
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Colors 部分 */}
      <SectionCard>
        <SectionTitle>Colors</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ColorBox bgColor={themeColors.primary_color || '#ff6600'} />
            <Typography variant="subtitle2">{localThemeData.name} PRIMARY</Typography>
            <Typography variant="body2">
              {themeColors.primary_color || '#ff6600'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ColorBox bgColor={themeColors.secondary_color || '#003366'} />
            <Typography variant="subtitle2">{localThemeData.name} SECONDARY</Typography>
            <Typography variant="body2">
              {themeColors.secondary_color || '#003366'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ColorBox bgColor="#f5f5f5" />
            <Typography variant="subtitle2">BACKGROUND</Typography>
            <Typography variant="body2">#f5f5f5</Typography>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Favicon 部分 */}
      <SectionCard>
        <SectionTitle>Favicon</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ImageUpload 
              initialImage={faviconImage} 
              onImageChange={(file, url) => handleImageChange('favicon', file, url)} 
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
            <Typography variant="subtitle2" gutterBottom>ENTERPRISE ID</Typography>
            <TextField
              fullWidth
              placeholder="输入企业ID"
              defaultValue={`Welcome to the ${localThemeData.name} Media Portal`}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>ENTERPRISE NAME</Typography>
              <ImageUpload 
                initialImage={loginBgImage} 
                height={200}
                onImageChange={(file, url) => handleImageChange('loginBg', file, url)} 
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
                backgroundImage: loginBgImage ? `url(${loginBgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
                {themeLogo?.url && (
                  <img 
                    src={logoImage || getFullImageUrl(themeLogo.url)} 
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
                    {`Welcome to the ${localThemeData.name} Media Portal`}
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {allLanguages.filter((lang, index) => index % 2 === 0).map((language) => (
              <FormControlLabel 
                key={language.code}
                control={
                  <Checkbox 
                    checked={selectedLanguages.includes(language.code)}
                    onChange={() => handleLanguageChange(language.code)}
                  />
                } 
                label={language.nativeName || language.name} 
              />
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {allLanguages.filter((lang, index) => index % 2 === 1).map((language) => (
              <FormControlLabel 
                key={language.code}
                control={
                  <Checkbox 
                    checked={selectedLanguages.includes(language.code)}
                    onChange={() => handleLanguageChange(language.code)}
                  />
                } 
                label={language.nativeName || language.name} 
              />
            ))}
          </Grid>
        </Grid>
        {/* 修改添加语言按钮 */}
        <Box mt={2}>
          <AddLanguageButton 
            startIcon={<AddIcon />} 
            variant="text"
          >
            Add Language
          </AddLanguageButton>
        </Box>
      </SectionCard>

      {/* Translations 部分 */}
      <SectionCard>
        <SectionTitle>Translations</SectionTitle>
        <Box sx={{ display: 'flex', gap: 0, height: 400 }}>
          {/* 左栏：极简上传区域 */}
          <Box sx={{ flex: 1, pr: 1 }}>
            {uploadedFile ? (
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
                        {uploadedFile.name.split('.').pop().toUpperCase()}
                      </Typography>
                    </FileTypeBox>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333' }}>
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded successfully
                      </Typography>
                    </Box>
                  </Box>
                  <DeleteIconButton 
                    size="small"
                    onClick={removeFile}
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
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </UploadedFileContainer>
            ) : (
              // 显示空状态上传区域
              <DropZone
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#333',
                    fontWeight: 400,
                    mb: 2,
                    fontSize: '1.1rem'
                  }}>
                    Drop your file here
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: '#666',
                    lineHeight: 1.6,
                    mb: 4,
                    fontSize: '0.9rem'
                  }}>
                    Simply drag and drop your TXT, JSON (.json) to convert them into JSON format using our document translation tool
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
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </DropZone>
            )}
          </Box>

          {/* 右栏：预览区域 */}
          <Box sx={{ flex: 1, pl: 1 }}>
            <PreviewContainer>
              {selectedFileName ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* 文件头部信息 */}
                  <PreviewHeader>
                    <FileTypeBox sx={{ width: 24, height: 24, borderRadius: 0.5, mr: 1.5 }}>
                      <Typography sx={{ 
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {selectedFileName.split('.').pop().toUpperCase()}
                      </Typography>
                    </FileTypeBox>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {selectedFileName}
                    </Typography>
                  </PreviewHeader>
                  
                  {/* 文件内容 */}
                  <PreviewContent>
                    {selectedFileContent}
                  </PreviewContent>
                </Box>
              ) : (
                <EmptyPreview>
                  <EmptyPreviewIcon>
                    <UploadFileIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
                  </EmptyPreviewIcon>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Select a file to preview
                  </Typography>
                </EmptyPreview>
              )}
            </PreviewContainer>
          </Box>
        </Box>
      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton variant="contained">
          保存配置
        </SaveButton>
      </Box>
    </>
  );

  // 渲染当前选择的菜单内容
  const renderContent = () => {
    // 只有Theme General Settings是激活的，其他的都显示UnderConstruction
    if (selectedMenuItem === 'theme-general-settings') {
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
              active={selectedMenuItem === item.id}
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