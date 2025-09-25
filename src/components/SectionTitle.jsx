import React from 'react';
import { Typography } from '@mui/material';

/**
 * 统一的节标题组件 - 解决重复代码问题
 * 
 * @param {Object} props
 * @param {React.RefObject} props.titleRef - 标题引用
 * @param {string} props.children - 标题文本
 * @param {Object} props.sx - 额外样式
 */
const SectionTitle = ({ titleRef, children, sx = {} }) => {
  // 统一的标题样式
  const defaultStyles = {
    mb: 2.5,
    fontSize: '24.5px',
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: 520,
    color: '#4d4d4d',
    ...sx
  };

  return (
    <Typography 
      ref={titleRef} 
      variant="h6" 
      sx={defaultStyles}
    >
      {children}
    </Typography>
  );
};

export default SectionTitle;
