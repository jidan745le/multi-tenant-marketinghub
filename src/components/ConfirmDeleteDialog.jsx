import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '8px',
    padding: 0,
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
});

const DialogHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '12px 12px 0 0',
});

const DialogContentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 24px 24px 24px',
});

const QuestionIconContainer = styled(Box)({
  width: '88px',
  height: '88px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '6px',
  // padding: '1px',
});

const MessageText = styled(Typography)({
  textAlign: 'center',
  color: '#4f4f4f',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '8px',
  '&:last-of-type': {
    marginBottom: '24px',
  },
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  width: '100%',
});

const YesButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontWeight: 500,
  padding: '4px 24px',
  minWidth: '80px',
  '&:hover': {
    backgroundColor: '#ffffff',
    borderColor: theme.palette.primary.main,
    opacity: 0.9,
  },
}));

const NoButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  borderRadius: '4px',
  textTransform: 'uppercase',
  fontWeight: 500,
  padding: '4px 24px',
  minWidth: '80px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
  },
}));

const CloseButton = styled(IconButton)({
  color: '#4f4f4f',
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

function ConfirmDeleteDialog({ open, onClose, onConfirm, message }) {
  const handleYes = () => {
    onConfirm();
    onClose();
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          margin: 0,
        },
      }}
    >
      <DialogHeader>
        <CloseButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>
      </DialogHeader>
      
      <DialogContentBox>
        <QuestionIconContainer>
          <Box
            component="div"
            sx={{
              width: '100%',
              height: '100%',
              maskImage: 'url(/assets/help.svg)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: 'url(/assets/help.svg)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
          />
        </QuestionIconContainer>
        
        <MessageText>
          {message || 'Are you sure want to delete the record ?'}
        </MessageText>
        <MessageText>
          This action cannot be undone.
        </MessageText>
        
        <ButtonContainer>
          <YesButton onClick={handleYes}>
            YES
          </YesButton>
          <NoButton onClick={handleNo}>
            NO
          </NoButton>
        </ButtonContainer>
      </DialogContentBox>
    </StyledDialog>
  );
}

export default ConfirmDeleteDialog;
