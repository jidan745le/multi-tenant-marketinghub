import { Home } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UnderConstruction() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/products');
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
        {/* <Construction
          sx={{
            fontSize: 120,
            color: 'primary.main',
            mb: 3
          }}
        /> */}
        
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
          Under Construction
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
          This page is currently under development. We're working hard to bring you new features and improvements.
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4
          }}
        >
          In the meantime, you can explore our Product Catalogue.
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
          Go to Product Catalogue
        </Button>
      </Box>
    </Container>
  );
}

export default UnderConstruction; 