import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import downloadIcon from '../assets/icon/download.png';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

// A unified table component for accessory | barcode | qrcode
// Structure and styles follow AccessoriesTable for visual consistency

const UnifiedInfoTable = ({
  type = 'accessory', // 'accessory' | 'barcode' | 'qrcode'
  data = [],
  onImageClick,
  onLinkClick,
  onDownloadClick
}) => {
  const { primaryColor } = useTheme();
  const { t } = useTranslation();

  // 与白色混合，得到非透明浅色
  const mixWithWhite = (hexColor, amount = 0.15) => {
    try {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const mix = (c) => Math.round((1 - amount) * 255 + amount * c);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
    } catch {
      return hexColor;
    }
  };

  // 生成条形码图片
  const generateBarcode = (eanCode) => {
    try {
      console.log('Generating barcode for:', eanCode, 'Length:', eanCode?.length);
      
      const canvas = document.createElement('canvas');
      
      // 根据EAN码长度选择格式
      let format = 'CODE128'; // 默认格式，支持更多字符
      if (eanCode && eanCode.length === 13) {
        format = 'EAN13';
      } else if (eanCode && eanCode.length === 8) {
        format = 'EAN8';
      }
      
      console.log('Using format:', format);
      
      JsBarcode(canvas, eanCode, {
        format: format,
        width: 1.5,  // 减小条形码宽度
        height: 40,  // 减小条形码高度
        displayValue: true, // 显示数字
        fontSize: 10, // 减小字体
        textMargin: 1,
        background: '#ffffff',
        lineColor: '#000000',
        margin: 5,   // 减小边距
        marginTop: 2,
        marginBottom: 2,
        valid: function(valid) {
          console.log('Barcode validation:', valid);
        }
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Error generating barcode:', error);
      // 如果生成失败，尝试使用CODE128格式
      try {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, eanCode, {
          format: 'CODE128',
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 10,
          textMargin: 1,
          background: '#ffffff',
          lineColor: '#000000',
          margin: 5,
          marginTop: 2,
          marginBottom: 2
        });
        return canvas.toDataURL();
      } catch (fallbackError) {
        console.error('Fallback barcode generation failed:', fallbackError);
        return null;
      }
    }
  };

  // 生成二维码图片
  const generateQRCode = async (link) => {
    try {
      const qrDataURL = await QRCode.toDataURL(link, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const handleImageClick = (item, index) => {
    if (onImageClick) onImageClick(item, index);
  };

  const handleLinkClick = (item, index) => {
    if (onLinkClick) onLinkClick(item, index);
    else if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = (item, index) => {
    if (onDownloadClick) onDownloadClick(item, index);
  };

  // 动态图片组件
  const DynamicImage = ({ item, index }) => {
    const [imageSrc, setImageSrc] = React.useState(item.image);

    React.useEffect(() => {
      const generateImage = async () => {
        if (type === 'barcode' && item.eanCode) {
          const barcodeImage = generateBarcode(item.eanCode);
          if (barcodeImage) {
            setImageSrc(barcodeImage);
          }
        } else if (type === 'qrcode' && item.link) {
          const qrImage = await generateQRCode(item.link);
          if (qrImage) {
            setImageSrc(qrImage);
          }
        }
      };

      generateImage();
    }, [item.eanCode, item.link]);

    return (
      <Box
        component="img"
        src={imageSrc}
        alt={item.name || `item-${index + 1}`}
        onClick={() => handleImageClick(item, index)}
        sx={{ 
          display: 'block', 
          maxWidth: '130px', // 限制最大宽度
          maxHeight: '80px',  // 限制最大高度
          width: 'auto', 
          height: 'auto', 
          position: 'relative', 
          objectFit: 'contain', 
          overflow: 'hidden', 
          cursor: onImageClick ? 'pointer' : 'default', 
          borderRadius: '4px', 
          '&:hover': onImageClick ? { transform: 'scale(1.02)', transition: 'transform 0.2s ease' } : {} 
        }}
      />
    );
  };

  // Header column labels per type
  const getHeaderTitles = () => {
    if (type === 'accessory') {
      return [
        t('accessoriesTable.image', 'Image'),
        t('accessoriesTable.model', 'Model'),
        t('accessoriesTable.name', 'Name'),
        t('accessoriesTable.quantity', 'Quantity')
      ];
    }
    if (type === 'barcode') {
      return [
        t('eanTable.image', 'Image'),
        t('eanTable.name', 'Name'),
        t('eanTable.eans', 'EANs'),
        t('eanTable.action', 'Action')
      ];
    }
    return [
      t('qrTable.image', 'Image'),
      t('qrTable.name', 'Name'),
      t('qrTable.link', 'Link'),
      t('qrTable.action', 'Action')
    ];
  };

  const headerTitles = getHeaderTitles();
  // 统一行内各单元格的最小高度，保证垂直对齐
  const cellMinHeight = '100px';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-start', justifyContent: 'flex-start', flexShrink: 0, position: 'relative', width: '100%' }}>
      {/* Header */}
      <Box sx={{
        background: mixWithWhite(primaryColor, 0.15),
        borderStyle: 'solid',
        borderColor: mixWithWhite(primaryColor, 0.30),
        borderWidth: '0.97px 0px 0.97px 0px',
        display: 'flex',
        flexDirection: 'row',
        gap: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        flexShrink: 0,
        height: '30.93px',
        position: 'relative'
      }}>
        {/* Col 1 */}
        <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, height: '30.93px', position: 'relative' }}>
          <Typography sx={{ color: primaryColor, textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '13px', lineHeight: '15.46px', letterSpacing: '0.48px', fontWeight: 600, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>{headerTitles[0]}</Typography>
        </Box>
        {/* Col 2 */}
        <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, height: '30.93px', position: 'relative' }}>
          <Typography sx={{ color: primaryColor, textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '13px', lineHeight: '15.46px', letterSpacing: '0.48px', fontWeight: 600, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>{headerTitles[1]}</Typography>
        </Box>
        {/* Col 3 */}
        <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, height: '30.93px', position: 'relative' }}>
          <Typography sx={{ color: primaryColor, textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '13px', lineHeight: '15.46px', letterSpacing: '0.48px', fontWeight: 600, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>{headerTitles[2]}</Typography>
        </Box>
        {/* Col 4 */}
        <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch', flex: 1, position: 'relative' }}>
          <Typography sx={{ color: primaryColor, textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '13px', lineHeight: '15.46px', letterSpacing: '0.48px', fontWeight: 600, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>{headerTitles[3]}</Typography>
        </Box>
      </Box>

      {/* Rows */}
      {data.map((item, index) => (
        <Box key={index} sx={{ background: '#ffffff', borderStyle: 'solid', borderColor: '#b3b3b3', borderWidth: '0px 0px 0.48px 0px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch', flexShrink: 0, position: 'relative', '&:hover': { backgroundColor: mixWithWhite(primaryColor, 0.10) } }}>
          {/* col 1 - image */}
          <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, position: 'relative', minHeight: cellMinHeight }}>
            <DynamicImage item={item} index={index} />
          </Box>

          {/* col 2 */}
          <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, position: 'relative', minHeight: cellMinHeight }}>
            <Typography sx={{ color: '#4d4d4d', textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '12.5px', lineHeight: '15.46px', letterSpacing: '0.39px', fontWeight: 400, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {type === 'accessory' ? item.model : item.name}
            </Typography>
          </Box>

          {/* col 3 */}
          <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: { xs: '25%', sm: '25%', md: '25%', lg: '25%' }, position: 'relative', minHeight: cellMinHeight }}>
            <Typography sx={{ color: '#4d4d4d', textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '12.5px', lineHeight: '15.46px', letterSpacing: '0.39px', fontWeight: 400, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {type === 'accessory' ? item.name : type === 'barcode' ? item.eanCode : item.link}
            </Typography>
          </Box>

          {/* col 4 - action */}
          <Box sx={{ padding: '7.73px', display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch', flex: 1, position: 'relative', minHeight: cellMinHeight }}>
            {type === 'accessory' && (
              <Typography sx={{ color: '#4d4d4d', textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '12.5px', lineHeight: '15.46px', letterSpacing: '0.39px', fontWeight: 400, position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {item.quantity}
              </Typography>
            )}
            {type === 'barcode' && (
              <Button onClick={() => handleDownload(item, index)} sx={{ color: '#4d4d4d', textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '12.5px', lineHeight: '15.46px', letterSpacing: '0.39px', fontWeight: 400, position: 'relative', width: '145px', textOverflow: 'ellipsis', overflow: 'hidden', minWidth: 'auto', padding: 0, textTransform: 'none', justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', '&:hover': { color: primaryColor, textDecoration: 'underline' } }}>
                <Box
                  sx={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: primaryColor,
                    maskImage: `url(${downloadIcon})`,
                    WebkitMaskImage: `url(${downloadIcon})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    flexShrink: 0
                  }}
                />
                {t('eanTable.downloadBarcode', 'Download Barcode')}
              </Button>
            )}
            {type === 'qrcode' && (
              <Button onClick={() => handleLinkClick(item, index)} sx={{ color: '#4d4d4d', textAlign: 'left', fontFamily: '"Open Sans", sans-serif', fontSize: '12.5px', lineHeight: '15.46px', letterSpacing: '0.39px', fontWeight: 400, textDecoration: 'underline', position: 'relative', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', minWidth: 'auto', padding: 0, textTransform: 'none', justifyContent: 'flex-start', '&:hover': { color: primaryColor, textDecoration: 'underline' } }}>
                {t('qrTable.linkAction', 'Link')}
              </Button>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

UnifiedInfoTable.propTypes = {
  type: PropTypes.oneOf(['accessory', 'barcode', 'qrcode']),
  data: PropTypes.arrayOf(PropTypes.object),
  onImageClick: PropTypes.func,
  onLinkClick: PropTypes.func,
  onDownloadClick: PropTypes.func
};

export default memo(UnifiedInfoTable);


