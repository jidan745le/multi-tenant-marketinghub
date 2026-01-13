import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useRef } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UploadImageIcon from './icons/UploadImageIcon';
import fileApi from '../services/fileApi';

// 公共样式 
const BaseContainer = styled(Box)(() => ({
  display: 'flex',
  position: 'relative',
}));

const ButtonContainer = styled(BaseContainer)(() => ({
  flexDirection: 'row',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
}));

// 样式化组件
const ImageUploadContainer = styled(Box)(() => ({
  background: 'var(--white, #ffffff)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  position: 'relative',
  boxShadow: 'var(--elevation5-box-shadow, 0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15))',
  boxSizing: 'border-box',
}));

const HeaderContainer = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const HeaderContent = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: 'var(--spacing-smd, 12px)',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const HeaderRow = styled(BaseContainer)(() => ({
  flexDirection: 'row',
  gap: 'var(--spacing-xs, 6px)',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const HeaderLeft = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: 'var(--spacing-xxxs, 2px)',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
}));

const TitleSection = styled(Typography)(() => ({
  color: 'var(--black, #000000)',
  textAlign: 'left',
  fontFamily: 'var(--title-medium-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--title-medium-font-size, 16px)',
  lineHeight: 'var(--title-medium-line-height, 24px)',
  letterSpacing: 'var(--title-medium-letter-spacing, 0.15px)',
  fontWeight: 'var(--title-medium-font-weight, 500)',
  position: 'relative',
  alignSelf: 'stretch',
}));

const Desc = styled(Typography)(() => ({
  color: 'var(--40, #666666)',
  textAlign: 'left',
  fontFamily: 'var(--body-medium-font-family, "Roboto-Regular", sans-serif)',
  fontSize: 'var(--body-medium-font-size, 14px)',
  lineHeight: 'var(--body-medium-line-height, 20px)',
  letterSpacing: 'var(--body-medium-letter-spacing, 0.25px)',
  fontWeight: 'var(--body-medium-font-weight, 400)',
  position: 'relative',
  alignSelf: 'stretch',
  height: '20px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const UploadDragUpload = styled(Box)(({ isDragOver, theme }) => ({
  background: 'var(--white, #ffffff)',
  borderRadius: 'var(--radi-mlg, 8px)',
  borderStyle: 'dashed',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: 'var(--spacing-lg, 24px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  position: 'relative',
  transition: 'all 0.2s ease',
  ...(isDragOver && {
    backgroundColor: `${theme.palette.primary.main || '#f16508'}0D`,
    borderColor: theme.palette.primary.main || '#f16508',
  }),
}));

const UploadContentContainer = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const DragTextContainer = styled(BaseContainer)(() => ({
  flexDirection: 'row',
  gap: '4px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const DragText = styled('div')(() => ({
  color: 'var(--black, #000000)',
  textAlign: 'left',
  fontFamily: '"Roboto-Regular", sans-serif',
  fontSize: 'var(--fontsize-sm, 14px)',
  lineHeight: 'var(--lineheights-md, 20px)',
  fontWeight: 400,
  position: 'relative',
}));

const Divider = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 'var(--spacing-smd, 12px)',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '201px',
  position: 'relative',
}));

const DividerLine = styled(Box)(() => ({
  background: 'var(--94, #f0f0f0)',
  flex: 1,
  height: '0.97px',
  position: 'relative',
}));

const DividerText = styled('div')(() => ({
  color: 'var(--40, #666666)',
  textAlign: 'center',
  fontFamily: 'var(--body-tiny-font-family, "Inter-Regular", sans-serif)',
  fontSize: 'var(--body-tiny-font-size, 12px)',
  lineHeight: 'var(--body-tiny-line-height, 18px)',
  fontWeight: 'var(--body-tiny-font-weight, 400)',
  position: 'relative',
}));

const BrowseButtonContainer = styled(ButtonContainer)(() => ({
  flexShrink: 0,
}));

const BrowseButton = styled(Button)(({ theme }) => ({
  background: 'var(--white, #ffffff)',
  borderRadius: 'var(--radi-mlg, 8px)',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: 'var(--spacing-xs, 6px) var(--spacing-smd, 12px)',
  display: 'flex',
  flexDirection: 'row',
  gap: 'var(--spacing-sm, 8px)',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
  color: theme.palette.primary.main || '#f16508',
  fontFamily: 'var(--body-tinystrong-font-family, "Inter-SemiBold", sans-serif)',
  fontSize: 'var(--body-tinystrong-font-size, 12px)',
  lineHeight: 'var(--body-tinystrong-line-height, 18px)',
  fontWeight: 'var(--body-tinystrong-font-weight, 600)',
  textTransform: 'none',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main || '#f16508'}14`,
    borderColor: theme.palette.primary.main || '#f16508',
  },
}));

const UploadFiles = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '0px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  height: '82px',
  position: 'relative',
  overflowY: 'auto',
  alignSelf: 'stretch',
}));

const FileListContainer = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: '4px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flexShrink: 0,
  width: '100%',
}));

const FileItem = styled(Box)(() => ({
  background: 'var(--white, #ffffff)',
  borderStyle: 'solid',
  borderColor: 'var(--94, #f0f0f0)',
  borderWidth: '1px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-start',
  justifyContent: 'center',
  alignSelf: 'stretch',
  flexShrink: 0,
  minHeight: '48px',
  position: 'relative',
}));

const FileItemRow = styled(BaseContainer)(() => ({
  flexDirection: 'row',
  gap: 'var(--spacing-sm, 8px)',
  alignItems: 'center',
  justifyContent: 'flex-start',
  alignSelf: 'stretch',
  flexShrink: 0,
}));

const FileInfoContainer = styled(BaseContainer)(() => ({
  flexDirection: 'column',
  gap: '2px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  flex: 1,
}));

const FileName = styled('div')(() => ({
  color: 'var(--black, #000000)',
  textAlign: 'left',
  fontFamily: 'var(--label-small-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-small-font-size, 11px)',
  lineHeight: 'var(--label-small-line-height, 16px)',
  letterSpacing: 'var(--label-small-letter-spacing, 0.5px)',
  fontWeight: 'var(--label-small-font-weight, 500)',
  position: 'relative',
  alignSelf: 'stretch',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const FileSize = styled('div')(() => ({
  color: 'var(--40, #666666)',
  textAlign: 'left',
  fontFamily: 'var(--caption-small-font-family, "Inter-Regular", sans-serif)',
  fontSize: 'var(--caption-small-font-size, 12px)',
  lineHeight: 'var(--caption-small-line-height, 16px)',
  fontWeight: 'var(--caption-small-font-weight, 400)',
  position: 'relative',
}));

const ActionButton = styled(ButtonContainer)(() => ({
  flexShrink: 0,
}));

const ButtonsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  alignSelf: 'stretch',
  flexShrink: 0,
  height: '40px',
  position: 'relative',
}));

const CancelButtonContainer = styled(ButtonContainer)(() => ({}));

const CancelButton = styled(Button)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '4px',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main || '#f16508',
  borderWidth: '1px',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
  color: theme.palette.primary.main || '#f16508',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  minWidth: 'auto',
  '&:hover': {
    borderColor: theme.palette.primary.main || '#f16508',
    backgroundColor: `${theme.palette.primary.main}12`,
  },
}));

const NextButtonContainer = styled(ButtonContainer)(() => ({}));

const NextButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main || '#f16508',
  borderRadius: '4px',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  position: 'relative',
  color: '#ffffff',
  fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
  fontSize: 'var(--label-large-font-size, 14px)',
  lineHeight: 'var(--label-large-line-height, 20px)',
  letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
  fontWeight: 'var(--label-large-font-weight, 500)',
  textTransform: 'uppercase',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.primary.main || '#f16508',
    opacity: 0.9,
    color: '#ffffff',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
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

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const UploadDialog = ({ open, onClose, onNext, onCancel, uploadType = 'all' }) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 根据上传类型确定支持的文件类型
  const getAcceptedTypes = () => {
    if (uploadType === 'icon') {
      return {
        acceptedTypes: ['.jpg', '.jpeg', '.png', '.svg'],
        acceptedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
        accept: '.jpg,.jpeg,.png,.svg',
        description: 'Only supports .jpg, .png, .svg and zip files',
      };
    } else if (uploadType === 'pdfExample') {
      return {
        acceptedTypes: ['.pdf'],
        acceptedMimeTypes: ['application/pdf'],
        accept: '.pdf',
        description: 'Only supports .pdf files',
      };
    } else {
      return {
        acceptedTypes: ['.jpg', '.jpeg', '.png', '.svg', '.zip'],
        acceptedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/zip'],
        accept: '.jpg,.jpeg,.png,.svg,.zip',
        description: 'Only supports .jpg, .png and .svg and zip files',
      };
    }
  };

  const { acceptedTypes, acceptedMimeTypes, accept, description } = getAcceptedTypes();

  const handleFileSelect = async (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      const fileName = file.name.toLowerCase();
      const fileType = file.type;
      return (
        acceptedTypes.some((ext) => fileName.endsWith(ext)) ||
        acceptedMimeTypes.includes(fileType)
      );
    });

    const newFiles = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      fileId: null,
      uploading: true,
      error: null,
    }));

    // 显示上传状态
    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach(async (fileItem) => {
      try {
        const uploadResult = await fileApi.uploadFile(fileItem.file);
        const fileId = uploadResult.fileId;
        
        if (fileId) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, fileId, uploading: false, error: null }
                : f
            )
          );
          console.log('File uploaded successfully, fileId:', fileId, 'fileName:', fileItem.name);
        } else {
          throw new Error('Upload response does not contain fileId');
        }
      } catch (error) {
        console.error('Error uploading file:', error, 'fileName:', fileItem.name);
        // 标记上传失败
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, uploading: false, error: error.message || 'Upload failed' }
              : f
          )
        );
      }
    });
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleNext = () => {
    if (onNext && files.length > 0) {
      const validFiles = files.filter((f) => f.fileId && !f.error && !f.uploading);
      
      if (validFiles.length > 0) {
        onNext(validFiles);
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const resetDialog = () => {
    setFiles([]);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetDialog();
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    resetDialog();
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '2px',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <ImageUploadContainer>
          <HeaderContainer>
            <HeaderContent>
              <HeaderRow>
                <HeaderLeft>
                  <TitleSection>Media Upload</TitleSection>
                  <Desc>Add your documents here</Desc>
                </HeaderLeft>
              </HeaderRow>
            </HeaderContent>
          </HeaderContainer>

          <UploadDragUpload
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadImageIcon />
            <UploadContentContainer>
              <DragTextContainer>
                <DragText>Drag your file(s) to start uploading</DragText>
              </DragTextContainer>
              <Divider>
                <DividerLine />
                <DividerText>OR</DividerText>
                <DividerLine />
              </Divider>
              <BrowseButtonContainer>
                <BrowseButton
                  component="span"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  Browse files
                </BrowseButton>
              </BrowseButtonContainer>
            </UploadContentContainer>
          </UploadDragUpload>

          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={uploadType === 'all'}
            onChange={handleFileChange}
          />

          <Desc>{description}</Desc>

          {files.length > 0 && (
            <UploadFiles>
              <FileListContainer>
                {files.map((fileItem) => (
                  <FileItem key={fileItem.id}>
                    <FileItemRow>
                      <FileInfoContainer>
                        <FileName>{fileItem.name}</FileName>
                        <FileSize>{formatFileSize(fileItem.size)}</FileSize>
                      </FileInfoContainer>
                      <ActionButton>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(fileItem.id)}
                          sx={{
                            padding: 0,
                            color: 'var(--40, #666666)',
                            '&:hover': {
                              color: 'var(--black, #000000)',
                            },
                          }}
                        >
                          <HighlightOffIcon sx={{ fontSize: '24px' }} />
                        </IconButton>
                      </ActionButton>
                    </FileItemRow>
                  </FileItem>
                ))}
              </FileListContainer>
            </UploadFiles>
          )}

          <ButtonsContainer>
            <CancelButtonContainer>
              <CancelButton onClick={handleCancel}>CANCEL</CancelButton>
            </CancelButtonContainer>
            <NextButtonContainer>
              <NextButton 
                onClick={handleNext} 
                disabled={
                  files.length === 0 || 
                  files.some(f => f.uploading) || 
                  !files.some(f => f.fileId && !f.error)
                }
              >
                NEXT
              </NextButton>
            </NextButtonContainer>
          </ButtonsContainer>
        </ImageUploadContainer>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
