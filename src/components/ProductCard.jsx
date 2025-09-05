import React, { memo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import UnifiedSkuTable from './UnifiedSkuTable';
import { useTheme } from '../hooks/useTheme';


// 三角形角标组件
const SmallTriangleIcon = ({ expanded, color = '#ffffff' }) => (
  <Box
    component="span"
    sx={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: expanded ? 'none' : `6px solid ${color}`,
      borderBottom: expanded ? `6px solid ${color}` : 'none',
      transition: 'all 0.15s ease-in-out',
      display: 'inline-block',
      ml: 3.5
    }}
  />
);

const ProductCard = ({
  announcementPrefix = 'New Version Available:',
  announcementLinkText = 'Big Capacity Drawer Roller Cabinet with 6 Drawers 2024',
  statusText = 'In Development',
  modelNumber = '90330',
  title = 'Big Capacity Black Roller Cabinet with 6 Drawer - 160mm/6"',
  lifeCycleStatus = 'Active',
  regionalLaunchDate = '2025-01-01',
  enrichmentStatus = 'Global data ready',
  finalReleaseDate = '2025-06-01',
  skuData = [
    { size: '160mm/6"', material: '90257', finish: 'Nickel Iron Plated', imageUrl: '/assets/productcard_image.png' },
    { size: '180mm/6"', material: '90258', finish: 'Nickel Iron Plated', imageUrl: '' },
    { size: '200mm/6"', material: '90259', finish: 'Nickel Iron Plated', imageUrl: '' }
  ],
  onDownloadClick,
}) => {
  const { primaryColor } = useTheme();
  const [skuAnchorEl, setSkuAnchorEl] = useState(null);
  
  const commonStyles = {
    // Typography样式
    labelText: {
      color: '#4d4d4d',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: 12,
      lineHeight: '14px',
      letterSpacing: '0.5px',
      fontWeight: 600,
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    valueText: {
      color: '#4d4d4d',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: 12,
      lineHeight: '14px',
      letterSpacing: '0.4px',
      fontWeight: 400,
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    // Box容器样式
    infoRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: 0,
      position: 'relative',
      gap: 1
    },
    infoCell: {
      p: 0.97,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      height: 30.93,
      position: 'relative'
    }
  };

  // 信息行组件
  const InfoRow = ({ items }) => (
    <Box sx={commonStyles.infoRow}>
      {items.map((item, index) => (
        <Box key={index} sx={{ ...commonStyles.infoCell, ...item.cellStyle }}>
          {item.withStatus ? (
            <Box sx={{ py: 0.72, px: 0.97, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'stretch', flex: 1, position: 'relative' }}>
              <Typography sx={{ ...commonStyles.valueText, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography component="span" sx={{ color: '#6eb82a', mr: 0.5 }}>●</Typography>
                <Typography component="span" sx={{ color: '#4d4d4d', fontSize: 12.5 }}>{item.value}</Typography>
              </Typography>
            </Box>
          ) : (
            <Typography sx={item.isLabel ? commonStyles.labelText : { ...commonStyles.valueText, ...item.textStyle }}>
              {item.value}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
  const isSkuDropdownOpen = Boolean(skuAnchorEl);
  const skuTableRef = useRef(null);
  
  const [selectedSku, setSelectedSku] = useState(null);
  // 默认显示下拉框第一行数据
  const activeSku = selectedSku || (skuData && skuData.length > 0 ? skuData[0] : null);
  const [isImageHover, setIsImageHover] = useState(false);
  const [isDownloadActive, setIsDownloadActive] = useState(false);
  
  const currentModelNumber = activeSku ? activeSku.material : modelNumber;
  const currentTitle = activeSku ? 
    `${title} - ${activeSku.size}` : 
    title;
  const currentImageUrl = activeSku && activeSku.imageUrl ? activeSku.imageUrl : '';

  const handleDownloadImage = () => {
    const url = activeSku && activeSku.imageUrl ? activeSku.imageUrl : '';
    if (!url) return;
    const fileName = url.split('/').pop() || 'image';
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onDownloadClick) onDownloadClick();
  };

  // 开关
  const handleOpenSkuMenu = (event) => {
    if (isSkuDropdownOpen) {
      setSkuAnchorEl(null);
    } else {
      setSkuAnchorEl(event.currentTarget);
    }
  };
  const handleSkuSelect = (sku) => {
    setSelectedSku(sku);
  };

  return (
    <Box sx={{ boxSizing: 'border-box', flexShrink: 0, height: 291, position: 'relative' }}>
      {/* 图片下方文案 */}
      <Box sx={{
        textAlign: 'center',
        fontFamily: '"Open Sans", sans-serif',
        position: 'absolute', 
        left: 0, 
        top: 264, 
        width: 282, 
        height: 30,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 2
      }}>
        <Typography sx={{ 
          color: primaryColor, 
          fontWeight: 700, 
          fontSize: 11, 
          height: 11.5,
          maxWidth: '100%', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis'
        }}>
          {announcementPrefix}
        </Typography>
        <Typography sx={{ 
          color: 'gray', 
          textDecoration: 'underline', 
          fontSize: 12.3, 
          maxWidth: '100%', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis'
        }}>
          {announcementLinkText}
        </Typography>
      </Box>

      {/* 左侧图片与状态 */}
      <Box sx={{ width: 276, height: 260, position: 'static' }}>
        {/* 图片容器 */}
        <Box sx={{
          background: '#ffffff',
          border: '0.97px solid #cccccc',
          width: 276, 
          height: 265, 
          position: 'absolute', 
          left: 0.05, 
          top: -13,
          overflow: 'hidden'
        }}>
          <Box
            onMouseEnter={() => setIsImageHover(true)}
            onMouseLeave={() => setIsImageHover(false)}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                ...(currentImageUrl && {
                  backgroundImage: `url(${currentImageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain', // 改为contain以完整显示图片
                  backgroundRepeat: 'no-repeat'
                }),
                filter: isImageHover ? 'blur(2px)' : 'none',
                transition: 'filter 180ms ease'
              }}
            />
            {/* 下载按钮 */}
            <Box sx={{ 
              position: 'absolute', 
              right: 0, 
              bottom: 0, 
              p: 1.93 
            }}>
              <Box
                role="button"
                aria-label="download"
                onClick={handleDownloadImage}
                onMouseDown={() => setIsDownloadActive(true)}
                onMouseUp={() => setIsDownloadActive(false)}
                onMouseLeave={() => setIsDownloadActive(false)}
                sx={{ 
                  width: 16, 
                  height: 16, 
                  cursor: onDownloadClick ? 'pointer' : 'default',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transform: isDownloadActive ? 'translateY(-1px) scale(0.98)' : 'none',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                  boxShadow: isDownloadActive ? '0 3px 8px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                <Box 
                  component="img" 
                  src="/assets/vector0.png" 
                  alt="download" 
                  sx={{ 
                    width: 50, 
                    height: 50,
                    display: 'block'
                  }} 
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 状态标签 */}
        <Box sx={{ 
          background: `${primaryColor}15`, 
          width: 135, 
          height: 31, 
          position: 'absolute', 
          left: 140, 
          top: -12.5, 
          boxShadow: `-0.97px 0.97px 2.13px 0px ${primaryColor}40` 
        }} />
        <Typography sx={{ 
          color: primaryColor, 
          textTransform: 'uppercase', 
          position: 'absolute', 
          left: 148, 
          top: -4.5, 
          width: 130, 
          height: 18, 
          fontFamily: '"Open Sans", sans-serif', 
          fontSize: 14, 
          lineHeight: '19.33px', 
          letterSpacing: '0.1px', 
          fontWeight: 590 
        }}>
          {statusText}
        </Typography>
      </Box>

      {/* 右侧内容 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.93, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'calc(100% - 278.39px)', minWidth: '481.66px', height: 253.21, position: 'absolute', left: 278.39, top: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.97, alignItems: 'flex-start', justifyContent: 'flex-start', alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, width: 481.29, position: 'relative' }}>
            <Typography sx={{ color: primaryColor, fontFamily: '"Open Sans", sans-serif', fontSize: 22, lineHeight: '19.33px', letterSpacing: '0.1px', fontWeight: 500, position: 'relative',ml:3, mt:-1.5, width: 368.22, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              {currentModelNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 550, position: 'relative' }}>
            <Typography sx={{ color: '#000', fontFamily: 'Open Sans, sans-serif', fontSize: 33, lineHeight: '34.79px', fontWeight: 400, position: 'relative', flex: 1,ml:3, mt:0.5 }}>
              {currentTitle}
            </Typography>
          </Box>
        </Box>

        {/* 信息卡片 */}
        <Box sx={{ 
          background: '#ffffff', 
          borderRadius: 1, 
          border: '0.97px solid #e6e6e6', 
          flexShrink: 0, 
          width: 998,
          height: 192, 
          position: 'relative', 
          overflow: 'visible', 
          ml: 3
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            justifyContent: 'flex-start', 
            // width: 'calc(100% - 23px)', 
            position: 'absolute', 
            left: 11.48, 
            top: 7.56 
          }}>
            {/* 信息行 */}
            <InfoRow items={[
              { value: 'Life Cycle Status', isLabel: true, cellStyle: { minWidth: '130px', flex: '1 1 25%' } },
              { value: lifeCycleStatus, withStatus: true, cellStyle: { py: 0.97, minWidth: '111px', flex: '1 1 20%' } },
              { value: 'Regional Launch Date', isLabel: true, cellStyle: { minWidth: '165px', flex: '1 1 30%', ml: 3.3 } },
              { value: regionalLaunchDate, cellStyle: { minWidth: '118px', flex: '1 1 25%' } }
            ]} />
            
            <InfoRow items={[
              { value: 'Enrichment Status', isLabel: true, cellStyle: { minWidth: '134px', flex: '1 1 25%' } },
              { value: enrichmentStatus, cellStyle: { py: 0.97, minWidth: '118px', flex: '1 1 20%' }, textStyle: { whiteSpace: 'nowrap' } },
              { value: 'Final Release Date', isLabel: true, cellStyle: { minWidth: '139px', flex: '1 1 30%', ml: 2 } },
              { value: finalReleaseDate, cellStyle: { minWidth: '118px', flex: '1 1 25%', ml: 2.9 } }
            ]} />
          </Box>
          <Box sx={{ 
            background: '#ffffff', 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 1.5, 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            position: 'absolute', 
            left: 19.85, 
            top: 142.81,
            overflow: 'visible'
          }}>
            <Button
              variant="contained"
              onClick={handleOpenSkuMenu}
              endIcon={<SmallTriangleIcon expanded={isSkuDropdownOpen} />}
              aria-label="Select SKU"
              sx={{
                background: primaryColor,
                borderRadius: 1,
                border: `0.97px solid ${primaryColor}dd`,
                p: '11.6px 7.73px',
                width: 128,
                height: 26,
                minWidth: 'auto',
                textTransform: 'none',
                position: 'relative',
                '&:hover': {
                  border: `0.97px solid ${primaryColor}dd`,
                },
                '& .MuiButton-endIcon': {
                  marginLeft: '4px',
                  marginRight: '0px'
                }
              }}
            >
              <Typography sx={{ 
                color: '#ffffff', 
                fontFamily: 'Open Sans, sans-serif', 
                fontSize: 11.5, 
                lineHeight: '16px', 
                letterSpacing: '0.4px', 
                fontWeight: 500,
                textOverflow: 'ellipsis', 
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                ml: -0.5,
                mt: 0.3
              }}>
                Select SKU
              </Typography>
            </Button>
            {isSkuDropdownOpen && (
              <Box 
                ref={skuTableRef}
                sx={{ 
                  position: 'absolute', 
                  top: 34,
                  left: 0,
                  zIndex: 2000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: '4px'
                }}
              >
                <UnifiedSkuTable 
                  data={skuData} 
                  selectedSku={selectedSku}
                  onSkuSelect={handleSkuSelect}
                  variant="dropdown"
                  showStandard={false}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ProductCard.propTypes = {
  announcementPrefix: PropTypes.string,
  announcementLinkText: PropTypes.string,
  previewImage: PropTypes.string,
  statusText: PropTypes.string,
  modelNumber: PropTypes.string,
  title: PropTypes.string,
  lifeCycleStatus: PropTypes.string,
  regionalLaunchDate: PropTypes.string,
  enrichmentStatus: PropTypes.string,
  finalReleaseDate: PropTypes.string,
  skuData: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      material: PropTypes.string.isRequired,
      finish: PropTypes.string.isRequired
    })
  ),
  onDownloadClick: PropTypes.func,
};

const MemoizedProductCard = memo(ProductCard);
export default MemoizedProductCard;
