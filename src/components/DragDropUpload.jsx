import { Box, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useRef, useState } from 'react';

// Styled Components based on the provided CSS
const UploadDragUpload = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: '0.8px',
  padding: '19.2px',
  display: 'flex',
  flexDirection: 'column',
  gap: '9.6px',
  alignItems: 'center',
  justifyContent: 'center',
  height: '172px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  width: '80%',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '08',
  },
  '&.drag-over': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '08',
    borderStyle: 'dashed',
  }
}));

const UploadIcon = styled('img')(() => ({
  flexShrink: 0,
  width: '33.6px',
  height: '33.6px',
  position: 'relative',
  overflow: 'visible',
}));

const Frame2 = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6.4px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
}));

const TextContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '3.2px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
}));

const DragText = styled('div')(() => ({
  color: 'var(--black, #000000)',
  textAlign: 'left',
  fontFamily: 'var(--typography-styles-body-small-fontfamily, "Roboto-Regular", sans-serif)',
  fontSize: '9.600000381469727px',
  lineHeight: 'var(--lineheights-md, 12.8px)',
  letterSpacing: 'var(--letterspacing-md, 0.32px)',
  fontWeight: 400,
  position: 'relative',
}));

const Divider = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 'var(--spacing-smd, 9.6px)',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '160.8px',
  position: 'relative',
}));

const Line = styled(Box)(() => ({
  background: 'var(--94, #f0f0f0)',
  flex: 1,
  height: '0.78px',
  position: 'relative',
}));

const OrText = styled('div')(() => ({
  color: 'var(--40, #666666)',
  textAlign: 'center',
  fontFamily: 'var(--fontfamilies-secondary, "Inter-Regular", sans-serif)',
  fontSize: '9.600000381469727px',
  lineHeight: '14.4px',
  fontWeight: 400,
  position: 'relative',
}));

const ButtonRoundedOutline = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  position: 'relative',
}));

const MasterOutlineButton = styled(Button)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
  borderWidth: '0.8px',
  padding: '4.8px 9.6px',
  display: 'flex',
  flexDirection: 'row',
  gap: '6.4px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
  color: theme.palette.primary.main,
  fontFamily: '"Inter-SemiBold", sans-serif',
  fontSize: '9.600000381469727px',
  lineHeight: '14.4px',
  fontWeight: 600,
  textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderColor: theme.palette.primary.main,
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DragDropUpload = ({ title, image, logoType, isUploading, onUpload, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && onUpload) {
      await onUpload(file, logoType);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && onUpload) {
      await onUpload(files[0], logoType);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(logoType);
    }
  };

  if (image) {
    // Show uploaded image with delete option
    return (
      <Box sx={{ position: 'relative', height: 172, border: '0.8px solid #cccccc', borderRadius: '8px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8,
          display: 'flex',
          gap: 1
        }}>
 
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Delete
          </Button>
        </Box>
        <VisuallyHiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Box>
    );
  }

  return (
    <UploadDragUpload
      className={isDragOver ? 'drag-over' : ''}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <CircularProgress size={33.6} />
      ) : (
        <>
          <UploadIcon src="/assets/upload1.svg" alt="Upload" />
          <Frame2>
            <TextContainer>
              <DragText>
                Drag your file(s) to start uploading
              </DragText>
            </TextContainer>
            <Divider>
              <Line />
              <OrText>OR</OrText>
              <Line />
            </Divider>
            <ButtonRoundedOutline>
              <MasterOutlineButton
                component="span"
                onClick={(e) => e.stopPropagation()}
              >
                Browse files
              </MasterOutlineButton>
            </ButtonRoundedOutline>
          </Frame2>
        </>
      )}
      
      <VisuallyHiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </UploadDragUpload>
  );
};

export default DragDropUpload;
