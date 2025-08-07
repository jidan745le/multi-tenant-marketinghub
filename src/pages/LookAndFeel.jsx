import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '../components/ImageUpload';
import { SectionCard, SectionTitle, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import { selectCurrentLanguage, selectThemesLoading } from '../store/slices/themesSlice';
import {
  formatMultipleImageRelations,
  updateThemeWithLocale,
  validateBrandData
} from '../utils/themeUpdateUtils';

// 样式化组件

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

function LookAndFeel() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectThemesLoading);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { currentBrand } = useBrand();

  // 图片预览状态
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [onwhiteLogoPreview, setOnwhiteLogoPreview] = useState(null);
  const [oncolorLogoPreview, setOncolorLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // 配置数据状态
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');

  // 上传状态管理
  const [uploadingStates, setUploadingStates] = useState({
    theme_logo: false,
    onwhite_logo: false,
    oncolor_logo: false,
    favicon: false,
  });

  // 跟踪已上传的图片ID
  const [uploadedImageIds, setUploadedImageIds] = useState({
    theme_logo: null,
    onwhite_logo: null,
    oncolor_logo: null,
    favicon: null,
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

  // 初始化配置数据状态
  useEffect(() => {
    if (currentBrand) {
      setPrimaryColor(currentBrand.colors?.primary_color || '');
      setSecondaryColor(currentBrand.colors?.secondary_color || '');
    }
  }, [currentBrand]);

  // 初始化图片预览
  useEffect(() => {
    console.log('初始化图片预览，currentBrand:', currentBrand);
    if (currentBrand) {
      const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
      
      // 设置 brand logo
      if (currentBrand.logo?.url) {
        const logoUrl = `${baseUrl}${currentBrand.logo.url}`;
        console.log('设置 Brand Logo:', logoUrl);
        setBrandLogoPreview(logoUrl);
      } else if (currentBrand.strapiData?.theme_logo?.url) {
        const logoUrl = `${baseUrl}${currentBrand.strapiData.theme_logo.url}`;
        console.log('设置 Brand Logo (从strapiData.theme_logo):', logoUrl);
        setBrandLogoPreview(logoUrl);
      } else {
        setBrandLogoPreview(null);
      }
      
      // 设置 onwhite logo
      if (currentBrand.onwhite_logo?.url) {
        const onwhiteUrl = `${baseUrl}${currentBrand.onwhite_logo.url}`;
        setOnwhiteLogoPreview(onwhiteUrl);
      } else if (currentBrand.strapiData?.theme_logos?.onwhite_logo?.url) {
        const onwhiteUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.onwhite_logo.url}`;
        setOnwhiteLogoPreview(onwhiteUrl);
      } else {
        setOnwhiteLogoPreview(null);
      }
      
      // 设置 oncolor logo
      if (currentBrand.oncolor_logo?.url) {
        const oncolorUrl = `${baseUrl}${currentBrand.oncolor_logo.url}`;
        setOncolorLogoPreview(oncolorUrl);
      } else if (currentBrand.strapiData?.theme_logos?.oncolor_logo?.url) {
        const oncolorUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.oncolor_logo.url}`;
        setOncolorLogoPreview(oncolorUrl);
      } else {
        setOncolorLogoPreview(null);
      }
      
      // 设置 favicon
      if (currentBrand.favicon?.url) {
        const faviconUrl = `${baseUrl}${currentBrand.favicon.url}`;
        setFaviconPreview(faviconUrl);
      } else if (currentBrand.strapiData?.theme_logos?.favicon?.url) {
        const faviconUrl = `${baseUrl}${currentBrand.strapiData.theme_logos.favicon.url}`;
        setFaviconPreview(faviconUrl);
      } else {
        setFaviconPreview(null);
      }
    } else {
      setBrandLogoPreview(null);
      setOnwhiteLogoPreview(null);
      setOncolorLogoPreview(null);
      setFaviconPreview(null);
    }
  }, [currentBrand]);

  // 图片上传处理函数
  const handleImageUpload = async (file, logoType) => {
    console.log('开始处理图片:', logoType, file.name);
    
    setUploadingStates(prev => ({
      ...prev,
      [logoType]: true
    }));

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
    }

    try {
      const uploadedFile = await uploadFileToStrapi(file, logoType);
      console.log('文件上传到Strapi成功:', uploadedFile);
      
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
        }
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
    }
  };

  // 保存配置 - 使用通用工具函数
  const handleSaveConfiguration = async () => {
    try {
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      console.log('🔄 开始保存Look & Feel配置...');

      // 准备颜色数据
      const colorData = {
        primary_color: primaryColor || currentBrand.colors?.primary_color,
        secondary_color: secondaryColor || currentBrand.colors?.secondary_color
      };

      // 准备更新数据
      const updateData = {
        theme_colors: colorData
      };

      // 添加theme_logo更新数据
      if (uploadedImageIds.theme_logo) {
        updateData.theme_logo = uploadedImageIds.theme_logo;
      }

      // 处理theme_logos中的各个logo - 使用通用格式化函数
      const currentThemeLogos = currentBrand.strapiData?.theme_logos;
      const themeLogosUpdate = formatMultipleImageRelations(
        uploadedImageIds,
        {
          onwhite_logo: currentThemeLogos?.onwhite_logo,
          oncolor_logo: currentThemeLogos?.oncolor_logo,
          favicon: currentThemeLogos?.favicon
        },
        ['onwhite_logo', 'oncolor_logo', 'favicon']
      );

      if (Object.keys(themeLogosUpdate).length > 0) {
        updateData.theme_logos = themeLogosUpdate;
      }

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Look & Feel配置'
      });

      alert('Look & Feel配置保存成功！');

      // 清空已上传的图片ID记录
      setUploadedImageIds({
        theme_logo: null,
        onwhite_logo: null,
        oncolor_logo: null,
        favicon: null,
      });

    } catch (error) {
      console.error('❌ 保存配置失败:', error);
      alert(`保存失败: ${error.message}`);
    }
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Logos 部分 */}
      <SectionCard>
        <SectionTitle>Logos</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SubTitle>BRAND LOGO</SubTitle>
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
            <SubTitle>ONWHITE LOGO</SubTitle>
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
            <SubTitle>ONCOLOR LOGO</SubTitle>
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
        <SectionTitle>Color Theme</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <SubTitle >
                {currentBrand.name} PRIMARY
              </SubTitle>
                              <TextField
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                                    sx={{
                    width: '200px',
                    height: '200px',
                    '& .MuiInputBase-root': {
                      width: '200px',
                      height: '200px',
                      border: 'none',
                    },
                    '& .MuiInputBase-input': {
                      width: '200px',
                      height: '200px',
                      padding: '0',
                      cursor: 'pointer',
                      border: 'none !important',
                      outline: 'none !important',
                      borderRadius: '4px',
                      boxShadow: 'none !important',
                    },
                    '& input[type="color"]': {
                      border: 'none !important',
                      outline: 'none !important',
                      appearance: 'none',
                      '-webkit-appearance': 'none',
                      '-moz-appearance': 'none',
                      width: '200px',
                      height: '200px',
                      padding: '0',
                      borderRadius: '4px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }
                  }}
                />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Hex: {primaryColor || themeColors.primary_color || '#ff6600'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <SubTitle>
                {currentBrand.name} SECONDARY
              </SubTitle>
                 <TextField
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                                    sx={{
                    width: '200px',
                    height: '200px',
                    '& .MuiInputBase-root': {
                      width: '200px',
                      height: '200px',
                      border: 'none',
                    },
                    '& .MuiInputBase-input': {
                      width: '200px',
                      height: '200px',
                      padding: '0',
                      cursor: 'pointer',
                      border: 'none !important',
                      outline: 'none !important',
                      borderRadius: '4px',
                      boxShadow: 'none !important',
                    },
                    '& input[type="color"]': {
                      border: 'none !important',
                      outline: 'none !important',
                      appearance: 'none',
                      '-webkit-appearance': 'none',
                      '-moz-appearance': 'none',
                      width: '200px',
                      height: '200px',
                      padding: '0',
                      borderRadius: '4px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }
                  }}
                />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Hex: {secondaryColor || themeColors.secondary_color || '#003366'}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <SubTitle>SELECT FONT</SubTitle>
            <TextField
              select
              sx={{width:"60%"}}
              defaultValue="Roboto"
              SelectProps={{
                native: true,
              }}
            >
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
            </TextField>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <SubTitle>TITLE</SubTitle>
            <Box>
              <Typography variant="h4">Heading 1</Typography>
              <Typography variant="h5">Heading 2</Typography>
              <Typography variant="h6">Heading 3</Typography>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <SubTitle>BODY</SubTitle>
            <Box>
              <Typography variant="body1">This is a regular body text</Typography>
              <Typography variant="body2">This is a semibold body text</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>This is a bold body text</Typography>
            </Box>
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

export default LookAndFeel; 