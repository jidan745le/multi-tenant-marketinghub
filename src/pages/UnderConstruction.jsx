import { Construction, Home } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

function UnderConstruction() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { currentBrand } = useBrand();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate(`/${currentLanguage}/${currentBrand}/products`);
  };

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
          <Typography>Current Brand: {currentBrand}</Typography>
          <Typography>Primary Color: {theme.palette.primary.main}</Typography>
          <Typography>Secondary Color: {theme.palette.secondary.main}</Typography>
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