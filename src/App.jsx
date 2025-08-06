import { Backdrop, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import './assets/styles/fonts.css';
import TopBar from './components/TopBar';
// 导入 i18n 配置
import { I18nextProvider, useTranslation } from 'react-i18next';
import useTheme from './hooks/useTheme';
import { useTranslationLoader } from './hooks/useTranslationLoader';
import './i18n/i18n';
import i18n from './i18n/i18n';
import router from './router/index.jsx';
import store from './store';
import { fetchThemes } from './store/slices/themesSlice';
import ThemeProviderWrapper from './theme/ThemeProvider';
// 导入 react-spinners
import { DotLoader } from 'react-spinners';

// Strapi API 请求函数 - 更新为使用新的Redux action
const fetchStrapiThemes = async (dispatch) => {
  try {
    const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
    const token = import.meta.env.VITE_STRAPI_TOKEN;
    
    if (!baseUrl || !token) {
      return null;
    }

    const response = await fetch(`${baseUrl}/api/themes?populate[0]=theme_colors&populate[1]=theme_logo&populate[2]=menu&populate[3]=menu.menu_l2&populate[4]=languages&populate[5]=theme_logos.favicon&populate[6]=theme_logos.onwhite_logo&populate[7]=theme_logos.oncolor_logo&populate[8]=login&populate[9]=pages.content_area&populate[10]=pages.content_area.home_page_widget_list.image&populate[11]=pages.content_area.link_list&populate[12]=pages.content_area.contact&populate[13]=pages.content_area.link_list.link_icon&populate[14]=pages.content_area.contact.profile_pic&populate[15]=fallback_image&populate[16]=legal&populate[17]=communication&populate[18]=socialprofile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    dispatch(fetchThemes.fulfilled(result));
    return result;
    
  } catch (error) {
    dispatch(fetchThemes.rejected(error.message));
    return null;
  }
};

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

// 简洁的加载覆盖组件
const TranslationLoadingOverlay = ({ isLoading }) => {
  const {theme} = useTheme();
  return (
    <Backdrop 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }} 
      open={isLoading}
    >
      <DotLoader
        color={theme?.palette?.primary?.main}
        size={60}
        speedMultiplier={0.8}
      />
    </Backdrop>
  );
};

// Router内部的组件，负责翻译加载
function RouterContent() {
  // 全局翻译加载管理 - 在Router上下文内执行，现在使用Redux数据
  const { loadTranslationsFromRedux } = useTranslationLoader();
  
  // 当Redux中有翻译数据时，加载到i18n
  useEffect(() => {
    loadTranslationsFromRedux();
  }, [loadTranslationsFromRedux]);
  
  return (
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
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <AppRoutes />
        </Box>
      </Box>
    </ThemeProviderWrapper>
  );
}

// 主应用组件 - 包装在Redux Provider中
function AppContent() {
  // 确保i18n已经初始化，但不使用t变量
  useTranslation();
  
  // 在组件挂载时请求 Strapi themes
  useEffect(() => {
    fetchStrapiThemes(store.dispatch);
  }, []);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </Suspense>
  );
}

// 根组件 - 提供Redux store
function App() {
  // 在开发模式下暴露store到全局，方便调试
  if (import.meta.env.DEV) {
    window.store = store;
  }
  
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppContent />
      </I18nextProvider>
    </Provider>
  );
}

export default App;
