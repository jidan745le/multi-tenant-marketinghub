import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const Image = ({ 
  type = 'simple', // 'simple' | 'gallery'
  // Simple props
  images = [],
  onImageClick,
  // Gallery props
  mainImage = null,
  thumbnailImages = [],
  imageInfo = {},
  onDownload,
  onImageSelect 
}) => {
  const { primaryColor } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageSelect = (image, index) => {
    setSelectedImageIndex(index);
    onImageSelect && onImageSelect(image, index);
  };

  // gallery: 当前主图
  const hasThumbs = Array.isArray(thumbnailImages) && thumbnailImages.length > 0;
  const displayedMainImage = hasThumbs ? thumbnailImages[selectedImageIndex] : (mainImage || null);

  const handleDownload = () => {
    onDownload && onDownload(displayedMainImage || mainImage);
  };

  // Simple rendering
  if (type === 'simple') {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '29.69px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0,
        position: 'relative'
      }}>
        {images.map((image, index) => (
          <Box
            key={index}
            onClick={() => onImageClick && onImageClick(image, index)}
            sx={{
              background: '#ffffff',
              borderStyle: 'solid',
              borderColor: '#b3b3b3',
              borderWidth: '0.93px',
              flexShrink: 0,
              width: '66.8px',
              height: '66.8px',
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: 1,
              cursor: onImageClick ? 'pointer' : 'default',
              '&:hover': onImageClick ? {
                borderColor: primaryColor,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease'
              } : {}
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              sx={{
                position: 'absolute',
                left: '3.71px',
                top: '3.71px',
                overflow: 'visible',
                width: 'calc(100% - 7.42px)',
                height: 'calc(100% - 7.42px)',
                objectFit: 'cover'
              }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  // Gallery rendering
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14.51px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative'
    }}>
      {/* 主内容区域 */}
      <Box sx={{
        flexShrink: 0,
        width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' },
        height: { xs: '340px', sm: '395.65px', md: '425px' },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 文件名 */}
        <Typography sx={{
          color: '#000000',
          textAlign: 'left',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '16px',
          lineHeight: '140%',
          letterSpacing: '0.34px',
          fontWeight: 400,
          textTransform: 'uppercase',
          position: 'absolute',
          left: '356px',
          top: '32.23px',
          width: '412.44px'
        }}>
          {imageInfo.fileName || 'Image File Name'}
        </Typography>

        {/* 下载按钮 */}
        <Button
          onClick={handleDownload}
          sx={{
            background: '#fff8f6',
            borderRadius: '3.41px',
            borderStyle: 'solid',
            borderColor: primaryColor,
            borderWidth: '0.85px',
            padding: '4px 30px',
            position: 'absolute',
            left: '890px',
            top: '360px',
            textTransform: 'uppercase',
            color: primaryColor,
            fontSize: '16px',
            fontWeight: 400,
            '&:hover': {
              background: `${primaryColor}10`
            }
          }}
        >
          DOWNLOAD
        </Button>

        {/* 边框（包含下边框）*/}
        <Box sx={{
          borderRadius: '3.41px 3.41px 0 0',
          borderStyle: 'solid',
          borderColor: '#d9d9d9',
          borderWidth: '0.85px',
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0
        }} />

        {/* 主图片预览 */}
        <Box sx={{
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: { xs: '180px', sm: '250px', md: '280px' },
          height: { xs: '200px', sm: '271.47px', md: '300px' },
          position: 'absolute',
          left: { xs: '20px', sm: '37.65px', md: '40px' },
          top: { xs: '20px', sm: '23.52px', md: '25px' }
        }}>
          <Box
            component="img"
            src={displayedMainImage?.src || '/assets/placeholder.png'}
            alt={displayedMainImage?.alt || 'Main Image'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              alignSelf: 'stretch',
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* 图片信息面板 */}
        <Box sx={{
          width: { 
            xs: 'calc(100% - 40px - 250px)', 
            sm: 'calc(100% - 40px - 319.89px)', 
            md: 'calc(100% - 40px - 350px)'
          },
          height: { xs: '240px', sm: '275.81px', md: '290px' },
          position: 'absolute',
          left: { xs: '250px', sm: '319.89px', md: '350px' },
          top: { xs: '20px', sm: '51.64px', md: '55px' },
          overflow: 'hidden'
        }}>
          {/* 背景 */}
          <Box sx={{
            background: '#fafafa',
            borderRadius: '3.41px',
            width: '100%',
            height: 'calc(100% - 40px)',
            position: 'absolute',
            left: 0,
            top: '34.79px'
          }} />

          {/* 标题 */}
          <Typography sx={{
            color: '#000000',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '13px',
            lineHeight: '140%',
            letterSpacing: '0.34px',
            fontWeight: 700,
            position: 'absolute',
            left: '13.53px',
            top: '50.25px'
          }}>
            Basic Info
          </Typography>

          <Typography sx={{
            color: '#000000',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '13px',
            lineHeight: '140%',
            letterSpacing: '0.34px',
            fontWeight: 700,
            position: 'absolute',
            left: '280.53px',
            top: '50.25px'
          }}>
            Technical
          </Typography>

          {/* 信息内容 */}
          <Box sx={{
            position: 'absolute',
            left: '13.53px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* 这部分也需要调整现在是固定的，需要动态输入 */}
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Model Number:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Image Type:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Lock Date:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Country Restrictions:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Usage rights:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Approval Status:
            </Typography>
          </Box>

          {/* 值 */}
          <Box sx={{
            position: 'absolute',
            left: '150.53px',
            top: '84px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.modelNumber || '90330'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.imageType || 'External Image'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.lockDate || '2025-01-01'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.countryRestrictions || 'None'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.usageRights || 'Standard'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Box sx={{
                background: '#6eb82a',
                borderRadius: '50%',
                width: '4.28px',
                height: '4.46px'
              }} />
              <Typography sx={{ fontSize: '11.5px', color: '#6eb82a', fontFamily: '"Open Sans", sans-serif' }}>
                {imageInfo.approvalStatus || 'Published'}
              </Typography>
            </Box>
          </Box>

          {/* 技术信息 */}
          <Box sx={{
            position: 'absolute',
            left: '281.24px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* 这步分还需要调整一下 */}
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Color space:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Color profile:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Resolution:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Dimensions:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Size:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Created On:
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              Change Date:
            </Typography>
          </Box>

          {/* 技术值 */}
          <Box sx={{
            position: 'absolute',
            left: '390px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.colorSpace || 'RGB'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.colorProfile || 'sRGB'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.resolution || '300 dpi'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.dimensions || '17.14 x 13.65'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.size || '150 kb'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.createdOn || '2025-01-01'}
            </Typography>
            <Typography sx={{ fontSize: '11.5px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
              {imageInfo.changeDate || '2025-01-01'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 缩略图区域 */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '10px', sm: '15.37px', md: '20px' },
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0,
        position: 'relative',
        flexWrap: 'wrap'
      }}>
        {thumbnailImages.map((image, index) => (
          <Box
            key={index}
            onClick={() => handleImageSelect(image, index)}
            sx={{
              background: '#ffffff',
              borderRadius: '3.41px',
              borderStyle: 'solid',
              borderColor: selectedImageIndex === index ? primaryColor : '#cccccc',
              borderWidth: selectedImageIndex === index ? '0.97px' : '0.85px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexShrink: 0,
              width: { xs: '80px', sm: '117.81px', md: '130px' },
              height: { xs: '80px', sm: '117.81px', md: '130px' },
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                borderColor: primaryColor,
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt || `Thumbnail ${index + 1}`}
              sx={{
                borderRadius: '3.41px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                alignSelf: 'stretch',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                objectFit: 'cover'
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

Image.propTypes = {
  type: PropTypes.oneOf(['simple', 'gallery']),
  // Simple props
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string
    })
  ),
  onImageClick: PropTypes.func,
  // Gallery props
  mainImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  }),
  thumbnailImages: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string
    })
  ),
  imageInfo: PropTypes.shape({
    fileName: PropTypes.string,
    modelNumber: PropTypes.string,
    imageType: PropTypes.string,
    lockDate: PropTypes.string,
    countryRestrictions: PropTypes.string,
    usageRights: PropTypes.string,
    approvalStatus: PropTypes.string,
    colorSpace: PropTypes.string,
    colorProfile: PropTypes.string,
    resolution: PropTypes.string,
    dimensions: PropTypes.string,
    size: PropTypes.string,
    createdOn: PropTypes.string,
    changeDate: PropTypes.string
  }),
  onDownload: PropTypes.func,
  onImageSelect: PropTypes.func
};

export default memo(Image);
