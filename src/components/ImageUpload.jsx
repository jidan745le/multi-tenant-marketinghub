import { Box, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

// 样式化组件
const ImagePreviewBox = styled(Box)(() => ({
  width: 200,
  height: 200,
  border: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: 4,
  overflow: 'hidden',
  backgroundColor: '#fff',
  padding: '18px',
  boxSizing: 'border-box',
}));

const IconButtonWrapper = styled(Box)(() => ({
  position: 'absolute',
  right: 8,
  bottom: 8,
  display: 'flex',
  gap: '8px',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'transparent',
    '& .material-symbols-outlined': {
      color: theme.palette.primary.main,
    },
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

const ImageUpload = ({ title, image, logoType, isUploading, onUpload, onDelete }) => {
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && onUpload) {
      await onUpload(file, logoType);
    }
  };

  const handleEdit = () => {
    document.getElementById(`file-input-${logoType}`).click();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(logoType);
    }
  };

  const handleImageError = () => {
    console.error('图片加载失败 (可能是CORS问题):', image);
  };

  const handleImageLoad = (e) => {
    console.log('图片加载成功:', image);
    setImgDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  // 根据图片宽高比确定样式
  const getImageStyle = () => {
    if (imgDimensions.width > imgDimensions.height) {
      // 宽大于高：左右贴边内容区域，上下居中
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '100%',
        objectFit: 'contain',
      };
    } else {
      // 高大于宽：上下贴边内容区域，左右居中
      return {
        width: 'auto',
        height: '100%',
        maxWidth: '100%',
        objectFit: 'contain',
      };
    }
  };

  return (
    <Box>
      <ImagePreviewBox>
        {isUploading ? (
          <CircularProgress size={24} />
        ) : image ? (
          <>
            <img
              src={image}
              alt={title}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={getImageStyle()}
            />
            <IconButtonWrapper>
              <StyledIconButton 
                size="small"
                onClick={handleEdit}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  edit
                </span>
              </StyledIconButton>
              <StyledIconButton
                size="small"
                onClick={handleDelete}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  delete
                </span>
              </StyledIconButton>
            </IconButtonWrapper>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              color: 'text.secondary',
        
            }}
            onClick={handleEdit}
          >
            upload image
          </Box>
        )}
        <VisuallyHiddenInput
          id={`file-input-${logoType}`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </ImagePreviewBox>
    </Box>
  );
};

export default ImageUpload;
