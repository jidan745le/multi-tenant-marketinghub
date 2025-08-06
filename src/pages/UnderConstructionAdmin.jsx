import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Box, Typography } from '@mui/material';
import React from 'react';

function UnderConstructionAdmin() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        py: 4,
        px: 3
      }}
    >
      <ColorLensIcon
        sx={{
          fontSize: 120,
          color: 'primary.main',
          mb: 3
        }}
      />
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
        Under Construction
      </Typography>
      
      <Typography variant="h6" component="p" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px' }}>
        This section is currently being developed and will be available soon.
      </Typography>
    </Box>
  );
}

export default UnderConstructionAdmin; 