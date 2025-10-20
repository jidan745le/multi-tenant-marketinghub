import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useTranslationLoader } from '../hooks/useTranslationLoader';

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
  onImageSelect,
  // 标签行
  tags = [],
  // 可配置的字段标签映射（用于替换硬编码）
  infoLabels = {
    basic: [
      { key: 'modelNumber', label: 'Model Number' },
      { key: 'imageType', label: 'Image Type' },
      { key: 'lockDate', label: 'Lock Date' },
      { key: 'countryRestrictions', label: 'Country Restrictions' },
      { key: 'usageRights', label: 'Usage rights' },
      { key: 'approvalStatus', label: 'Approval Status' }
    ],
    technical: [
      { key: 'colorSpace', label: 'Color space' },
      { key: 'colorProfile', label: 'Color profile' },
      { key: 'resolution', label: 'Resolution' },
      { key: 'dimensions', label: 'Dimensions' },
      { key: 'size', label: 'Size' },
      { key: 'createdOn', label: 'Created On' },
      { key: 'changeDate', label: 'Change Date' }
    ]
  }
}) => {
  const { t } = useTranslation();
  const { primaryColor } = useTheme();
  useTranslationLoader();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageSelect = (image, index) => {
    setSelectedImageIndex(index);
    onImageSelect && onImageSelect(image, index);
  };

  // gallery: 当前主图
  const hasThumbs = Array.isArray(thumbnailImages) && thumbnailImages.length > 0;
  const displayedMainImage = hasThumbs ? thumbnailImages[selectedImageIndex] : (mainImage || null);
  // keyWords
  const displayedTags = Array.isArray(tags) && tags.length > 0
    ? tags
    : (Array.isArray(displayedMainImage?.keywords) ? displayedMainImage.keywords : []);

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
        height: { xs: '340px', sm: '395.65px', md: '430px' },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 文件名 */}
        <Typography sx={{
          color: '#000000',
          textAlign: 'left',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '20px',
          lineHeight: '140%',
          letterSpacing: '0.34px',
          fontWeight: 500,
          textTransform: 'uppercase',
          position: 'absolute',
          left: '356px',
          top: '32.23px',
          width: '412.44px'
        }}>
          {displayedMainImage?.fileName || imageInfo.fileName || 'Image File Name'}
        </Typography>

        {/* 标签行 */}
        {Array.isArray(displayedTags) && displayedTags.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '7.73px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'absolute',
            left: '356px',
            top: '70px',
          }}>
            {displayedTags.map((label, idx) => (
              <Box key={idx} sx={{
                background: '#fff8f6',
                borderRadius: '1.71px',
                borderStyle: 'solid',
                borderColor: primaryColor,
                borderWidth: '0.43px',
                padding: '2.56px 6.83px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1.71px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0px 4px',
                  height: '14px'
                }}>
                  <Typography sx={{
                    color: primaryColor,
                    textAlign: 'left',
                    fontFamily: '"OpenSans-Regular", sans-serif',
                    fontSize: '13px',
                    lineHeight: '10.24px',
                    letterSpacing: '0.17px',
                    fontWeight: 400,
                    textTransform: 'uppercase'
                  }}>
                    {label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

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
            right: '40px',
            top: '365px',
            textTransform: 'uppercase',
            color: primaryColor,
            fontSize: '16px',
            fontWeight: 400,
            minWidth: 'auto',
            width: 'auto',
            zIndex: 10,
            cursor: 'pointer',
            '&:hover': {
              background: `${primaryColor}10`,
              borderColor: primaryColor
            }
          }}
        >
          {t('common.download')}
        </Button>

        {/* 边框*/}
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
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              objectFit: 'contain'
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
          top: { xs: '20px', sm: '51.64px', md: '68px' },
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
            fontSize: '15px',
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
            fontSize: '15px',
            lineHeight: '140%',
            letterSpacing: '0.34px',
            fontWeight: 700,
            position: 'absolute',
            left: '280.53px',
            top: '50.25px'
          }}>
            Technical
          </Typography>

          {/* 信息内容*/}
          <Box sx={{
            position: 'absolute',
            left: '13.53px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {Array.isArray(infoLabels?.basic) && infoLabels.basic.map((f, i) => (
              <Typography key={`basic-label-${i}`} sx={{ fontSize: '13px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
                {f.label}:
              </Typography>
            ))}
          </Box>

          {/* 值*/}
          <Box sx={{
            position: 'absolute',
            left: '150.53px',
            top: '84px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {Array.isArray(infoLabels?.basic) && infoLabels.basic.map((f, i) => {
              const value = (displayedMainImage?.basicInfo?.[f.key]) ?? (imageInfo?.[f.key]) ?? '-';
              const isStatus = /status/i.test(f.key);
              return isStatus ? (
                <Box key={`basic-value-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Box sx={{ borderRadius: '50%', width: '4.28px', height: '4.46px' }} />
                  <Typography sx={{ fontSize: '13px', color: '#6eb82a', fontFamily: '"Open Sans", sans-serif' }}>
                    {value || '-'}
                  </Typography>
                </Box>
              ) : (
                <Typography key={`basic-value-${i}`} sx={{ fontSize: '13px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
                  {value || '-'}
                </Typography>
              );
            })}
          </Box>

          {/* 技术信息*/}
          <Box sx={{
            position: 'absolute',
            left: '281.24px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {Array.isArray(infoLabels?.technical) && infoLabels.technical.map((f, i) => (
              <Typography key={`tech-label-${i}`} sx={{ fontSize: '13px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
                {f.label}:
              </Typography>
            ))}
          </Box>

          {/* 技术值*/}
          <Box sx={{
            position: 'absolute',
            left: '390px',
            top: '82.15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {Array.isArray(infoLabels?.technical) && infoLabels.technical.map((f, i) => {
              const raw = (displayedMainImage?.technical?.[f.key]) ?? (imageInfo?.[f.key]);
              const value = (raw === undefined || raw === null || raw === '') ? '-' : raw;
              return (
                <Typography key={`tech-value-${i}`} sx={{ fontSize: '13px', color: '#000000', fontFamily: '"Open Sans", sans-serif' }}>
                  {value}
                </Typography>
              );
            })}
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
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'stretch',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                objectFit: 'contain'
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
  onImageSelect: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string)
};

export default memo(Image);
