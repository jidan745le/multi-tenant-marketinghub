import React from 'react';
import { Typography, Box } from '@mui/material';

/**
 * 主要节标题组件 - 解决重复的主标题样式
 * 
 * @param {Object} props
 * @param {string} props.icon - 图标源
 * @param {string} props.children - 标题文本
 * @param {string} props.primaryColor - 主题色
 */
const MainSectionTitle = ({ icon, children, primaryColor }) => {
  return (
    <Typography 
      variant="h5" 
      sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        fontSize: '30px',
        fontFamily: '"Roboto", sans-serif',
        fontWeight: 900 
      }}
    >
      <Box
        sx={{
          width: '36px',
          height: '36px',
          bgcolor: primaryColor,
          WebkitMask: `url(${icon}) no-repeat center / contain`,
          mask: `url(${icon}) no-repeat center / contain`,
          display: 'inline-block'
        }}
      />
      {children}
    </Typography>
  );
};

export default MainSectionTitle;
