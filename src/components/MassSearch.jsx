import {
  Alert,
  Box,
  Button,
  Dialog,
  IconButton,
  Snackbar,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';

const MassSearchContainer = styled(Box)(() => ({
  background: '#ffffff',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  minWidth: '600px',
  maxWidth: '700px',
  width: '100%',
  maxHeight: '680px',
  position: 'relative',
  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
}));

const TitleContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: '8px',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  alignContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  height: '32px',
  minWidth: '322px',
  position: 'relative',
}));

const PopUpTitle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '4px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '301px',
  height: '24px',
  position: 'relative',
}));

const TitleText = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  fontWeight: 500,
  position: 'absolute',
  left: '36px',
  top: '1.13px',
  width: '285.15px',
  height: '21.75px',
}));

const SearchBoxContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  height: '160px',
  position: 'relative',
}));

const InstructionText = styled(Typography)(() => ({
  color: '#808080',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.25px',
  fontWeight: 400,
  position: 'relative',
  alignSelf: 'stretch',
}));

const TextAreaContainer = styled(Box)(() => ({
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  alignSelf: 'stretch',
  flex: 1,
  position: 'relative',
}));

const TextAreaWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  width: '100%',
  flex: 1,
  minWidth: '285px',
  maxWidth: '100%',
  maxHeight: '245px',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledTextarea = styled('textarea')(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
  fontWeight: 400,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  flex: 1,
  border: 'none',
  outline: 'none',
  resize: 'none',
  background: 'transparent',
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
}));

const ClearButton = styled(Button)(() => ({
  background: '#ffffff',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '1px',
  padding: '0px 16px',
  height: '24px',
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  textTransform: 'uppercase',
  color: '#333333',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.5px',
  fontWeight: 500,
  minWidth: 'auto',
}));

const ValidateButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  padding: '0px 16px',
  height: '24px',
  textTransform: 'uppercase',
  color: '#ffffff',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.5px',
  fontWeight: 500,
  minWidth: 'auto',
}));

const CheckboxContainer = styled(Box)(() => ({
  padding: '0px 12px 0px 0px',
  display: 'flex',
  flexDirection: 'row',
  gap: '0px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  height: '24px',
  position: 'relative',
}));

const ResultBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: '24px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexWrap: 'nowrap',
  alignContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  minWidth: '320px',
  gap: '24px',
  position: 'relative',
  overflow: 'visible',
}));

const FoundSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '400px',
  minWidth: '400px',
  height: '160px',
  maxWidth: '658px',
  position: 'relative',
}));

const ResultTitle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  flexShrink: 0,
  minWidth: '180px',
  maxWidth: '500px',
  position: 'relative',
}));

const ResultText = styled(Typography)(() => ({
  color: '#808080',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.25px',
  fontWeight: 400,
  position: 'relative',
}));

const ResultsContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '8px',
  width: '100%',
  flexShrink: 0,
  height: '132px',
  minWidth: '285px',
  maxWidth: '1050px',
  minHeight: '120px',
  maxHeight: '245px',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#999999',
    borderRadius: '99px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#808080',
  },
}));

const ResultsBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
}));

const ValueItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flexShrink: 0,
  width: '100%',
  height: '24px',
  position: 'relative',
  marginBottom: '0px',
}));

const Cell = styled(Box)(() => ({
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flex: 1,
  width: '100%',
  minHeight: '32px',
  position: 'relative',
}));

const ValueText = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
  fontWeight: 400,
  position: 'relative',
  alignSelf: 'stretch',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const ErrorValueText = styled(Typography)(() => ({
  color: '#ba1a1a',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
  fontWeight: 400,
  position: 'relative',
  alignSelf: 'stretch',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const ErrorBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '232px',
  height: '160px',
  minWidth: '180px',
  position: 'relative',
}));

const ErrorTitle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '118px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
}));

const ErrorTitleLeft = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  position: 'relative',
}));

const ErrorText = styled(Typography)(() => ({
  color: '#808080',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.25px',
  fontWeight: 400,
  position: 'relative',
}));

const ErrorContainer = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#b3b3b3',
  borderWidth: '1px',
  padding: '8px 0px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  flexShrink: 0,
  height: '132px',
  minWidth: '160px',
  maxWidth: '320px',
  minHeight: '120px',
  maxHeight: '245px',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#999999',
    borderRadius: '99px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#808080',
  },
}));

const ErrorResultsBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  position: 'relative',
  padding: '0 8px',
}));

const ActionButtons = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  flexShrink: 0,
  width: '100%',
  marginTop: '-12px',
  marginBottom: '-8px',
  position: 'relative',
}));

const SearchButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  padding: '0px 16px',
  height: '24px',
  textTransform: 'uppercase',
  color: '#ffffff',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.5px',
  fontWeight: 500,
  minWidth: 'auto',
}));

const MassSearch = ({ 
  open, 
  onClose, 
  initialValue = '', 
  onConfirm,
  description = 'Please paste multiple value for Model No & Model Name below.'
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(initialValue);
  const [foundItems, setFoundItems] = useState([]);
  const [notFoundItems, setNotFoundItems] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);

  // 初始化
  useEffect(() => {
    if (open) {
      setInputValue(initialValue);
      setFoundItems([]);
      setNotFoundItems([]);
    }
  }, [open, initialValue]);

  const handleClear = () => {
    setInputValue('');
    setFoundItems([]);
    setNotFoundItems([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const performValidation = () => {
    if (!inputValue.trim()) {
      return { found: [], notFound: [] };
    }

    // 解析输入的值（支持逗号、分号、换行符分隔）
    const values = inputValue
      .split(/[,\n;]/)
      .map(v => v.trim())
      .filter(v => v.length > 0);

    if (values.length === 0) {
      return { found: [], notFound: [] };
    }

    // 实际应该从 API 获取
    // 模拟数据，后面会改
    const found = values.slice(0, Math.floor(values.length * 0.65));
    const notFound = values.slice(Math.floor(values.length * 0.65));
    
    return { found, notFound };
  };

  const handleValidate = () => {
    const { found, notFound } = performValidation();
    setFoundItems(found);
    setNotFoundItems(notFound);
  };

  const handleSearch = () => {
    // 先执行验证并更新显示
    const { found, notFound } = performValidation();
    setFoundItems(found);
    setNotFoundItems(notFound);
    
    // 调用 onConfirm 并关闭对话框
    if (onConfirm) {
      onConfirm(inputValue, found, notFound);
    }
    onClose();
  };


  const handleCopyNotFound = () => {
    const text = notFoundItems.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
    }).catch(() => {
      // 如果复制失败，也可以显示错误提示
      console.error('Failed to copy to clipboard');
    });
  };

  const handleCloseCopySuccess = () => {
    setCopySuccess(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          maxWidth: '700px',
          width: '100%',
          maxHeight: '680px',
        }
      }}
    >
      <MassSearchContainer>
        <TitleContainer>
          <PopUpTitle>
            <img 
              src="/assets/mass_search.png" 
              alt="Mass Search"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
            <TitleText>Mass Search</TitleText>
          </PopUpTitle>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme?.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </TitleContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <SearchBoxContainer>
            <InstructionText>{description}</InstructionText>
            <TextAreaContainer>
              <TextAreaWrapper>
                <StyledTextarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="A01010101;A01010102;A01010201;A01010202;A01010203;A01010204"
                  style={{ minHeight: '100px' }}
                />
              </TextAreaWrapper>
              <ButtonContainer>
                <ClearButton onClick={handleClear}>CLEAR</ClearButton>
                <ValidateButton 
                  onClick={handleValidate}
                  disabled={!inputValue.trim()}
                >
                  VALIDATE
                </ValidateButton>
              </ButtonContainer>
            </TextAreaContainer>
          </SearchBoxContainer>
        </Box>

        <ResultBox>
          <FoundSection>
            <ResultTitle>
              <span 
                className="material-symbols-outlined" 
                style={{ fontSize: '20px', color: '#808080' }}
              >
                check_circle
              </span>
              <ResultText>Results: {foundItems.length}/{foundItems.length + notFoundItems.length} found</ResultText>
            </ResultTitle>
            <ResultsContainer>
              <ResultsBox>
                {foundItems.map((item, index) => (
                  <ValueItem key={index}>
                    <Cell>
                      <ValueText>{item}</ValueText>
                    </Cell>
                  </ValueItem>
                ))}
              </ResultsBox>
            </ResultsContainer>
          </FoundSection>

          <ErrorBox>
            <ErrorTitle>
              <ErrorTitleLeft>
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontSize: '20px', color: '#808080' }}
                >
                  warning
                </span>
                <ErrorText>Not Found</ErrorText>
              </ErrorTitleLeft>
              <IconButton
                size="small"
                onClick={handleCopyNotFound}
                sx={{ width: '20px', height: '20px' }}
                disabled={notFoundItems.length === 0}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontSize: '20px', color: '#808080' }}
                >
                  content_copy
                </span>
              </IconButton>
            </ErrorTitle>
            <ErrorContainer>
              <ErrorResultsBox>
                {notFoundItems.map((item, index) => (
                  <ValueItem key={index}>
                    <Cell>
                      <ErrorValueText>{item}</ErrorValueText>
                    </Cell>
                  </ValueItem>
                ))}
              </ErrorResultsBox>
            </ErrorContainer>
          </ErrorBox>
        </ResultBox>

        <ActionButtons>
          <ClearButton onClick={onClose}>CANCEL</ClearButton>
          <SearchButton 
            onClick={handleSearch}
            disabled={!inputValue.trim()}
          >
            SEARCH
          </SearchButton>
        </ActionButtons>
      </MassSearchContainer>

      {/* 复制成功提示 */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseCopySuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseCopySuccess}
          severity="success"
          variant="filled"
          sx={{
            backgroundColor: theme.palette.primary.main || '#f16508',
            color: '#ffffff',
            fontFamily: '"Roboto-Regular", sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            '& .MuiAlert-icon': {
              color: '#ffffff',
            },
          }}
        >
          Copy Successful !
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default MassSearch;

