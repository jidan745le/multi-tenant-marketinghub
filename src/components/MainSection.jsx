import React from 'react';
import { Box } from '@mui/material';
import MainSectionTitle from './MainSectionTitle';

/**
 * 主要节包装组件 - 解决重复的section布局
 * 
 * @param {Object} props
 * @param {string} props.icon - 图标源
 * @param {string} props.title - 标题文本
 * @param {string} props.primaryColor - 主题色
 * @param {React.ReactNode} props.children - 内容
 * @param {boolean} props.isFirst - 是否是第一个section（调整间距）
 */
const MainSection = ({ icon, title, primaryColor, children, isFirst = false }) => {
  return (
    <Box sx={{ mt: isFirst ? 12 : 11 }}>
      <MainSectionTitle icon={icon} primaryColor={primaryColor}>
        {title}
      </MainSectionTitle>
      {children}
    </Box>
  );
};

export default MainSection;
