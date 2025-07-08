import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import './assets/styles/fonts.css';
import TopBar from './components/TopBar';
import ProductCatalogue from './pages/ProductCatalogue';

// 创建Material UI主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(241, 101, 8)',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto-Regular", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          overflow: 'hidden' 
        }}
      >
        {/* 顶部导航栏 */}
        <TopBar />
        
        {/* 主要内容区域 */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ProductCatalogue />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
