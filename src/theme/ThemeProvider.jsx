import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import ThemeContext from '../contexts/ThemeContext';
import { selectBrands } from '../store/slices/themesSlice';
import { createDynamicTheme } from './themeCreator';

// Helper function to update favicon
const updateFavicon = (faviconUrl) => {
  if (!faviconUrl) return;
  
  // Get the base URL from the environment
  const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
  
  // Create a full URL for the favicon
  const fullFaviconUrl = faviconUrl.startsWith('http') ? faviconUrl : `${baseUrl}${faviconUrl}`;
  
  // Update favicon link elements
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = fullFaviconUrl;
  
  // Update Apple touch icon if it exists
  let appleLink = document.querySelector("link[rel~='apple-touch-icon']");
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = fullFaviconUrl;
};

const ThemeProviderWrapper = function (props) {
  const params = useParams(); 
  const location = useLocation(); 
  
  // 从Redux获取品牌数据
  const brands = useSelector(selectBrands);
  
  console.log('🎨 ThemeProvider: 可用品牌:', brands.map(b => ({
    code: b.code, 
    colors: b.strapiData?.theme_colors
  })));
  
  // 如果params.brand是undefined，尝试从URL路径中解析
  let brandFromUrl = params.brand;
  if (!brandFromUrl) {
    const pathSegments = location.pathname.split('/')                                                                                                     ;
    brandFromUrl = pathSegments[2]; // 与useBrand.js保持一致
  }
  
  const currentBrandCode = brandFromUrl || 'kendo';
  console.log('🎯 ThemeProvider: 当前品牌代码:', currentBrandCode);
  
  // 从Redux中找到当前品牌的主题色
  const currentBrandData = brands.find(brand => brand.code === currentBrandCode);
  const themeColors = currentBrandData?.strapiData?.theme_colors;
  const themeLogo = currentBrandData?.strapiData?.theme_logo;
  const themeFavicon = currentBrandData?.strapiData?.theme_logos?.favicon;
  const themeOnwhiteLogo = currentBrandData?.strapiData?.theme_logos?.onwhite_logo;
  const themeOncolorLogo = currentBrandData?.strapiData?.theme_logos?.oncolor_logo;
  const fallbackImage = currentBrandData?.strapiData?.fallback_image;
  
  console.log('🎨 ThemeProvider: 当前品牌数据:', currentBrandData);
  console.log('🎨 ThemeProvider: 主题色数据:', themeColors);
  console.log('🎨 ThemeProvider: 主题Logo数据:', themeLogo);
  console.log('🎨 ThemeProvider: 主题Favicon数据:', themeFavicon);
  console.log('🎨 ThemeProvider: 主题OnwhiteLogo数据:', themeOnwhiteLogo);
  console.log('🎨 ThemeProvider: 主题OncolorLogo数据:', themeOncolorLogo);
  console.log('🎨 ThemeProvider: 主题FallbackImage数据:', fallbackImage);
  
  // 使用函数形式的初始化，避免每次渲染都重新计算
  const [themeName, _setThemeName] = useState(() => {
    return currentBrandCode;
  });
  
  // 使用useMemo创建主题，避免不必要的重新创建
  const theme = useMemo(() => {
    if (themeColors || themeLogo || themeFavicon) {
      console.log('✨ 使用API动态主题数据:', {
        brand: currentBrandCode,
        primary: themeColors?.primary_color,
        secondary: themeColors?.secondary_color,
        logo: themeLogo?.url,
        favicon: themeFavicon?.url,
        onwhiteLogo: themeOnwhiteLogo?.url,
        oncolorLogo: themeOncolorLogo?.url,
        fallbackImage: fallbackImage?.url
      });
      return createDynamicTheme(currentBrandCode, themeColors, themeLogo, themeFavicon, themeOnwhiteLogo, themeOncolorLogo, fallbackImage);
    } else {
      console.log('⚠️ 使用静态默认主题 (API数据未加载)');
      return createDynamicTheme(currentBrandCode, null, null, null, null, null, null);
    }
  }, [currentBrandCode, themeColors, themeLogo, themeFavicon, themeOnwhiteLogo, themeOncolorLogo, fallbackImage]);
  
  // 设置主题的函数
  const setThemeName = (brandCode) => {
    localStorage.setItem('appTheme', brandCode);
    _setThemeName(brandCode);
  };

  // 监听URL中的品牌变化，立即更新主题
  useEffect(() => {
    console.log('🔄 ThemeProvider: 品牌变化:', currentBrandCode, '→', themeName);
    if (currentBrandCode !== themeName) {
      console.log('🔄 ThemeProvider: 更新主题到:', currentBrandCode);
      _setThemeName(currentBrandCode);
      localStorage.setItem('appTheme', currentBrandCode);
    }
  }, [currentBrandCode, themeName]);
  
  // 监听主题favicon变化，更新浏览器favicon
  useEffect(() => {
    if (themeFavicon?.url) {
      console.log('🔄 ThemeProvider: 更新Favicon:', themeFavicon.url);
      updateFavicon(themeFavicon.url);
    }
  }, [themeFavicon]);

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper; 