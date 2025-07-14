import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import './assets/styles/fonts.css';
import TopBar from './components/TopBar';
import './i18n/i18n'; // 导入 i18n 配置
import router from './router/index.jsx';
import ThemeProviderWrapper from './theme/ThemeProvider';

// 加载组件
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: 'text.secondary',
    }}
  >
    Loading...
  </Box>
);

// 路由组件
function AppRoutes() {
  const content = useRoutes(router);
  return content;
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <ThemeProviderWrapper>
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
              <AppRoutes />
            </Box>
          </Box>
        </ThemeProviderWrapper>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
