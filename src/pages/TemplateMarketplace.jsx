import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import NewPublicationSpecDialog from '../components/NewPublicationSpecDialog';
import templateApi from '../services/templateApi';
import fileApi from '../services/fileApi';
import CookieService from '../utils/cookieService';

// 样式化组件
const PageContainer = styled(Box)(({ theme }) => ({
  background: '#f5f5f5',
  position: 'relative',
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  paddingBottom: theme.spacing(6),
  overflow: 'visible',
  width: '100%',
  minHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  minWidth: '1100px',
  width: '100%',
  minHeight: 'auto',
  position: 'relative',
  overflow: 'visible',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  alignSelf: 'flex-start', // 防止拉伸，保持顶部对齐
  borderRadius: '4px',
}));

const ContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flex: 1,
  padding: '0px 24px', 
  boxSizing: 'border-box',
}));

const TitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start', 
  width: '100%',
  marginTop: '18px',
  marginBottom: '20px',
}));

const MarketplaceTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: 'var(--title-medium-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--title-medium-font-size, 20px)',
  lineHeight: 'var(--title-medium-line-height, 24px)',
  letterSpacing: 'var(--title-medium-letter-spacing, 0.15px)',
  fontWeight: 'var(--title-medium-font-weight, 500)',
  maxWidth: '500px',
}));

const TemplatesContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '24px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start', // 左对齐，确保奇数个时最后一个靠左
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  width: '100%',
  flex: 1,
  position: 'relative',
  marginTop: '16px',
}));

const TemplateCard = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'row',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  minWidth: '420px', 
  flex: '0 1 calc(50% - 12px)', // 2列布局，不拉伸，确保奇数个时最后一个靠左
  maxWidth: '750px', 
  position: 'relative',
}));

const TemplateInfoSection = styled(Box)(() => ({
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  flexShrink: 0,
  minWidth: '202px', 
  width: '48%',
  minHeight: '520px',
  height: '520px',
  maxHeight: '520px',
  position: 'relative',
}));

const TemplateInfoContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
}));

const TemplateName = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: 'var(--title-large-font-family, "Roboto-Regular", sans-serif)',
  fontSize: 'var(--title-large-font-size, 22px)',
  lineHeight: 'var(--title-large-line-height, 28px)',
  fontWeight: 'var(--title-large-font-weight, 400)',
  position: 'relative',
  alignSelf: 'stretch',
  height: '28.13px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const TemplateDescription = styled(Typography)(() => ({
  color: '#1f1f1f',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '10px',
  lineHeight: '150%',
  letterSpacing: '0.22px',
  fontWeight: 400,
  position: 'relative',
  alignSelf: 'stretch',
}));

const ActionButtons = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
  marginLeft: 'auto', 
}));

const ActionButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  width: '196px',
  color: theme.palette.primary.main, 
  textTransform: 'none',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '150%',
  letterSpacing: '0.22px',
  fontWeight: 400,
  padding: '0',
  minWidth: 'auto',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    transform: 'scale(1.02)',
  },
  '&:focus': {
    backgroundColor: 'transparent',
    outline: 'none',
  },
  '&:active': {
    backgroundColor: 'transparent',
  },
  '& .MuiTouchRipple-root': {
    display: 'none', 
  },
}));

const IconButton = styled(Box)(() => ({
  flexShrink: 0,
  width: '30px',
  height: '30px',
  position: 'relative',
  transform: 'rotate(90deg)',
  aspectRatio: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const IconCircle = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main, 
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const IconText = styled('span')(() => ({
  color: '#ffffff',
  textAlign: 'center',
  fontFamily: '"Material Symbols Outlined"',
  fontSize: '24px',
  fontWeight: 400,
  transform: 'rotate(-90deg)',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PreviewSection = styled(Box)(() => ({
  padding: '30px 24px 30px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minWidth: '218px', 
  width: '52%', 
}));

const PreviewContent = styled(Box)(() => ({
  background: '#ffffff',
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px',
  flexShrink: 0,
  minWidth: '180px', 
  width: '100%',
  maxWidth: '320px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '320 / 450', // 保持宽高比，基于常见的 PDF 预览比例
}));

function TemplateMarketplace() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [templateImages, setTemplateImages] = useState({}); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const imageUrlsRef = useRef([]); 
  const imageBlobUrlsRef = useRef(new Map()); 

  // 获取模板列表
  useEffect(() => {
    const imageUrls = imageUrlsRef.current;
    const blobUrls = imageBlobUrlsRef.current;

    const loadAuthenticatedImage = async (imageUrl, templateId) => {
      try {
        if (imageBlobUrlsRef.current.has(templateId)) {
          const cachedUrl = imageBlobUrlsRef.current.get(templateId);
          setTemplateImages(prev => ({ ...prev, [templateId]: cachedUrl }));
          return cachedUrl;
        }

        const token = CookieService.getToken();
        if (!token) {
          console.error('No authentication token available');
          return null;
        }

        const headers = fileApi.getHeaders(false);

        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Token may be expired or invalid');
          }
          throw new Error(`Failed to load image: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // 缓存blob URL
        imageBlobUrlsRef.current.set(templateId, blobUrl);
        imageUrlsRef.current.push(blobUrl);
        setTemplateImages(prev => ({ ...prev, [templateId]: blobUrl }));
        
        return blobUrl;
      } catch (error) {
        console.error('Error loading authenticated image:', error);
        return null;
      }
    };

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        // 只获取 Global 类型的模板
        const data = await templateApi.getTemplates();
        const globalTemplates = (data || []).filter(template => 
          template.templateTypeName === 'Global' ||
          template.templateType === 'Global'
        );
        console.log('globalTemplates1111', globalTemplates);
        setTemplates(globalTemplates);
        
        // 加载所有模板的图片
        globalTemplates.forEach(template => {
          if (template.iconFileId) {
            const imageUrl = `/srv/v1.0/main/files/${template.iconFileId}`;
            loadAuthenticatedImage(imageUrl, template.id);
          }
        });
        
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError(err.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();

    // 清理函数：释放图片 URL
    return () => {
      imageUrls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
      imageUrlsRef.current = [];
      
      blobUrls.forEach(url => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleAdd = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleViewPreview = async (templateId) => {
    try {
      // 获取模板详情以获取 pdfFileId
      const templateData = await templateApi.getTemplateById(templateId);
      
      if (!templateData.pdfFileId) {
        console.warn('No PDF file available for preview');
        return;
      }

      const token = CookieService.getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      // 构建 PDF URL
      const pdfUrl = `/srv/v1.0/main/files/${templateData.pdfFileId}`;
      
      const headers = fileApi.getHeaders(false);
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // 在新标签页打开 PDF
      window.open(blobUrl, '_blank');
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error('Failed to open PDF preview:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTemplate(null);
  };

  const handleDialogConfirm = async (formData) => {
    try {
      if (!selectedTemplate) {
        throw new Error('No template selected');
      }

      // 获取类型ID
      const typeId = await templateApi.getTypeId(formData.type);
      
      if (!typeId) {
        throw new Error(`Failed to get type ID for ${formData.type}`);
      }
      
      const templateTypeId = await templateApi.getTemplateTypeId('Specific');
      
      if (!templateTypeId) {
        throw new Error('Failed to get template type ID for Specific');
      }
      
      // 构建模板元数据
      const metadata = {
        name: formData.name,
        description: formData.description || '',
        usage: formData.usage || [],
        typeId: typeId,
        typeName: formData.type,
        templateTypeId: templateTypeId,
        parentId: selectedTemplate.id, // 基于选中的 Global 模板创建
        html: selectedTemplate.html || '',
        css: selectedTemplate.css || '',
        pdfPerModel: selectedTemplate.pdfPerModel || false,
        // 添加文件ID（如果已上传）
        iconFileId: formData.iconFileId || null,
        pdfFileId: formData.pdfFileId || null,
      };

      await templateApi.createTemplate(metadata);

      setDialogOpen(false);
      setSelectedTemplate(null);
      
      // 可以在这里添加成功提示或刷新列表
      console.log('Publication created successfully');
    } catch (err) {
      console.error('Failed to create publication:', err);
      // 可以在这里添加错误提示
      throw err;
    }
  };

  return (
    <PageContainer>
      <BackgroundBox>
        <ContentWrapper>
          <TitleContainer>
            <MarketplaceTitle>Marketplace</MarketplaceTitle>
          </TitleContainer>
          
          <TemplatesContainer>
            {loading ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  color: '#d32f2f',
                }}
              >
                <Typography>Error: {error}</Typography>
              </Box>
            ) : templates.length === 0 ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  color: '#999',
                }}
              >
                <Typography>No templates found</Typography>
              </Box>
            ) : (
              templates.map((template) => (
                <TemplateCard key={template.id}>
                  <TemplateInfoSection>
                    <TemplateInfoContent>
                      <TemplateName>{template.name || 'Unnamed Template'}</TemplateName>
                      <TemplateDescription>{template.description || 'No description available'}</TemplateDescription>
                    </TemplateInfoContent>
                    
                    <ActionButtons>
                      <ActionButton
                        onClick={() => handleAdd(template)}
                        disableRipple
                      >
                        ADD
                        <IconButton>
                          <IconCircle>
                            <IconText>add</IconText>
                          </IconCircle>
                        </IconButton>
                      </ActionButton>
                      
                      <ActionButton
                        onClick={() => handleViewPreview(template.id)}
                        disableRipple
                      >
                        PREVIEW
                        <IconButton>
                          <IconCircle>
                            <IconText>arrow_upward</IconText>
                          </IconCircle>
                        </IconButton>
                      </ActionButton>
                    </ActionButtons>
                  </TemplateInfoSection>
                  
                  <PreviewSection>
                    <PreviewContent>
                      {templateImages[template.id] ? (
                        <img
                          src={templateImages[template.id]}
                          alt={template.name || 'Template preview'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            minHeight: '440px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '12px',
                          }}
                        >
                          Preview Area
                        </Box>
                      )}
                    </PreviewContent>
                  </PreviewSection>
                </TemplateCard>
              ))
            )}
          </TemplatesContainer>
        </ContentWrapper>
      </BackgroundBox>

      {/* New Publication Spec Dialog */}
      <NewPublicationSpecDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        initialData={selectedTemplate ? {
          name: selectedTemplate.name,
          description: selectedTemplate.description,
          usage: selectedTemplate.usage,
          type: selectedTemplate.typeName,
          // 传递所有字段，但对话框只使用需要的字段
          ...selectedTemplate,
        } : null}
      />
    </PageContainer>
  );
}

export default TemplateMarketplace;

