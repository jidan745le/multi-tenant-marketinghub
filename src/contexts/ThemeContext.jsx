import { createContext, useContext } from 'react';

// 创建主题上下文
const ThemeContext = createContext();

// 导出主题上下文的Hook
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 