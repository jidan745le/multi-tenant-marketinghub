import React from 'react';
import { Box, Button } from '@mui/material';
import ViewIcon from '../assets/icon/pdp_view.png';
import downloadIcon from '../assets/icon/download.png';

/**
 * 统一的操作按钮组件 - 解决重复按钮代码问题
 * 
 * @param {Object} props
 * @param {boolean} props.showView - 显示查看语言按钮
 * @param {boolean} props.showDownload - 显示下载按钮
 * @param {string} props.downloadText - 下载按钮文字
 * @param {Function} props.onViewClick - 查看按钮点击事件
 * @param {Function} props.onDownloadClick - 下载按钮点击事件
 */
const ActionButtons = ({ 
  showView = false, 
  showDownload = false, 
  downloadText = "Download All",
  onViewClick,
  onDownloadClick
}) => {
  // 统一的按钮样式
  const buttonStyles = {
    bgcolor: '#f7f7f7',
    borderColor: '#cccccc',
    color: '#333333',
    textTransform: 'uppercase',
    height: '40px',
    borderRadius: '3.87px',
    fontSize: '15px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
    fontFamily: '"Roboto-Medium", sans-serif',
    fontWeight: 700,
    px: 2,
    width: 'auto',
    minWidth: '160px',
    '&:hover': { 
      bgcolor: '#eaeaea', 
      borderColor: '#cccccc', 
      color: '#000000' 
    }
  };

  if (!showView && !showDownload) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {showView && (
        <Button
          variant="outlined"
          startIcon={
            <Box component="img" src={ViewIcon} alt="view" sx={{ width: 20, height: 20, display: 'block' }} />
          }
          onClick={onViewClick}
          sx={buttonStyles}
        >
          Show Languages
        </Button>
      )}

      {showDownload && (
        <Button
          variant="outlined"
          startIcon={
            <Box component="img" src={downloadIcon} alt="download" sx={{ width: 20, height: 20, display: 'block' }} />
          }
          onClick={onDownloadClick}
          sx={{
            ...buttonStyles,
            minWidth: downloadText.length > 12 ? '200px' : '160px'
          }}
        >
          {downloadText}
        </Button>
      )}
    </Box>
  );
};

export default ActionButtons;
