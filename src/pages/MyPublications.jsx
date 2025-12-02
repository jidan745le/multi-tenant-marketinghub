import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import templateApi from '../services/templateApi';

// 样式化组件
const PageContainer = styled(Box)(() => ({
  background: '#f5f5f5',
  position: 'relative',
  padding: '50px 55px',
  overflow: 'visible', 
  width: '100%',
  height: '85vh', // 使用视口高度
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundBox = styled(Box)(() => ({
  background: '#ffffff',
  minWidth: '1180px',
  width: '100%', 
  minHeight: '533px', 
  flex: 1, 
  position: 'relative', 
  overflow: 'visible',
  padding: '36px 39px', 
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
}));

const PublicationsTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: 'var(--title-medium-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--title-medium-font-size, 20px)',
  lineHeight: 'var(--title-medium-line-height, 24px)',
  letterSpacing: 'var(--title-medium-letter-spacing, 0.15px)',
  fontWeight: 'var(--title-medium-font-weight, 500)',
  marginBottom: '20px', 
  width: '100%',
  marginTop: '18px',
  maxWidth: '500px',
}));

const ContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '36px', 
  alignItems: 'flex-start',
  flex: 1,
  width: '100%',
  position: 'relative',
}));

const LeftSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: '550px',
  minWidth: '550px',
}));

const MainContainer = styled(Box)(({ theme }) => ({
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main, 
  borderWidth: '1px',
  width: '100%',
  height: '382px', 
  maxHeight: '382px', 
  marginTop: '18px',
  position: 'relative',
  paddingTop: '37px', 
  boxSizing: 'border-box',
  overflow: 'hidden',
}));

const LabelContainer = styled(Box)(() => ({
  padding: '0px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'absolute',
  left: '0px',
  top: '22px',
  right: '0px',
  bottom: '0px',
  maxHeight: 'calc(100% - 37px)',
  overflowY: 'auto', 
  overflowX: 'hidden',
  // 自定义滚动条样式
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#cccccc',
    borderRadius: '10px',
    '&:hover': {
      background: '#b3b3b3',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#cccccc transparent',
}));

const LabelItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
}));

const Label = styled(Typography)(({ selected, theme }) => ({
  color: selected ? theme.palette.primary.main : '#000000',
  textAlign: 'left',
  fontFamily: 'var(--body-medium-font-family, "Roboto-Regular", sans-serif)',
  fontSize: 'var(--body-medium-font-size, 14px)',
  lineHeight: 'var(--body-medium-line-height, 20px)',
  letterSpacing: 'var(--body-medium-letter-spacing, 0.25px)',
  fontWeight: 'var(--body-medium-font-weight, 400)',
  position: 'relative',
  flex: 1,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  transition: 'color 0.2s ease', 
}));

const MiddleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '37px',
  paddingTop: '28px',
  alignSelf: 'flex-start',
}));

const ArrowSectionWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '36px',
  width: '100%',
  alignItems: 'flex-start',
}));

const RightSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px', // Internal 和 External 之间的间距
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
  minWidth: '350px', 
}));

const BoxContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  minWidth: '350px',
}));

const BoxTitle = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: 'var(--title-small-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--title-small-font-size, 14px)',
  lineHeight: 'var(--title-small-line-height, 20px)',
  letterSpacing: 'var(--title-small-letter-spacing, 0.1px)',
  fontWeight: 'var(--title-small-font-weight, 500)',
  position: 'relative',
  alignSelf: 'stretch',
}));

const InternalContainer = styled(Box)(() => ({
  flexShrink: 0,
  width: '100%',
  height: '167px', 
  maxHeight: '167px', 
  position: 'relative',
  overflow: 'hidden',
}));

const InternalLabelContainer = styled(Box)(() => ({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'absolute',
  left: '0px',
  top: '0px',
  right: '0px',
  bottom: '0px',
  maxHeight: '167px', 
  overflowY: 'auto', 
  overflowX: 'hidden',
  zIndex: 1, 
  // 自定义滚动条样式
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#cccccc',
    borderRadius: '10px',
    '&:hover': {
      background: '#b3b3b3',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#cccccc transparent',
}));

const InternalBoxBorder = styled(Box)(() => ({
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  opacity: 0.48,
  width: '100%',
  height: '167px',
  position: 'absolute',
  left: '0px',
  top: '0px',
  right: '0px',
  pointerEvents: 'none', 
}));

const InternalBox = styled(BoxContainer)(() => ({}));

const ExternalBox = styled(BoxContainer)(() => ({}));

const ExternalContainer = styled(Box)(() => ({
  flexShrink: 0,
  width: '100%',
  height: '167px', 
  maxHeight: '167px', 
  position: 'relative',
  overflow: 'hidden', 
}));

const ExternalLabelContainer = styled(Box)(() => ({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'absolute',
  left: '0px',
  top: '0px',
  right: '0px',
  bottom: '0px',
  maxHeight: '167px',
  overflowY: 'auto', 
  overflowX: 'hidden',
  zIndex: 1, 
  // 自定义滚动条样式
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#cccccc',
    borderRadius: '10px',
    '&:hover': {
      background: '#b3b3b3',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#cccccc transparent',
}));

const ExternalBoxBorder = styled(Box)(() => ({
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  opacity: 0.48,
  width: '100%',
  height: '167px',
  position: 'absolute',
  left: '0px',
  top: '0px',
  right: '0px',
  pointerEvents: 'none', 
}));

const NavigationArrows = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginTop: '24px',
}));

const ArrowButton = styled(Box)(({ active }) => ({
  alignSelf: 'stretch',
  flexShrink: 0,
  height: '37px',
  position: 'relative',
  cursor: active ? 'pointer' : 'default',
  transform: 'rotate(90deg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: active ? 'auto' : 'none', 
  opacity: active ? 1 : 0.5, 
}));

const ArrowCircle = styled(Box)(({ active, theme }) => ({
  background: active ? theme.palette.primary.main : '#cccccc', // 使用主题色
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ArrowIcon = styled(ArrowUpwardIcon)(() => ({
  color: '#ffffff',
  fontSize: '24px',
  zIndex: 1,
}));

const ArrowButtonDown = styled(ArrowButton)(() => ({
  transform: 'rotate(-90deg)',
}));

const TopArrows = styled(NavigationArrows)(() => ({}));

const BottomArrows = styled(NavigationArrows)(() => ({}));

function MyPublications() {
  // 存储所有模板数据（只包含 id、name、usage）
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 管理选中的项 - 分别管理每个框的选中状态（使用 id）
  const [selectedInMain, setSelectedInMain] = useState(new Set());
  const [selectedInInternal, setSelectedInInternal] = useState(new Set());
  const [selectedInExternal, setSelectedInExternal] = useState(new Set());

  // 根据 usage 分类数据
  const getTemplatesByUsage = () => {
    const mainTemplates = []; // usage 为空或没有 usage
    const internalTemplates = []; // usage 包含 internal
    const externalTemplates = []; // usage 包含 external

    allTemplates.forEach(template => {
      const usage = template.usage || [];
      const hasInternal = usage.some(u => 
        typeof u === 'string' && u.toLowerCase() === 'internal'
      );
      const hasExternal = usage.some(u => 
        typeof u === 'string' && u.toLowerCase() === 'external'
      );

      if (!hasInternal && !hasExternal) {
        mainTemplates.push(template);
      }
      if (hasInternal) {
        internalTemplates.push(template);
      }
      if (hasExternal) {
        externalTemplates.push(template);
      }
    });

    return { mainTemplates, internalTemplates, externalTemplates };
  };

  const { mainTemplates, internalTemplates, externalTemplates } = getTemplatesByUsage();

  // 获取模板数据
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const templates = await templateApi.getTemplates();
        // 只保留 id、name、usage 字段
        const simplifiedTemplates = templates.map(t => ({
          id: t.id,
          name: t.name,
          usage: t.usage || []
        }));
        setAllTemplates(simplifiedTemplates);
      } catch (error) {
        console.error('获取模板数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleItemClick = (templateId, source) => {
    const setters = {
      main: setSelectedInMain,
      internal: setSelectedInInternal,
      external: setSelectedInExternal
    };
    const setter = setters[source];
    if (setter) {
      setter((prev) => {
        const newSet = new Set(prev);
        newSet.has(templateId) ? newSet.delete(templateId) : newSet.add(templateId);
        return newSet;
      });
    }
  };

  const hasSelectedInMainList = selectedInMain.size > 0;
  const hasSelectedInInternalList = selectedInInternal.size > 0;
  const hasSelectedInExternalList = selectedInExternal.size > 0;

  const canMoveToInternal = hasSelectedInMainList && Array.from(selectedInMain).some(id => {
    const template = allTemplates.find(t => t.id === id);
    if (!template) return false;
    const usage = template.usage || [];
    return !usage.some(u => typeof u === 'string' && u.toLowerCase() === 'internal');
  });

  const canMoveToExternal = hasSelectedInMainList && Array.from(selectedInMain).some(id => {
    const template = allTemplates.find(t => t.id === id);
    if (!template) return false;
    const usage = template.usage || [];
    return !usage.some(u => typeof u === 'string' && u.toLowerCase() === 'external');
  });

  const isInternalLeftArrowActive = hasSelectedInInternalList;
  const isExternalLeftArrowActive = hasSelectedInExternalList;

  // 更新模板的 usage
  const updateTemplateUsage = async (templateId, newUsage) => {
    try {
      // 获取 tenant 和 theme
      const tenant = templateApi.getTenantName();
      const theme = templateApi.getThemeFromUrl();
      
      // 传递 usage、tenant 和 theme
      await templateApi.updateTemplate(templateId, { 
        usage: newUsage,
        tenant: tenant,
        theme: theme
      });
      // 更新本地状态
      setAllTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, usage: newUsage } : t
      ));
    } catch (error) {
      console.error('更新模板 usage 失败:', error);
      throw error;
    }
  };

  const handleMoveToInternal = async () => {
    if (!canMoveToInternal) return;
    
    const selectedIds = Array.from(selectedInMain);
    const templatesToUpdate = allTemplates.filter(t => selectedIds.includes(t.id));
    
    // 更新每个模板的 usage
    const updatePromises = templatesToUpdate.map(template => {
      const currentUsage = template.usage || [];
      const hasInternal = currentUsage.some(u => 
        typeof u === 'string' && u.toLowerCase() === 'internal'
      );
      
      if (!hasInternal) {
        const newUsage = [...currentUsage, 'Internal'];
        return updateTemplateUsage(template.id, newUsage);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(updatePromises);
      setSelectedInMain(new Set());
    } catch (error) {
      console.error('移动到 Internal 失败:', error);
    }
  };

  const handleMoveToExternal = async () => {
    if (!canMoveToExternal) return;
    
    const selectedIds = Array.from(selectedInMain);
    const templatesToUpdate = allTemplates.filter(t => selectedIds.includes(t.id));
    
    // 更新每个模板的 usage
    const updatePromises = templatesToUpdate.map(template => {
      const currentUsage = template.usage || [];
      const hasExternal = currentUsage.some(u => 
        typeof u === 'string' && u.toLowerCase() === 'external'
      );
      
      if (!hasExternal) {
        const newUsage = [...currentUsage, 'External'];
        return updateTemplateUsage(template.id, newUsage);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(updatePromises);
      setSelectedInMain(new Set());
    } catch (error) {
      console.error('移动到 External 失败:', error);
    }
  };

  const handleMoveFromInternal = async () => {
    if (!hasSelectedInInternalList) return;
    
    const selectedIds = Array.from(selectedInInternal);
    const templatesToUpdate = allTemplates.filter(t => selectedIds.includes(t.id));
    
    // 更新每个模板的 usage，移除 Internal
    const updatePromises = templatesToUpdate.map(template => {
      const currentUsage = template.usage || [];
      const newUsage = currentUsage.filter(u => 
        typeof u === 'string' && u.toLowerCase() !== 'internal'
      );
      return updateTemplateUsage(template.id, newUsage);
    });

    try {
      await Promise.all(updatePromises);
      setSelectedInInternal(new Set());
    } catch (error) {
      console.error('从 Internal 移出失败:', error);
    }
  };

  const handleMoveFromExternal = async () => {
    if (!hasSelectedInExternalList) return;
    
    const selectedIds = Array.from(selectedInExternal);
    const templatesToUpdate = allTemplates.filter(t => selectedIds.includes(t.id));
    
    // 更新每个模板的 usage，移除 External
    const updatePromises = templatesToUpdate.map(template => {
      const currentUsage = template.usage || [];
      const newUsage = currentUsage.filter(u => 
        typeof u === 'string' && u.toLowerCase() !== 'external'
      );
      return updateTemplateUsage(template.id, newUsage);
    });

    try {
      await Promise.all(updatePromises);
      setSelectedInExternal(new Set());
    } catch (error) {
      console.error('从 External 移出失败:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <BackgroundBox>
          <PublicationsTitle>Publications</PublicationsTitle>
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
        </BackgroundBox>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackgroundBox>
        <PublicationsTitle>Publications</PublicationsTitle>
        
        <ContentWrapper>
          <LeftSection>
            <MainContainer>
              <LabelContainer>
                {mainTemplates.map((template) => {
                  const isSelected = selectedInMain.has(template.id);
                  return (
                    <LabelItem 
                      key={template.id} 
                      onClick={() => handleItemClick(template.id, 'main')}
                    >
                      <Label selected={isSelected}>{template.name}</Label>
                    </LabelItem>
                  );
                })}
              </LabelContainer>
            </MainContainer>
          </LeftSection>

          <RightSection>
            <ArrowSectionWrapper>
              <MiddleSection>
                <TopArrows>
                  <ArrowButton 
                    active={canMoveToInternal}
                    onClick={handleMoveToInternal}
                  >
                    <ArrowCircle active={canMoveToInternal}>
                      <ArrowIcon active={canMoveToInternal} />
                    </ArrowCircle>
                  </ArrowButton>
                  <ArrowButtonDown 
                    active={isInternalLeftArrowActive}
                    onClick={handleMoveFromInternal}
                  >
                    <ArrowCircle active={isInternalLeftArrowActive}>
                      <ArrowIcon active={isInternalLeftArrowActive} />
                    </ArrowCircle>
                  </ArrowButtonDown>
                </TopArrows>
              </MiddleSection>

              <InternalBox>
                <BoxTitle>Internal</BoxTitle>
                <InternalContainer>
                  <InternalLabelContainer>
                    {internalTemplates.map((template) => {
                      const isSelected = selectedInInternal.has(template.id);
                      return (
                        <LabelItem 
                          key={template.id} 
                          onClick={() => handleItemClick(template.id, 'internal')}
                        >
                          <Label selected={isSelected}>{template.name}</Label>
                        </LabelItem>
                      );
                    })}
                  </InternalLabelContainer>
                  <InternalBoxBorder />
                </InternalContainer>
              </InternalBox>
            </ArrowSectionWrapper>

            <ArrowSectionWrapper>
              <MiddleSection>
                <BottomArrows>
                  <ArrowButton 
                    active={canMoveToExternal}
                    onClick={handleMoveToExternal}
                  >
                    <ArrowCircle active={canMoveToExternal}>
                      <ArrowIcon active={canMoveToExternal} />
                    </ArrowCircle>
                  </ArrowButton>
                  <ArrowButtonDown 
                    active={isExternalLeftArrowActive}
                    onClick={handleMoveFromExternal}
                  >
                    <ArrowCircle active={isExternalLeftArrowActive}>
                      <ArrowIcon active={isExternalLeftArrowActive} />
                    </ArrowCircle>
                  </ArrowButtonDown>
                </BottomArrows>
              </MiddleSection>

              <ExternalBox>
                <BoxTitle>External</BoxTitle>
                <ExternalContainer>
                  <ExternalLabelContainer>
                    {externalTemplates.map((template) => {
                      const isSelected = selectedInExternal.has(template.id);
                      return (
                        <LabelItem 
                          key={template.id} 
                          onClick={() => handleItemClick(template.id, 'external')}
                        >
                          <Label selected={isSelected}>{template.name}</Label>
                        </LabelItem>
                      );
                    })}
                  </ExternalLabelContainer>
                  <ExternalBoxBorder />
                </ExternalContainer>
              </ExternalBox>
            </ArrowSectionWrapper>
          </RightSection>
        </ContentWrapper>
      </BackgroundBox>
    </PageContainer>
  );
}

export default MyPublications;

