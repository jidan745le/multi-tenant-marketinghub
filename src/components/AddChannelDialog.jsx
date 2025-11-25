import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SelectChannel from './SelectChannel';

// Styled components
const DialogContainer = styled(Box)(() => ({
  background: '#ffffff',
  borderRadius: '2px',
  padding: '24px',
  height: '630px',
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

const RadioButtonGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginBottom: '24px',
}));

const RadioButton = styled(FormControlLabel)(({ selected, theme }) => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: selected ? (theme.palette.primary.main || '#f16508') : '#e6e6e6',
  borderWidth: '1px',
  padding: '6px 16px',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '205px',
  minHeight: '60px',
  margin: 0,
  backgroundColor: selected ? 'rgba(141, 77, 45, 0.08)' : 'transparent',
  '& .MuiFormControlLabel-label': {
    color: '#4d4d4d',
    fontFamily: '"OpenSans-SemiBold", sans-serif',
    fontSize: '17px',
    fontWeight: 600,
    marginLeft: '0px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

const FormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconUploadSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconLabel = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  marginBottom: '8px',
}));

const IconUploadContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const IconPreviewBox = styled(Box)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#dbdbdb',
  borderWidth: '1px',
  padding: '6px 4px 6px 8px',
  width: '110px',
  height: '110px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const UploadButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '111.32px',
  height: '110px',
}));

const UploadButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#dbdbdb',
  borderWidth: '1px',
  padding: '6px 4px 6px 8px',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'none',
  color: '#bdbdbd',
  fontFamily: '"Roboto-Medium", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderColor: '#999999',
  },
}));

const FormField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const FieldLabel = styled(Typography)(() => ({
  color: '#4d4d4d',
  textAlign: 'left',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  fontWeight: 400,
}));

const StyledTextField = styled(TextField)(() => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    borderColor: '#dbdbdb',
    fontFamily: '"OpenSans-Regular", sans-serif',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#dbdbdb',
    },
    '&:hover fieldset': {
      borderColor: '#999999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dbdbdb',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"OpenSans-Regular", sans-serif',
    fontSize: '14px',
    color: '#4d4d4d',
  },
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  position: 'absolute',
  right: '24px',
  bottom: '24px',
}));

const CancelButton = styled(Button)(() => ({
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: '#e6e6e6',
  borderWidth: '1px',
  padding: '8px 16px',
  color: '#4d4d4d',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 400,
  textTransform: 'none',
  background: '#ffffff',
  boxShadow: '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#eb6100',
  borderRadius: '4px',
  padding: '6px 16px',
  color: '#ffffff',
  fontFamily: '"OpenSans-Regular", sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  fontWeight: 400,
  textTransform: 'uppercase',
  height: '32px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark || '#d5570a',
  },
}));

const AddChannelDialog = ({ open, onClose, onSave }) => {
  const [channelType, setChannelType] = useState('Custom'); // 'Custom' or 'Channel'
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconPreview, setIconPreview] = useState(null);
  const [selectChannelOpen, setSelectChannelOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleTypeChange = (event) => {
    setChannelType(event.target.value);
  };

  const handleSelectChannelClick = () => {
    setSelectChannelOpen(true);
  };

  const handleChannelSelect = (channel) => {
    if (channel.name) {
      setName(channel.name);
    }
    if (channel.theme) {
      setDescription(`${channel.theme} - ${channel.name}`);
    }
    setSelectChannelOpen(false);
  };

  const handleCancel = () => {
    // 重置表单
    setChannelType('Custom');
    setName('');
    setDescription('');
    setIconPreview(null);
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onSave) {
      onSave({
        type: channelType,
        name,
        description,
        icon: iconPreview,
      });
    }
    handleCancel();
  };

  const handleUploadIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          width: '450px',
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
            <img src="/assets/channel.png" alt="Channel" style={{ width: 28, height: 28 }} />
            <Title>Add Channel</Title>
            <CloseButton onClick={handleCancel}>
              <CloseIcon sx={{ width: '16px', height: '16px' }} />
            </CloseButton>
          </HeaderContainer>

          {/* Radio Button Group */}
          <RadioButtonGroup>
              <RadioButton
                control={
                  <Radio
                    checked={channelType === 'Custom'}
                    onChange={handleTypeChange}
                    value="Custom"
                    sx={{ display: 'none' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, gap: '1px', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>
                        <Box
                          sx={(theme) => ({
                            width: '20px',
                            height: '20px',
                            maskImage: `url(/assets/X.png)`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            backgroundColor: theme.palette.primary.main || '#f16508',
                          })}
                        />
                        <span style={{ color: '#4d4d4d' }}>Custom</span>
                      </Box>
                      <Box
                        sx={(theme) => ({
                          width: '18px',
                          height: '18px',
                          borderRadius: '2px',
                          border: channelType === 'Custom' ? 'none' : '1px solid #e6e6e6',
                          backgroundColor: channelType === 'Custom' ? (theme.palette.primary.main || '#f16508') : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: 'auto',
                        })}
                      >
                        {channelType === 'Custom' && (
                          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold', lineHeight: '1' }}>✓</span>
                        )}
                      </Box>
                    </Box>
                  </Box>
                }
                selected={channelType === 'Custom'}
                onClick={() => setChannelType('Custom')}
              />
              <RadioButton
                control={
                  <Radio
                    checked={channelType === 'Channel'}
                    onChange={handleTypeChange}
                    value="Channel"
                    sx={{ display: 'none' }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, gap: '1px', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>
                        <Box
                          sx={(theme) => ({
                            width: '20px',
                            height: '20px',
                            maskImage: `url(/assets/global.png)`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            backgroundColor: theme.palette.primary.main || '#f16508',
                          })}
                        />
                        <span style={{ color: '#4d4d4d' }}>Channel</span>
                      </Box>
                      <Box
                        sx={(theme) => ({
                          width: '18px',
                          height: '18px',
                          borderRadius: '2px',
                          border: channelType === 'Channel' ? 'none' : '1px solid #e6e6e6',
                          backgroundColor: channelType === 'Channel' ? (theme.palette.primary.main || '#f16508') : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: 'auto',
                        })}
                      >
                        {channelType === 'Channel' && (
                          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 'bold', lineHeight: '1' }}>✓</span>
                        )}
                      </Box>
                    </Box>
                    {/* Channel Selection Hint */}
                    {channelType === 'Channel' && (
                      <Typography
                        onClick={handleSelectChannelClick}
                        sx={(theme) => ({
                          color: theme.palette.primary.main || '#f16508',
                          fontFamily: '"OpenSans-Regular", sans-serif',
                          fontSize: '10px',
                          fontWeight: 400,
                          lineHeight: '1.2',
                          marginLeft: '0px',
                          marginTop: '0px',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        })}
                      >
                        Click to Select Channel
                      </Typography>
                    )}
                  </Box>
                }
                selected={channelType === 'Channel'}
                onClick={() => setChannelType('Channel')}
              />
          </RadioButtonGroup>

          {/* Form Container */}
          <FormContainer>
            {/* Icon Upload Section */}
            <IconUploadSection>
              <IconLabel>Icon</IconLabel>
              <IconUploadContainer>
                {iconPreview && (
                  <IconPreviewBox>
                    <img src={iconPreview} alt="Icon preview" />
                  </IconPreviewBox>
                )}
                <UploadButtonContainer>
                  <UploadButton onClick={handleUploadIcon}>
                    <CloudUploadIcon sx={{ width: '50px', height: '50px', color: '#bdbdbd', marginBottom: '8px' }} />
                    <Typography sx={{ color: '#bdbdbd', fontSize: '14px', fontWeight: 500 }}>
                      UPLOAD
                    </Typography>
                  </UploadButton>
                </UploadButtonContainer>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </IconUploadContainer>
            </IconUploadSection>

            {/* Name Field */}
            <FormField>
              <FieldLabel>Name</FieldLabel>
              <StyledTextField
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                  },
                }}
              />
            </FormField>

            {/* Description Field */}
            <FormField>
              <FieldLabel>Description</FieldLabel>
              <StyledTextField
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '91px',
                  },
                }}
              />
            </FormField>
          </FormContainer>

          {/* Buttons */}
          <ButtonContainer>
            <CancelButton onClick={handleCancel}>
              CANCEL
            </CancelButton>
            <ConfirmButton onClick={handleConfirm}>
              CONFIRM
            </ConfirmButton>
          </ButtonContainer>
        </DialogContainer>
      </DialogContent>

      {/* Select Channel Dialog */}
      <SelectChannel
        open={selectChannelOpen}
        onClose={() => setSelectChannelOpen(false)}
        onSelect={handleChannelSelect}
      />
    </Dialog>
  );
};

export default AddChannelDialog;

