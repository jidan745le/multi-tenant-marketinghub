import React, { memo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import UnifiedSkuTable from './UnifiedSkuTable';
import { useTheme } from '../hooks/useTheme';
import downloadIcon from '../assets/icon/download.png';


// 移除重复的SmallTriangleIcon定义，从共享组件导入
import SmallTriangleIcon from './SmallTriangleIcon';

const ProductCard = ({
  announcementPrefix = 'New Version Available:',
  announcementLinkText = 'Big Capacity Drawer Roller Cabinet with 6 Drawers 2024',
  showAnnouncement = true,
  statusText = 'In Development',
  modelNumber = '90330',
  title = 'Big Capacity Black Roller Cabinet with 6 Drawer - 160mm/6"',
  infoPairs, // 统一使用infoPairs，移除单独的状态props
  infoLabelMinWidth = '155px',
  infoValueMinWidth = '118px',
  skuData = [
    { size: '160mm/6"', material: '90257', finish: 'Nickel Iron Plated', imageUrl: '/assets/productcard_image.png' },
    { size: '180mm/6"', material: '90258', finish: 'Nickel Iron Plated', imageUrl: '' },
    { size: '200mm/6"', material: '90259', finish: 'Nickel Iron Plated', imageUrl: '' }
  ],
  onDownloadClick,
  onSkuNavigate,
  productImage,
}) => {
  const { primaryColor } = useTheme();
  const [skuAnchorEl, setSkuAnchorEl] = useState(null);
  
  // 提取样式常量 - 使用useMemo缓存
  const styles = React.useMemo(() => ({
    // 基础字体样式
    baseText: {
      color: '#4d4d4d',
      fontFamily: '"Open Sans", sans-serif',
      fontSize: 12,
      lineHeight: '14px',
      flex: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    // 容器尺寸常量
    dimensions: {
      cardHeight: 291,
      cardWidth: 282,
      imageHeight: 265,
      imageWidth: 276,
      rightContentWidth: 'calc(100% - 278.39px)',
      rightContentMinWidth: '481.66px'
    },
    // 颜色常量
    colors: {
      text: '#4d4d4d',
      border: '#cccccc',
      white: '#ffffff',
      background: '#ffffff',
      lightBorder: '#e6e6e6'
    }
  }), []);

  const commonStyles = {
    labelText: {
      ...styles.baseText,
      letterSpacing: '0.5px',
      fontWeight: 600
    },
    valueText: {
      ...styles.baseText,
      letterSpacing: '0.4px',
      fontWeight: 400
    },
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
  // 优先使用已选SKU；否则根据当前页面的 modelNumber 在 skuData 中匹配；不再默认取第一行，避免跳到上一产品
  const activeSku = React.useMemo(() => {
    if (selectedSku) return selectedSku;
    if (modelNumber && Array.isArray(skuData)) {
      const match = skuData.find((s) => s && s.productNumber === modelNumber);
      if (match) return match;
    }
    return null;
  }, [selectedSku, modelNumber, skuData]);
  // 首次或路由变更时，同步selectedSku以便下拉表行正确高亮
  React.useEffect(() => {
    if (!selectedSku && modelNumber && Array.isArray(skuData)) {
      const match = skuData.find((s) => s && s.productNumber === modelNumber);
      if (match) setSelectedSku(match);
    }
  }, [modelNumber, skuData, selectedSku]);
  const [isImageHover, setIsImageHover] = useState(false);
  const [isDownloadActive, setIsDownloadActive] = useState(false);
  
  // 选择SKU时，有productNumber就显示，没有就用modelNumber
  const currentModelNumber = activeSku && activeSku.productNumber ? activeSku.productNumber : modelNumber;
  const currentTitle = activeSku ? 
    `${title} - ${activeSku.size}` : 
    title;
  const currentImageUrl = (activeSku && activeSku.imageUrl) ? activeSku.imageUrl : (productImage || '');
  
  // 动态信息对：支持外部传入，否则使用默认值
  const defaultInfoPairs = [
    { label: 'Life Cycle Status', value: 'Active', withStatus: true },
    { label: 'Regional Launch Date', value: '2025-01-01' },
    { label: 'Enrichment Status', value: 'Global data ready' },
    { label: 'Final Release Date', value: '2025-06-01' }
  ];
  const effectiveInfoPairs = (infoPairs && Array.isArray(infoPairs) ? infoPairs : defaultInfoPairs)
    .filter(pair => pair && pair.value !== undefined && pair.value !== null && pair.value !== '');
  const chunkPairsToRows = (pairs, size = 2) => {
    const rows = [];
    for (let i = 0; i < pairs.length; i += size) {
      rows.push(pairs.slice(i, i + size));
    }
    return rows;
  };
  const infoRows = chunkPairsToRows(effectiveInfoPairs, 2);

  const showSkuSelect = Array.isArray(skuData) && skuData.length >= 2;

  // 优化事件处理函数 - 使用useCallback
  const handleDownloadImage = React.useCallback(() => {
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
  }, [activeSku, onDownloadClick]);

  const handleOpenSkuMenu = React.useCallback((event) => {
    if (isSkuDropdownOpen) {
      setSkuAnchorEl(null);
    } else {
      setSkuAnchorEl(event.currentTarget);
    }
  }, [isSkuDropdownOpen]);

  const handleSkuSelect = React.useCallback((sku) => {
    setSelectedSku(sku);
    setSkuAnchorEl(null); // 选择后关闭下拉框
    if (onSkuNavigate && sku && sku.productNumber) {
      onSkuNavigate(sku.productNumber);
    }
  }, [onSkuNavigate]);

  return (
    <Box sx={{ boxSizing: 'border-box', flexShrink: 0, height: styles.dimensions.cardHeight, position: 'relative' }}>
      {/* 图片下方文案 */}
      {showAnnouncement && (
        <Box sx={{
          textAlign: 'center',
          fontFamily: '"Open Sans", sans-serif',
          position: 'absolute', 
          left: 0, 
          top: 264, 
          width: styles.dimensions.cardWidth, 
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
      )}

      {/* 左侧图片与状态 */}
      <Box sx={{ width: styles.dimensions.imageWidth, height: 260, position: 'static' }}>
        {/* 图片容器 */}
        <Box sx={{
          background: styles.colors.background,
          border: `0.97px solid ${styles.colors.border}`,
          width: styles.dimensions.imageWidth, 
          height: styles.dimensions.imageHeight, 
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
                  backgroundSize: 'contain', 
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
                  width: 50, 
                  height: 50, 
                  top: 16,
                  left: 16,
                  cursor: onDownloadClick ? 'pointer' : 'default',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  transform: isDownloadActive ? 'translateY(-1px) scale(0.98)' : 'none',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                  boxShadow: isDownloadActive ? '0 3px 8px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {/* vector0.png */}
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    bgcolor: primaryColor,
                    WebkitMask: 'url(/assets/vector0.png) no-repeat center / contain',
                    mask: 'url(/assets/vector0.png) no-repeat center / contain',
                    display: 'inline-block'
                  }} 
                />
                {/* downloadIcon */}
                <Box 
                  component="img" 
                  src={downloadIcon} 
                  alt="download icon" 
                  sx={{ 
                    width: 28, 
                    height: 29,
                    position: 'relative',
                    // top: 26,
                    // left: 26,
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 状态标签 */}
        <Box sx={{ 
          background: `${primaryColor}15`, 
          height: 31, 
          position: 'absolute', 
          right: 0, 
          top: -12.5, 
          boxShadow: `-0.97px 0.97px 2.13px 0px ${primaryColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '8px',
          paddingRight: '8px',
          minWidth: 'fit-content',
          maxWidth: 'calc(100% - 8px)'
        }}>
          <Typography sx={{ 
            color: primaryColor, 
            textTransform: 'uppercase', 
            fontFamily: '"Open Sans", sans-serif', 
            fontSize: 14, 
            lineHeight: '19.33px', 
            letterSpacing: '0.1px', 
            fontWeight: 590,
            whiteSpace: 'nowrap'
          }}>
            {statusText}
          </Typography>
        </Box>
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
          width: '160%',
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
            {infoRows.map((pairs, rowIndex) => {
              const items = [];
              pairs.forEach((pair, idx) => {
                const isSecond = idx === 1;
                items.push({
                  value: pair.label,
                  isLabel: true,
                  cellStyle: { minWidth: pair.labelMinWidth || infoLabelMinWidth, flex: '1 1 25%', ...(isSecond ? { ml: 3 } : {}) }
                });
                items.push({
                  value: pair.value,
                  withStatus: !!pair.withStatus,
                  cellStyle: { py: 0.97, minWidth: pair.valueMinWidth || infoValueMinWidth, flex: '1 1 20%' },
                  textStyle: { whiteSpace: 'nowrap' }
                });
              });
              return (
                <InfoRow key={rowIndex} items={items} />
              );
            })}
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
            {showSkuSelect && (
              <>
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
                      selectedSku={selectedSku || activeSku}
                      onSkuSelect={handleSkuSelect}
                      variant="dropdown"
                      showStandard={false}
                    />
                  </Box>
                )}
              </>
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
  statusText: PropTypes.string,
  modelNumber: PropTypes.string,
  title: PropTypes.string,
  infoPairs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      withStatus: PropTypes.bool,
      labelMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      valueMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  infoLabelMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  infoValueMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  skuData: PropTypes.arrayOf(
    PropTypes.shape({
      productNumber: PropTypes.string,
      size: PropTypes.string.isRequired,
      material: PropTypes.string.isRequired,
      finish: PropTypes.string.isRequired,
      imageUrl: PropTypes.string
    })
  ),
  onDownloadClick: PropTypes.func,
  onSkuNavigate: PropTypes.func,
  productImage: PropTypes.string,
};

const MemoizedProductCard = memo(ProductCard);
export default MemoizedProductCard;
