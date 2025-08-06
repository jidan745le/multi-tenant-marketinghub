import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
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

function LookAndFeel() {
  const isLoading = useSelector(selectThemesLoading);
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

  // 保存配置
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

      console.log('🔄 开始保存Look & Feel配置...');

      const strapiBaseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
      const strapiToken = import.meta.env.VITE_STRAPI_TOKEN;
      
      if (!strapiBaseUrl || !strapiToken) {
        alert('Strapi 配置缺失');
        return;
      }

      // 准备颜色数据
      const colorData = {
        primary_color: primaryColor || currentBrand.colors?.primary_color,
        secondary_color: secondaryColor || currentBrand.colors?.secondary_color
      };

      // 准备更新数据
      const updateData = {
        theme_colors: colorData
      };

      // 添加logo更新数据
      if (uploadedImageIds.theme_logo) {
        updateData.theme_logo = uploadedImageIds.theme_logo;
      }

      // 处理theme_logos中的各个logo
      const themeLogosUpdate = {};
      let hasThemeLogosUpdate = false;

      const currentThemeLogos = currentBrand.strapiData?.theme_logos;

      if (uploadedImageIds.onwhite_logo) {
        themeLogosUpdate.onwhite_logo = uploadedImageIds.onwhite_logo;
        hasThemeLogosUpdate = true;
      } else if (currentThemeLogos?.onwhite_logo?.id) {
        themeLogosUpdate.onwhite_logo = currentThemeLogos.onwhite_logo.id;
        hasThemeLogosUpdate = true;
      }

      if (uploadedImageIds.oncolor_logo) {
        themeLogosUpdate.oncolor_logo = uploadedImageIds.oncolor_logo;
        hasThemeLogosUpdate = true;
      } else if (currentThemeLogos?.oncolor_logo?.id) {
        themeLogosUpdate.oncolor_logo = currentThemeLogos.oncolor_logo.id;
        hasThemeLogosUpdate = true;
      }

      if (uploadedImageIds.favicon) {
        themeLogosUpdate.favicon = uploadedImageIds.favicon;
        hasThemeLogosUpdate = true;
      } else if (currentThemeLogos?.favicon?.id) {
        themeLogosUpdate.favicon = currentThemeLogos.favicon.id;
        hasThemeLogosUpdate = true;
      }

      if (hasThemeLogosUpdate) {
        updateData.theme_logos = themeLogosUpdate;
      }

      console.log('准备更新的Look & Feel数据:', updateData);

      // 调用Strapi API更新themes
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
      console.log('✅ Look & Feel配置保存成功:', result);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Look & Feel
      </Typography>

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
        <SectionTitle>Color Theme</SectionTitle>
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