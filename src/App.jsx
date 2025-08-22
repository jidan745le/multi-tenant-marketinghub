import { Backdrop, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import './assets/styles/fonts.css';
import TopBar from './components/TopBar';
import { AuthProvider, useAuth } from './context/AuthContext';
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
// 导入测试工具 (开发环境)
import './utils/testLocaleMapping';

// 动态从Redux获取语言代码到Strapi locale的映射
const getLocaleForAPI = (languageCode) => {
  try {
    // 从Redux store获取当前语言缓存中的语言数据
    const state = store.getState();
    const currentLangData = state.themes.languageCache[state.themes.currentLanguage];
    
    if (currentLangData?.languages) {
      // 在当前品牌的语言配置中查找对应的iso_639_code
      const languageInfo = currentLangData.languages.find(lang => lang.code === languageCode);
      if (languageInfo?.isoCode) {
        console.log(`🗂️ 从Redux获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
        return languageInfo.isoCode;
      }
    }
    
    // 回退：检查所有语言缓存中的数据
    for (const langCache of Object.values(state.themes.languageCache)) {
      if (langCache.languages) {
        const languageInfo = langCache.languages.find(lang => lang.code === languageCode);
        if (languageInfo?.isoCode) {
          console.log(`🗂️ 从其他缓存获取映射: ${languageCode} -> ${languageInfo.isoCode}`);
          return languageInfo.isoCode;
        }
      }
    }
    
    // 最后回退：使用静态映射
    const staticMapping = {
      'en_GB': 'en', 'en_US': 'en', 'en_AU': 'en',
      'zh_CN': 'zh', 'zh_TW': 'zh', 'cht': 'zh', 'ch': 'zh',
      'de_DE': 'de', 'fr_FR': 'fr', 'es_ES': 'es', 'ja_JP': 'ja',
      'ko_KR': 'ko', 'it_IT': 'it', 'pt_PT': 'pt', 'ru_RU': 'ru',
      'ar_SA': 'ar', 'nl_NL': 'nl', 'pl_PL': 'pl', 'cs_CZ': 'cs',
      'da_DK': 'da', 'fi_FI': 'fi', 'hu_HU': 'hu', 'nb_NO': 'no',
      'sv_SE': 'sv', 'bg_BG': 'bg', 'hr_HR': 'hr', 'et_EE': 'et',
      'el_GR': 'el', 'lt_LT': 'lt', 'lv_LV': 'lv'
    };
    
    const locale = staticMapping[languageCode] || languageCode.split('_')[0] || 'en';
    console.log(`⚠️ 使用静态映射回退: ${languageCode} -> ${locale}`);
    return locale;
    
  } catch (error) {
    console.error('❌ getLocaleForAPI错误:', error);
    return languageCode.split('_')[0] || 'en';
  }
};

// Strapi API 请求函数 - 更新为支持语言参数的Redux action
const fetchStrapiThemes = async (dispatch, languageCode = 'en_GB') => {
  // Import CookieService for auth token
  const { default: CookieService } = await import('./utils/cookieService');
  
  // 检查是否是登录页面且用户未认证，如果是则不进行主题数据请求
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname.endsWith('/Login');
  const isAuthenticated = !!CookieService.getToken();
  
  if (isLoginPage && !isAuthenticated) {
    console.log('🚫 登录页面且未认证，跳过Strapi主题数据请求');
    return null;
  }
  
  // 将应用语言代码转换为API locale
  const locale = getLocaleForAPI(languageCode);
  
  try {
    const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL;
    const token = import.meta.env.VITE_STRAPI_TOKEN;
    
    if (!baseUrl || !token) {
      return null;
    }

    console.log(`🌐 API请求: ${languageCode} -> locale=${locale}`);
    
    // 从localStorage读取租户并添加过滤条件
    let tenantFilterParam = '';
    try {
      const storedTenant = localStorage.getItem('mh_tenant');
      if (storedTenant) {
        const parsed = JSON.parse(storedTenant);
        if (parsed && parsed.tenant) {
          tenantFilterParam = `&filters[tenant][tenant_name][$eq]=${encodeURIComponent(parsed.tenant)}`;
        }
      }
    } catch (_) {}
    
    // Get auth token from cookies for authenticated requests
    const authToken = CookieService.getToken();
    // 构建payload，包含locale参数
    const payloadObj = {
      locale: locale
    };
    const payloadParam = encodeURIComponent(JSON.stringify(payloadObj));
    
    const apiEndpoint = authToken 
      ? `/apis/app-config?appcode=marketinghub&payload=${payloadParam}`
      : `${baseUrl}/api/themes?locale=${locale}${tenantFilterParam}&populate[0]=theme_colors&populate[1]=theme_logo&populate[2]=menu&populate[3]=menu.menu_l2&populate[4]=languages&populate[5]=theme_logos.favicon&populate[6]=theme_logos.onwhite_logo&populate[7]=theme_logos.oncolor_logo&populate[8]=login&populate[9]=pages.content_area&populate[10]=pages.content_area.home_page_widget_list.image&populate[11]=pages.content_area.link_list&populate[12]=pages.content_area.contact&populate[13]=pages.content_area.link_list.link_icon&populate[14]=pages.content_area.contact.profile_pic&populate[15]=fallback_image&populate[16]=legal&populate[17]=communication&populate[18]=socialprofile&populate[19]=login.background&populate[20]=pages.content_area.colors&populate[21]=pages.content_area.fonts&populate[22]=pages.content_area.view_button.button_link&populate[23]=pages.content_area.download_button.button_link&populate[24]=pages.content_area.book_logo&populate[25]=pages.content_area.book_cover&populate[26]=pages.content_area.book_file`;

    const headers = {
      'Content-Type': 'application/json',
    };

    // Use appropriate authorization header based on endpoint
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 添加语言参数与租户过滤到API请求
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // 检查API是否返回有效数据
    const hasValidData = result.data && Array.isArray(result.data) && result.data.length > 0;
    
    if (!hasValidData) {
      console.warn(`⚠️ ${languageCode}语言的主题数据为空 (locale=${locale}), 数据:`, result);
      
      // 如果当前不是默认语言，尝试回退到默认语言
      if (languageCode !== 'en_GB') {
        console.log(`🔄 回退到默认语言 en_GB`);
        return await fetchStrapiThemes(dispatch, 'en_GB');
      } else {
        // 如果连默认语言都没有数据，记录错误但不抛出异常
        console.error(`❌ 默认语言${languageCode}也没有主题数据`);
        return null;
      }
    }
    
    console.log(`✅ 成功获取${languageCode}语言的主题数据 (locale=${locale})`);
    console.log(`🗃️ 将数据存储到缓存，键值: ${languageCode}`);
    dispatch(fetchThemes.fulfilled({ ...result, languageCode }));
    return result;
    
  } catch (error) {
    console.error(`❌ 获取${languageCode}语言的主题数据失败 (locale=${locale}):`, error);
    dispatch(fetchThemes.rejected(error.message));
    return null;
  }
};

// 带缓存检查的主题获取函数
const fetchThemesWithCache = async (dispatch, getState, languageCode = 'en_GB') => {
  const state = getState();
  const cachedData = state.themes.languageCache[languageCode];
  
  // 检查缓存数据是否有效（不为空且包含实际数据）
  const hasValidCache = cachedData && 
                       cachedData.brands && 
                       Array.isArray(cachedData.brands) && 
                       cachedData.brands.length > 0;

  // 调试信息：显示缓存状态
  const cacheKeys = Object.keys(state.themes.languageCache);
  console.log(`🔍 缓存检查: 查找语言=${languageCode}, 现有缓存键=[${cacheKeys.join(', ')}], 找到缓存=${!!cachedData}, 缓存有效=${hasValidCache}`);
  
  if (cachedData) {
    console.log(`🔍 缓存数据详情 ${languageCode}:`, {
      hasBrands: !!cachedData.brands,
      brandsLength: cachedData.brands?.length || 0,
      hasLanguages: !!cachedData.languages,
      languagesLength: cachedData.languages?.length || 0,
      hasPages: !!cachedData.pages,
      pagesLength: cachedData.pages?.length || 0,
      lastUpdated: cachedData.lastUpdated,
      isFromAPI: cachedData.isFromAPI
    });
  }

  if (hasValidCache) {
    console.log(`✅ 使用${languageCode}语言的有效缓存数据`);
    // 如果有有效缓存，直接设置当前语言
    const { setCurrentLanguage } = await import('./store/slices/themesSlice');
    dispatch(setCurrentLanguage(languageCode));
    return cachedData;
  } else if (cachedData && !hasValidCache) {
    console.warn(`⚠️ ${languageCode}语言的缓存数据无效，将重新请求`);
    // 清除无效缓存
    const { clearLanguageCache } = await import('./store/slices/themesSlice');
    dispatch(clearLanguageCache(languageCode));
  }
  
  console.log(`🔄 请求${languageCode}语言的新数据`);
  return await fetchStrapiThemes(dispatch, languageCode);
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

// Router内部的组件，负责翻译加载和认证状态监听
function RouterContent() {
  // 全局翻译加载管理 - 在Router上下文内执行，现在使用Redux数据
  const { loadTranslationsFromRedux } = useTranslationLoader();
  const { isAuthenticated } = useAuth(); // 现在在AuthProvider内部了
  const { i18n } = useTranslation();
  
  // 当Redux中有翻译数据时，加载到i18n
  useEffect(() => {
    loadTranslationsFromRedux();
  }, [loadTranslationsFromRedux]);

  // 监听认证状态变化，重新获取主题数据 (只监听认证状态，不监听语言变化)
  useEffect(() => {
    if (isAuthenticated) {
      const currentLanguage = i18n.language || 'en_GB';
      console.log(`🔐 用户登录，重新加载主题数据: ${currentLanguage}`);
      // 强制重新获取主题数据，因为现在有认证token了
      // 使用缓存机制，避免重复请求
      fetchThemesWithCache(store.dispatch, store.getState, currentLanguage);
    }
  }, [isAuthenticated]); // 只监听认证状态变化，移除 i18n.language 依赖
  
  // 检查是否是登录页面
  const isLoginPage = window.location.pathname.endsWith('/Login');
  const isSignUpPage = window.location.pathname.split('/').pop().includes('Register');
  const isVerificationSentPage = window.location.pathname.endsWith('/VerificationSent');
  const isEmailVerificationPage = window.location.pathname.endsWith('/VerifyEmail');
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
        {/* 顶部导航栏 - 登录页面不显示 */}
        {!isLoginPage && !isSignUpPage && !isVerificationSentPage && !isEmailVerificationPage && <TopBar />}
        
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
  const { i18n } = useTranslation();
  
  // 在组件挂载时请求初始 Strapi themes
  useEffect(() => {
    // 检查是否是登录页面，如果是则不进行主题数据请求
    const isLoginPage = window.location.pathname.endsWith('/Login');
    if (isLoginPage) {
      return;
    }
    
    const currentLanguage = i18n.language || 'en_GB';
    fetchThemesWithCache(store.dispatch, store.getState, currentLanguage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次，忽略i18n.language依赖以避免重复调用

  // 监听i18n语言变化 (避免重复监听)
  useEffect(() => {
    const handleLanguageChange = (newLanguage) => {
      // 检查是否是登录页面，如果是则不进行主题数据请求
      const isLoginPage = window.location.pathname.endsWith('/Login');
      if (isLoginPage) {
        console.log('🚫 登录页面，跳过语言变化主题数据请求');
        return;
      }
      
      // 调试信息：显示语言变化详情
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      const urlLanguage = pathSegments[0];
      
      console.log(`🌐 i18n语言变化事件:`, {
        newLanguage,
        urlLanguage,
        currentPath,
        pathSegments
      });
      
      fetchThemesWithCache(store.dispatch, store.getState, newLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <AuthProvider>
          <RouterContent />
        </AuthProvider>
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
