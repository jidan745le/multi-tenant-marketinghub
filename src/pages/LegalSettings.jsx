import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { marked } from 'marked';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import TurndownService from 'turndown';
import { SectionCard, SubTitle } from '../components/SettingsComponents';
import { useBrand } from '../hooks/useBrand';
import { selectCurrentLanguage } from '../store/slices/themesSlice';
import { createNotification, updateThemeWithLocale, validateBrandData } from '../utils/themeUpdateUtils';

// 样式化保存按钮 - 参考 Look&Feel 页面
const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

// Markdown编辑器容器
const MarkdownEditorContainer = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '8px 0 0 8px', // 只有左侧圆角
  border: '1px solid #cccccc',
  borderRight: 'none', // 移除右侧border，避免重复
  height: '530px',
  position: 'relative',
  overflow: 'hidden'
}));

// 预览按钮
const PreviewButton = styled(IconButton)(({ theme }) => ({
  // background: theme.palette.primary.main,
  width: '37px',
  height: '37px',
  position: 'absolute',
  right: '16px',
  bottom: '16px',
  zIndex: 10,
  // '&:hover': {
  //   background: theme.palette.primary.dark,
  // },
  // '& img': {
  //   width: '24px',
  //   height: '24px',
  //   filter: 'brightness(0) invert(1)' // 使图标变白
  // }
}));

// 预览容器
const PreviewContainer = styled(Box)(({ theme }) => ({
  background: '#f5f5f5',
  borderRadius: '0 8px 8px 0', // 只有右侧圆角
  border: '1px solid #cccccc',
  borderLeft: 'none', // 移除左侧border，避免重复
  height: '530px',
  padding: '20px',
  overflow: 'auto',
  fontFamily: '"Roboto", sans-serif',
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: theme.palette.primary.main,
    marginTop: '20px',
    marginBottom: '10px'
  },
  '& p': {
    lineHeight: 1.6,
    marginBottom: '16px'
  },
  '& ul, & ol': {
    paddingLeft: '20px',
    marginBottom: '16px'
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: '16px',
    margin: '16px 0',
    fontStyle: 'italic',
    background: '#ffffff',
    padding: '16px'
  },
  '& code': {
    background: '#ffffff',
    padding: '2px 4px',
    borderRadius: '3px',
    fontFamily: 'monospace'
  }
}));

function LegalSettings() {
  const { currentBrand } = useBrand();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // 预览状态
  const [previewTerms, setPreviewTerms] = useState(false);
  const [previewPrivacy, setPreviewPrivacy] = useState(false);
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    termsCondition: '',
    privayPolicy: ''
  });

  // 初始化 Turndown 服务
  const turndownService = new TurndownService({
    headingStyle: 'atx', // 使用 # 风格的标题
    codeBlockStyle: 'fenced' // 使用 ``` 风格的代码块
  });

  // HTML转Markdown函数
  const htmlToMarkdown = (html) => {
    if (!html) return '';
    
    // 更精确的Markdown格式检查
    const hasMarkdownSyntax = /^#+\s|\*\*.*\*\*|\*.*\*|^\>|\[.*\]\(.*\)/m.test(html);
    const hasHtmlTags = /<[^>]+>/.test(html);
    
    // 如果没有HTML标签且有Markdown语法，认为已经是Markdown
    if (!hasHtmlTags && hasMarkdownSyntax) {
      return html;
    }
    
    // 如果没有HTML标签也没有Markdown语法，是纯文本
    if (!hasHtmlTags && !hasMarkdownSyntax) {
      return html;
    }
    
    try {
      // 在转换前先清理一些可能导致问题的HTML实体
      const cleanedHtml = html
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
        
      const markdown = turndownService.turndown(cleanedHtml);
      
      // 清理转换后可能存在的多余空行
      return markdown
        .replace(/\n{3,}/g, '\n\n') // 将3个或更多连续换行替换为2个
        .replace(/^\s+|\s+$/g, ''); // 去除首尾空白
        
    } catch (error) {
      console.warn('HTML转Markdown失败，使用原始内容:', error);
      return html;
    }
  };

  // 从当前品牌数据中加载legal配置
  useEffect(() => {
    if (currentBrand?.legal) {
      setFormData({
        termsCondition: htmlToMarkdown(currentBrand.legal.termsCondition || ''),
        privayPolicy: htmlToMarkdown(currentBrand.legal.privayPolicy || '')
      });
    }
  }, [currentBrand]);

  // 处理表单字段变化
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Markdown转HTML函数 - 使用marked库避免转义累积问题
  const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    // 首先清理可能已经存在的HTML标签，避免重复转换
    let cleanedMarkdown = markdown
      .replace(/<br\s*\/?>/gim, '\n') // 将已存在的<br>转回换行符
      .replace(/<\/(h[1-6]|p|strong|em|blockquote|a)>/gim, '') // 移除结束标签
      .replace(/<(h[1-6]|p|strong|em|blockquote|a)[^>]*>/gim, '') // 移除开始标签
      .replace(/&nbsp;/gim, ' ') // 替换HTML空格
      .replace(/&lt;/gim, '<') // 反转义
      .replace(/&gt;/gim, '>') // 反转义
      .replace(/&amp;/gim, '&'); // 反转义，必须放在最后
    
    try {
      // 使用marked库进行转换，避免手动正则表达式的问题
      return marked.parse(cleanedMarkdown, {
        breaks: true, // 支持换行转<br>
        gfm: true     // 支持GitHub风格Markdown
      });
    } catch (error) {
      console.warn('Markdown转HTML失败，使用原始内容:', error);
      return cleanedMarkdown;
    }
  };

  // 保存Legal配置 - 使用通用工具函数
  const handleSaveLegal = async () => {
    try {
      setLoading(true);
      
      // 验证品牌数据
      const validation = validateBrandData(currentBrand);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('🔄 开始保存Legal配置...');

      // 准备更新数据 - 将Markdown转换为HTML
      const updateData = {
        legal: {
          termsCondition: markdownToHtml(formData.termsCondition),
          privayPolicy: markdownToHtml(formData.privayPolicy)
        }
      };

      // 使用通用更新函数 - 支持locale和Redux刷新
      await updateThemeWithLocale({
        documentId: currentBrand.strapiData.documentId,
        updateData,
        currentLanguage,
        dispatch,
        description: 'Legal配置'
      });

      setNotification(createNotification(true, 'Legal配置保存成功！'));
    } catch (error) {
      console.error('保存Legal配置失败:', error);
      setNotification(createNotification(false, `保存失败: ${error.message}`));
    } finally {
      setLoading(false);
    }
  };

  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Terms & Condition Section */}
      <SectionCard>
        <SubTitle>TERMS & CONDITION</SubTitle>
        <Box sx={{ display: 'flex', gap: 0, height: '530px' }}>
          {/* 左侧：Markdown编辑器 */}
          <Box sx={{ flex: 1 }}>
            <MarkdownEditorContainer>
              <TextField
                fullWidth
                multiline
                placeholder="# Terms & Condition

Enter your terms and conditions in **Markdown** format...

## Example Section
- Point 1
- Point 2

> Important note

[Link example](https://example.com)"
                value={formData.termsCondition}
                onChange={(e) => handleFieldChange('termsCondition', e.target.value)}
                variant="outlined"
                sx={{
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    backgroundColor: 'white',
                    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    alignItems: 'flex-start'
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    padding: '18px',
                    overflow: 'auto !important',
                    resize: 'none',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
              <PreviewButton onClick={() => setPreviewTerms(true)}>
                <img src="/assets/upload.svg" alt="Preview" />
              </PreviewButton>
            </MarkdownEditorContainer>
          </Box>

          {/* 右侧：预览区域 */}
          <Box sx={{ flex: 1 }}>
            <PreviewContainer>
              {previewTerms ? (
                <ReactMarkdown>{formData.termsCondition || '# Terms & Condition\n\nPreview will appear here when you start typing...'}</ReactMarkdown>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999',
                  flexDirection: 'column',
                  gap: 0
                }}>
                  <Typography variant="h6" color="inherit">
                    Preview
                  </Typography>
                  <Typography variant="body2" color="inherit" textAlign="center">
                    Click the preview button to see your Markdown rendered as HTML
                  </Typography>
                </Box>
              )}
            </PreviewContainer>
          </Box>
        </Box>
      </SectionCard>

      {/* Privacy Policy Section */}
      <SectionCard>
        <SubTitle>PRIVACY POLICY</SubTitle>
        <Box sx={{ display: 'flex', gap: 0, height: '530px' }}>
          {/* 左侧：Markdown编辑器 */}
          <Box sx={{ flex: 1 }}>
            <MarkdownEditorContainer>
              <TextField
                fullWidth
                multiline
                placeholder="# Privacy Policy

Enter your privacy policy in **Markdown** format...

## Data Collection
We collect the following information:
- Personal information
- Usage data

## Data Usage
Your data is used for:
1. Service provision
2. Communication

> Your privacy is important to us."
                value={formData.privayPolicy}
                onChange={(e) => handleFieldChange('privayPolicy', e.target.value)}
                variant="outlined"
                sx={{
                  height: '100%',
                  '& .MuiInputBase-root': {
                    height: '100%',
                    backgroundColor: 'white',
                    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    alignItems: 'flex-start'
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    padding: '18px',
                    overflow: 'auto !important',
                    resize: 'none',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
              <PreviewButton onClick={() => setPreviewPrivacy(true)}>
                <img src="/assets/upload.svg" alt="Preview" />
              </PreviewButton>
            </MarkdownEditorContainer>
          </Box>

          {/* 右侧：预览区域 */}
          <Box sx={{ flex: 1 }}>
            <PreviewContainer>
              {previewPrivacy ? (
                <ReactMarkdown>{formData.privayPolicy || '# Privacy Policy\n\nPreview will appear here when you start typing...'}</ReactMarkdown>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999',
                  flexDirection: 'column',
                  gap: 0
                }}>
                  <Typography variant="h6" color="inherit">
                    Preview
                  </Typography>
                  <Typography variant="body2" color="inherit" textAlign="center">
                    Click the preview button to see your Markdown rendered as HTML
                  </Typography>
                </Box>
              )}
            </PreviewContainer>
          </Box>
        </Box>
      </SectionCard>

      {/* 保存按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <SaveButton 
          variant="contained" 
          onClick={handleSaveLegal}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
          Save Configuration
        </SaveButton>
      </Box>

      {/* 通知消息 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LegalSettings; 