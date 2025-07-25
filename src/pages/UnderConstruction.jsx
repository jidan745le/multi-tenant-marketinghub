import { Construction, Home } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';
import { useDynamicMenus } from '../hooks/useDynamicMenus';
import { useLanguage } from '../hooks/useLanguage';

function UnderConstruction() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { currentBrand } = useBrand();
  const { menuItems, debug: menuDebug } = useDynamicMenus();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate(`/${currentLanguage}/${currentBrand?.code || 'kendo'}/category`);
  };

  console.log('UnderConstruction: currentBrand', currentBrand?.strapiData?.theme_logo,currentBrand.displayName,currentBrand.strapiData?.theme_logo?.url);
  console.log('UnderConstruction: menuItems', menuItems);
  console.log('UnderConstruction: menuDebug', menuDebug);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 4
        }}
      >
        {/* 调试信息 */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6">Debug Info:</Typography>
          <Typography>Current Brand: {currentBrand?.displayName || 'Loading...'}</Typography>
          <Typography>Brand Code: {currentBrand?.code || 'N/A'}</Typography>
          <Typography>Data Source: {currentBrand?.strapiData ? 'Strapi API 📡' : 'Static Config'}</Typography>
          
          {/* 显示动态主题色 */}
          {currentBrand?.strapiData?.theme_colors && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">🎨 API Dynamic Theme Colors:</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      backgroundColor: currentBrand.strapiData.theme_colors.primary_color,
                      border: '1px solid #ccc',
                      borderRadius: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    Primary: {currentBrand.strapiData.theme_colors.primary_color}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      backgroundColor: currentBrand.strapiData.theme_colors.secondary_color,
                      border: '1px solid #ccc',
                      borderRadius: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    Secondary: {currentBrand.strapiData.theme_colors.secondary_color}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* 显示动态Logo */}
          {currentBrand?.strapiData?.theme_logo && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>              
              <Typography variant="subtitle2">🖼️ API Dynamic Logo:</Typography>
              <Box sx={{ mt: 1 }}>
                <img 
                  src={`${import.meta.env.VITE_STRAPI_BASE_URL}${currentBrand.strapiData.theme_logo.url}`} 
                  alt={`${currentBrand.displayName} Logo`}
                  style={{ maxHeight: '50px', maxWidth: '200px' }}
                  onError={(e) => {
                    console.error('Logo加载失败:', e);
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  URL: {currentBrand.strapiData.theme_logo.url}
                </Typography>
              </Box>
            </Box>
          )}

          {/* 显示动态菜单 */}
          <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2">📋 Dynamic Menus:</Typography>
            <Typography variant="body2">Source: {menuDebug.dataSource}</Typography>
            <Typography variant="body2">Count: {menuDebug.menuCount}</Typography>
            {menuItems.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {menuItems.slice(0, 3).map((item, index) => (
                  <Typography key={index} variant="body2">
                    • {item.label} {item.apiData && '🌐'}
                  </Typography>
                ))}
                {menuItems.length > 3 && (
                  <Typography variant="body2">... and {menuItems.length - 3} more</Typography>
                )}
              </Box>
            )}
          </Box>
          
          <Typography>MUI Primary Color: {theme.palette.primary.main}</Typography>
          <Typography>MUI Secondary Color: {theme.palette.secondary.main}</Typography>
          
          {/* 显示主题品牌信息 */}
          {theme.brand && (
            <Typography>Theme Brand Info: {theme.brand.code} (API: {theme.brand.isFromAPI ? 'Yes' : 'No'})</Typography>
          )}
        </Box>
        
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
          {t('under.construction.title')}
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
          {t('under.construction.description')}
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={handleGoHome}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem'
          }}
        >
          Go to Catalog
        </Button>
      </Box>
    </Container>
  );
}

export default UnderConstruction; 