import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '2px',
  padding: '24px',
  height: '898px',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
}));

const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '5px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  marginBottom: '40px',
}));

const Title = styled(Typography)(() => ({
  color: '#000000',
  textAlign: 'left',
  fontFamily: '"OpenSans-SemiBold", sans-serif',
  fontSize: '21px',
  lineHeight: '140%',
  fontWeight: 600,
  flex: 1,
}));

const CloseButton = styled(IconButton)(() => ({
  padding: 0,
  width: '16px',
  height: '16px',
  color: '#000000',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const ChannelGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '13px',
  padding: '0 13px',
  overflowY: 'auto',
  maxHeight: '750px',
  position: 'relative',
  scrollbarWidth: 'thin',
  scrollbarColor: '#e0e0e0 transparent',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e0e0e0',
    borderRadius: '12px',
  },
}));

const ChannelCard = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: '#e0e0e0',
  borderWidth: '1.6px',
  width: '100%',
  aspectRatio: '189 / 221',
  minHeight: '150px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}));

const ChannelLogo = styled('img')(() => ({
  width: '69%',
  maxWidth: '131px',
  height: 'auto',
  aspectRatio: '131 / 33',
  objectFit: 'contain',
  margin: '50px auto 0',
  display: 'block',
}));

const ChannelRegion = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'left',
  fontFamily: '"Lato-Regular", sans-serif',
  fontSize: '12px',
  lineHeight: '120%',
  fontWeight: 400,
  position: 'absolute',
  left: '10px',
  bottom: '66px',
}));

const ChannelName = styled(Typography)(() => ({
  color: '#212121',
  textAlign: 'left',
  fontFamily: '"Lato-SemiBold", sans-serif',
  fontSize: '14px',
  lineHeight: '140%',
  fontWeight: 600,
  position: 'absolute',
  left: '10px',
  bottom: '41px',
  right: '10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  position: 'absolute',
  left: '10px',
  right: '10px',
  bottom: '10px',
}));

const PreviewButton = styled(Button)(({ theme }) => ({
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  borderWidth: '0.8px',
  padding: '0.4em 0.75em',
  color: theme.palette.primary.main,
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: 'clamp(9px, 1.5vw, 11.2px)',
  lineHeight: '1.2',
  fontWeight: 400,
  textTransform: 'none',
  boxShadow: '0px 0.8px 0.8px 0px rgba(0, 0, 0, 0.05)',
  minWidth: '0',
  flex: '1 1 0',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '14',
    borderColor: theme.palette.primary.main,
  },
}));

const SelectButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: '3.2px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  borderWidth: '0.8px',
  padding: '0.4em 0.75em',
  color: '#ffffff',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: 'clamp(9px, 1.5vw, 11.2px)',
  lineHeight: '1.2',
  fontWeight: 400,
  textTransform: 'none',
  boxShadow: '0px 0.8px 0.8px 0px rgba(0, 0, 0, 0.05)',
  minWidth: '0',
  flex: '1 1 0',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
  },
}));

// Mock data for channels
const mockChannels = [
  { id: 1, theme: 'Kendo', name: 'KENDO', logo: '/assets/kendo-logo-3.png' },
  { id: 2, theme: 'Bosch', name: 'SAAME', logo: '/assets/kendo-logo-4.png' },
  { id: 3, theme: 'kendo', name: 'SAAME', logo: '/assets/kendo-logo-4.png' },
  { id: 4, theme: 'Kendo', name: 'KENDO', logo: '/assets/kendo-logo-3.png' },
  { id: 5, theme: 'Bosch', name: 'SAAME', logo: '/assets/kendo-logo-5.png' },
  { id: 6, theme: 'Bosch', name: 'SAAME', logo: '/assets/kendo-logo-4.png' },
  { id: 7, theme: 'Kendo', name: 'KENDO', logo: '/assets/kendo-logo-4.png' },
];

const SelectChannel = ({ open, onClose, onSelect }) => {
  const handlePreview = (channel) => {
    // Handle preview action
    console.log('Preview channel:', channel);
  };

  const handleSelect = (channel) => {
    if (onSelect) {
      onSelect(channel);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '650px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <DialogContainer>
          {/* Header */}
          <HeaderContainer>
            <img 
              src="/assets/channel.png" 
              alt="Select Channel" 
              style={{ width: '28.8px', height: '28.8px' }} 
            />
            <Title>Select Channel</Title>
            <CloseButton onClick={onClose}>
              <CloseIcon sx={{ width: '16px', height: '16px' }} />
            </CloseButton>
          </HeaderContainer>

          {/* Channel Grid */}
          <ChannelGrid>
            {mockChannels.map((channel) => (
              <ChannelCard key={channel.id}>
                {channel.logo && (
                  <ChannelLogo src={channel.logo} alt={channel.name} />
                )}
                <ChannelRegion>{channel.theme}</ChannelRegion>
                <ChannelName>{channel.name}</ChannelName>
                <ButtonContainer>
                  <PreviewButton onClick={() => handlePreview(channel)}>
                    PREVIEW
                  </PreviewButton>
                  <SelectButton onClick={() => handleSelect(channel)}>
                    SELECT
                  </SelectButton>
                </ButtonContainer>
              </ChannelCard>
            ))}
          </ChannelGrid>
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
};

export default SelectChannel;

