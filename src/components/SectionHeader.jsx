import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../hooks/useTranslationLoader';
import SectionTitle from './SectionTitle';
import ActionButtons from './ActionButtons';

/**
 * 统一的节头组件 - 标题 + 操作按钮
 * 
 * @param {Object} props
 * @param {React.RefObject} props.titleRef - 标题引用
 * @param {string} props.title - 标题文本
 * @param {Object} props.titleSx - 标题额外样式
 * @param {boolean} props.showView - 显示查看语言按钮
 * @param {boolean} props.showDownload - 显示下载按钮
 * @param {string} props.downloadText - 下载按钮文字
 * @param {Function} props.onViewClick - 查看按钮点击事件
 * @param {Function} props.onDownloadClick - 下载按钮点击事件
 */
const SectionHeader = ({ 
  titleRef, 
  title,
  titleSx = {},
  showView = false,
  showDownload = false,
  // downloadText = "Download All",
  onViewClick,
  onDownloadClick
}) => {
  const { t } = useTranslation();
  useTranslationLoader();
  const hasActions = showView || showDownload;

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: hasActions ? 'space-between' : 'flex-start',
      mt: hasActions ? 3.5 : 0,
      mb: hasActions ? 3.5 : 2.5
    }}>
      <SectionTitle titleRef={titleRef} sx={titleSx}>
        {title}
      </SectionTitle>

      <ActionButtons
        showView={showView}
        showDownload={showDownload}
        downloadText={t('common.downloadAll')}
        onViewClick={onViewClick}
        onDownloadClick={onDownloadClick}
      />
    </Box>
  );
};

export default SectionHeader;
