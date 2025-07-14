import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ThemeContext from '../contexts/ThemeContext';
import themeCreator from './themeCreator';

const ThemeProviderWrapper = function (props) {
  const params = useParams();
  const location = useLocation();
  
  console.log('ThemeProvider: location.pathname =', location.pathname);
  console.log('ThemeProvider: params =', params);
  
  // 如果params.brand是undefined，尝试从URL路径中解析
  let brandFromUrl = params.brand;
  if (!brandFromUrl) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      brandFromUrl = pathSegments[1];
    }
  }
  
  const currentBrand = brandFromUrl || 'kendo-china';
  
  // 使用函数形式的初始化，避免每次渲染都重新计算
  const [themeName, _setThemeName] = useState(() => {
    // 优先使用URL中的brand
    return currentBrand;
  });
  
  // 创建主题
  const theme = themeCreator(themeName);
  
  // 设置主题的函数
  const setThemeName = (brandCode) => {
    localStorage.setItem('appTheme', brandCode);
    _setThemeName(brandCode);
  };

  // 监听URL中的品牌变化，立即更新主题
  useEffect(() => {
    console.log('ThemeProvider: URL brand changed:', currentBrand, 'current theme:', themeName);
    if (currentBrand !== themeName) {
      console.log('ThemeProvider: Updating theme to:', currentBrand);
      _setThemeName(currentBrand);
      localStorage.setItem('appTheme', currentBrand);
    }
  }, [currentBrand, themeName]);

  // 在组件挂载时，同步localStorage中的主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme && savedTheme !== currentBrand && savedTheme !== themeName) {
      // 只有当保存的主题与当前URL不同时，才可能需要更新
      // 但优先级是：URL > localStorage，所以这里不做处理
    }
  }, []);

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper; 