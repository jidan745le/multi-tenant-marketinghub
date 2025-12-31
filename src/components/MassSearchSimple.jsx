import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Dialog,
    IconButton,
    Typography,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';

const MassSearchContainer = styled(Box)(() => ({
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '600px',
  maxWidth: '700px',
  width: '100%',
  height: '100%',
  maxHeight: '680px',
  position: 'relative',
  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden', // Prevent scrollbars
}));

const HeaderContainer = styled(Box)(() => ({
  padding: '24px 24px 16px 24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid #e0e0e0',
}));

const ContentContainer = styled(Box)(() => ({
  flex: 1,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  overflow: 'hidden', // Prevent scrollbars on container
  minHeight: 0, // Important for flex children
}));

const FooterContainer = styled(Box)(() => ({
  padding: '16px 24px 24px 24px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  borderTop: '1px solid #e0e0e0',
}));

const PopUpTitle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
}));

const TitleText = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  fontWeight: 500,
}));

const SearchBoxContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  width: '100%',
  flex: 1,
  minHeight: 0, // Important for flex children
  overflow: 'hidden', // Prevent scrollbars on container
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
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flex: 1,
  minHeight: 0, // Important for flex children
  position: 'relative',
  overflow: 'hidden', // Prevent scrollbars on container
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
  minHeight: 0, // Important for flex children
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
  width: '100%',
  flex: 1,
  border: 'none',
  outline: 'none',
  resize: 'none',
  background: 'transparent',
  minHeight: 0, // Important for flex children
  overflow: 'auto', // Allow scrolling only in textarea itself
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

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  alignSelf: 'stretch',
  flexShrink: 0,
  marginTop: '8px',
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
  '&.Mui-disabled': {
    background: '#e0e0e0',
    color: '#9e9e9e',
  },
}));


const MassSearchSimple = ({ 
  open, 
  onClose, 
  initialValue = '', 
  onConfirm,
  description = 'Please paste multiple SKU codes separated by semicolons.'
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(initialValue);
  const textareaRef = useRef(null);

  // 初始化
  useEffect(() => {
    if (open) {
      setInputValue(initialValue);
    }
  }, [open, initialValue]);

  const handleClear = () => {
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSearch = () => {
    // 调用 onConfirm 并关闭对话框
    if (onConfirm) {
      onConfirm(inputValue);
    }
    onClose();
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
          height: 'auto',
          overflow: 'hidden', // Prevent scrollbars in dialog
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <MassSearchContainer>
        {/* Header */}
        <HeaderContainer>
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
              color: theme?.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </HeaderContainer>

        {/* Content */}
        <ContentContainer>
          <SearchBoxContainer>
            <InstructionText>{description}</InstructionText>
            <TextAreaContainer>
              <TextAreaWrapper>
                <StyledTextarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="A01010101;A01010102;A01010201;A01010202;A01010203;A01010204"
                />
              </TextAreaWrapper>
              <ButtonContainer>
                <ClearButton onClick={handleClear}>CLEAR</ClearButton>
              </ButtonContainer>
            </TextAreaContainer>
          </SearchBoxContainer>
        </ContentContainer>

        {/* Footer */}
        <FooterContainer>
          <ClearButton onClick={onClose}>CANCEL</ClearButton>
          <SearchButton 
            onClick={handleSearch}
            disabled={!inputValue.trim()}
          >
            SEARCH
          </SearchButton>
        </FooterContainer>
      </MassSearchContainer>
    </Dialog>
  );
};

export default MassSearchSimple;

