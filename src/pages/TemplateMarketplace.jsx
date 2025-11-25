import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import NewPublicationSpecDialog from '../components/NewPublicationSpecDialog';

// 样式化组件
const PageContainer = styled(Box)(() => ({
  background: '#f5f5f5',
  position: 'relative',
  padding: '50px 55px',
  overflow: 'visible',
  width: '100%',
  height: '85vh',
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundBox = styled(Box)(() => ({
  background: '#ffffff',
  minWidth: '1100px',
  width: '100%',
  minHeight: '1508px',
  flex: 1,
  position: 'relative',
  overflow: 'visible',
  padding: '36px 39px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
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
  justifyContent: 'center', 
  width: '100%',
  marginTop: '18px',
  marginBottom: '20px',
}));

const TitleContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: 'calc(750px * 2 + 24px)', 
  justifyContent: 'flex-start', // 标题内容左对齐
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
  justifyContent: 'center', // 为了确保确保左右边距相等
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
  flex: '1 1 calc(50% - 12px)', // 2列布局
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
  minHeight: '450px', 
  height: '450px',
  maxHeight: '450px',
  position: 'relative',
  overflow: 'hidden',
}));

// 模板数据
const templates = [
  {
    id: 1,
    name: 'Template 01',
    description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features that adapt to your specific needs, ensuring optimal performance in any environment. With a user-friendly interface and robust functionality, the Data Sheet Config is perfect for professionals seeking efficiency and organization in their projects.',
  },
  {
    id: 2,
    name: 'Template 02',
    description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features that adapt to your specific needs, ensuring optimal performance in any environment. With a user-friendly interface and robust functionality, the Data Sheet Config is perfect for professionals seeking efficiency and organization in their projects.',
  },
  {
    id: 3,
    name: 'Template 03',
    description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features that adapt to your specific needs, ensuring optimal performance in any environment. With a user-friendly interface and robust functionality, the Data Sheet Config is perfect for professionals seeking efficiency and organization in their projects.',
  },
  {
    id: 4,
    name: 'Template 04',
    description: 'Introducing the Data Sheet Config: a comprehensive tool designed to enhance your workflow and streamline your operations. This innovative solution offers customizable features that adapt to your specific needs, ensuring optimal performance in any environment. With a user-friendly interface and robust functionality, the Data Sheet Config is perfect for professionals seeking efficiency and organization in their projects.',
  },
];

function TemplateMarketplace() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const handleAdd = (templateId) => {
    setSelectedTemplateId(templateId);
    setDialogOpen(true);
  };

  const handleViewPreview = (templateId) => {
    console.log('View preview:', templateId);
    // TODO: 实现预览逻辑
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTemplateId(null);
  };

  const handleDialogConfirm = async (formData) => {
    try {
      // TODO: 实现创建新 publication 的逻辑
      console.log('Confirm new publication:', formData);
      console.log('Selected template ID:', selectedTemplateId);
    
      
      setDialogOpen(false);
      setSelectedTemplateId(null);
    } catch (err) {
      console.error('Failed to create publication:', err);
    }
  };

  return (
    <PageContainer>
      <BackgroundBox>
        <ContentWrapper>
          <TitleContainer>
            <TitleContent>
              <MarketplaceTitle>Marketplace</MarketplaceTitle>
            </TitleContent>
          </TitleContainer>
          
          <TemplatesContainer>
            {templates.map((template) => (
            <TemplateCard key={template.id}>
              <TemplateInfoSection>
                <TemplateInfoContent>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateInfoContent>
                
                <ActionButtons>
                  <ActionButton
                    onClick={() => handleAdd(template.id)}
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
                    View Preview
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
                  {/* 预览内容区域 */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '12px',
                    }}
                  >
                    Preview Area
                  </Box>
                </PreviewContent>
              </PreviewSection>
            </TemplateCard>
          ))}
          </TemplatesContainer>
        </ContentWrapper>
      </BackgroundBox>

      {/* New Publication Spec Dialog */}
      <NewPublicationSpecDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </PageContainer>
  );
}

export default TemplateMarketplace;

