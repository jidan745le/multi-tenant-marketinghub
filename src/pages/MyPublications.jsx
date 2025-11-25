import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

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
  // 数据表列表
  const [dataSheets, setDataSheets] = useState([
    'Data_Sheet_01',
    'Data_Sheet_02',
    'Data_Sheet_03',
    'Data_Sheet_04',
    'Data_Sheet_05',
    'Data_Sheet_06'
  ]);

  // Internal box
  const [internalDataSheets, setInternalDataSheets] = useState([
    'Data_Sheet_07',
    'Data_Sheet_08'
  ]);

  // External box
  const [externalDataSheets, setExternalDataSheets] = useState([
    'Data_Sheet_09',
    'Data_Sheet_10'
  ]);

  // 管理选中的项
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item); 
      } else {
        newSet.add(item); 
      }
      return newSet;
    });
  };

  const hasSelectedInMainList = Array.from(selectedItems).some(item => 
    dataSheets.includes(item)
  );

  //  Internal 框
  const hasSelectedInInternal = Array.from(selectedItems).some(item => 
    internalDataSheets.includes(item)
  );

  // External 框
  const hasSelectedInExternal = Array.from(selectedItems).some(item => 
    externalDataSheets.includes(item)
  );

  const handleMoveToInternal = () => {
    if (!hasSelectedInMainList) return;
    
    const selectedInMain = Array.from(selectedItems).filter(item => 
      dataSheets.includes(item)
    );
    
    if (selectedInMain.length === 0) return;

    setDataSheets(prev => prev.filter(item => !selectedInMain.includes(item)));
    setInternalDataSheets(prev => [...prev, ...selectedInMain]);

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      selectedInMain.forEach(item => newSet.delete(item));
      return newSet;
    });
  };

  // 移动数据到 External
  const handleMoveToExternal = () => {
    if (!hasSelectedInMainList) return;
    
    const selectedInMain = Array.from(selectedItems).filter(item => 
      dataSheets.includes(item)
    );
    
    if (selectedInMain.length === 0) return;


    setDataSheets(prev => prev.filter(item => !selectedInMain.includes(item)));

    setExternalDataSheets(prev => [...prev, ...selectedInMain]);

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      selectedInMain.forEach(item => newSet.delete(item));
      return newSet;
    });
  };


  const handleMoveFromInternal = () => {
    if (!hasSelectedInInternal) return;
    
    const selectedInInternal = Array.from(selectedItems).filter(item => 
      internalDataSheets.includes(item)
    );
    
    if (selectedInInternal.length === 0) return;

    setInternalDataSheets(prev => prev.filter(item => !selectedInInternal.includes(item)));

    setDataSheets(prev => [...prev, ...selectedInInternal]);

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      selectedInInternal.forEach(item => newSet.delete(item));
      return newSet;
    });
  };

  // 从 External 框移回橙色框
  const handleMoveFromExternal = () => {
    if (!hasSelectedInExternal) return;
    
    const selectedInExternal = Array.from(selectedItems).filter(item => 
      externalDataSheets.includes(item)
    );
    
    if (selectedInExternal.length === 0) return;

    // 从 External 列表移除
    setExternalDataSheets(prev => prev.filter(item => !selectedInExternal.includes(item)));

    setDataSheets(prev => [...prev, ...selectedInExternal]);

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      selectedInExternal.forEach(item => newSet.delete(item));
      return newSet;
    });
  };

  return (
    <PageContainer>
      <BackgroundBox>
        <PublicationsTitle>Publications</PublicationsTitle>
        
        <ContentWrapper>
          <LeftSection>
            <MainContainer>
              <LabelContainer>
                {dataSheets.map((sheet, index) => {
                  const isSelected = selectedItems.has(sheet);
                  return (
                    <LabelItem 
                      key={index} 
                      onClick={() => handleItemClick(sheet)}
                    >
                      <Label selected={isSelected}>{sheet}</Label>
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
                    active={hasSelectedInMainList}
                    onClick={handleMoveToInternal}
                  >
                    <ArrowCircle active={hasSelectedInMainList}>
                      <ArrowIcon active={hasSelectedInMainList} />
                    </ArrowCircle>
                  </ArrowButton>
                  <ArrowButtonDown 
                    active={hasSelectedInInternal}
                    onClick={handleMoveFromInternal}
                  >
                    <ArrowCircle active={hasSelectedInInternal}>
                      <ArrowIcon active={hasSelectedInInternal} />
                    </ArrowCircle>
                  </ArrowButtonDown>
                </TopArrows>
              </MiddleSection>

              <InternalBox>
                <BoxTitle>Internal</BoxTitle>
                <InternalContainer>
                  <InternalLabelContainer>
                    {internalDataSheets.map((sheet, index) => {
                      const isSelected = selectedItems.has(sheet);
                      return (
                        <LabelItem 
                          key={index} 
                          onClick={() => handleItemClick(sheet)}
                        >
                          <Label selected={isSelected}>{sheet}</Label>
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
                    active={hasSelectedInMainList}
                    onClick={handleMoveToExternal}
                  >
                    <ArrowCircle active={hasSelectedInMainList}>
                      <ArrowIcon active={hasSelectedInMainList} />
                    </ArrowCircle>
                  </ArrowButton>
                  <ArrowButtonDown 
                    active={hasSelectedInExternal}
                    onClick={handleMoveFromExternal}
                  >
                    <ArrowCircle active={hasSelectedInExternal}>
                      <ArrowIcon active={hasSelectedInExternal} />
                    </ArrowCircle>
                  </ArrowButtonDown>
                </BottomArrows>
              </MiddleSection>

              <ExternalBox>
                <BoxTitle>External</BoxTitle>
                <ExternalContainer>
                  <ExternalLabelContainer>
                    {externalDataSheets.map((sheet, index) => {
                      const isSelected = selectedItems.has(sheet);
                      return (
                        <LabelItem 
                          key={index} 
                          onClick={() => handleItemClick(sheet)}
                        >
                          <Label selected={isSelected}>{sheet}</Label>
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

