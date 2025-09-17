import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const UnifiedSkuTable = ({ 
  data = [], 
  selectedSku = null, 
  onSkuSelect,
  variant = 'dropdown', // 'dropdown' | 'detail'
  showStandard = false
}) => {
  const { primaryColor } = useTheme();
  const isDropdown = variant === 'dropdown';

  // 混色：非透明主题色浅色
  const mixWithWhite = (hexColor, amount = 0.15) => {
    try {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const mix = (c) => Math.round((1 - amount) * 255 + amount * c);
      const nr = mix(r);
      const ng = mix(g);
      const nb = mix(b);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
    } catch {
      return hexColor;
    }
  };
  
  const containerStyles = isDropdown ? {
    borderRadius: '3.2px',
    border: `0.8px solid ${primaryColor}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    width: 'auto'
  } : {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexShrink: 0,
    position: 'relative',
    width: '100%',
    bgcolor: '#ffffff',
    border: '1px solid #eeeeee',
    borderLeft: 'none',
    borderRight: 'none'
  };

  const headerStyles = isDropdown ? {
    background: mixWithWhite(primaryColor, 0.15),
    borderRadius: '3.2px 3.2px 0px 0px',
    border: `0.77px solid ${mixWithWhite(primaryColor, 0.30)}`,
    borderWidth: '0.77px 0px 0.77px 0px',
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    flexShrink: 0,
    minHeight: '24.74px',
    height: 'auto',
    position: 'relative'
  } : {
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
    minHeight: '30.93px',
    height: 'auto',
    position: 'relative'
  };

  const cellStyles = isDropdown ? {
    padding: '6.19px',
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
    minHeight: '24.8px',
    height: 'auto',
    position: 'relative'
  } : {
    padding: '7.73px',
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
    minHeight: '30.93px',
    height: 'auto',
    position: 'relative'
  };

  const columnWidths = isDropdown ? {
    size: '145px',
    material: '190px',
    finish: '240px',
    standard: '128px'
  } : {
    size: '189.91px',
    material: '220px',
    finish: '300px',
    standard: '200px'
  };

  // const fontSize = isDropdown ? '12px' : '11.6px';
  const headerFontSize = isDropdown ? '10.5px' : '13px';
  const cellFontSize = isDropdown ? '11.6px' : '12.5px';
  const lineHeight = isDropdown ? '12.37px' : '15.46px';
  const headerLineHeight = isDropdown ? '14px' : '17px';
  const letterSpacing = isDropdown ? '0.39px' : '0.48px';

  const headerTextStyles = {
    color: primaryColor,
    textAlign: 'left',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: headerFontSize,
    lineHeight: headerLineHeight,
    letterSpacing: letterSpacing,
    fontWeight: 600,
    position: 'relative',
    flex: 1,
    whiteSpace: 'normal',
    wordBreak: 'break-word'
  };

  const cellTextStyles = {
    color: '#4d4d4d',
    textAlign: 'left',
    fontFamily: 'Open Sans, sans-serif',
    fontSize: cellFontSize,
    lineHeight: lineHeight,
    letterSpacing: isDropdown ? '0.31px' : '0.39px',
    fontWeight: 400,
    position: 'relative',
    flex: 1,
    whiteSpace: 'normal',
    wordBreak: 'break-word'
  };

  return (
    <Box sx={containerStyles}>
      {/* Header */}
      <Box sx={headerStyles}>
        <Box sx={{ ...cellStyles, width: columnWidths.size }}>
          <Typography sx={headerTextStyles}>
            Size/ MainParameter
          </Typography>
        </Box>
        <Box sx={{ ...cellStyles, width: columnWidths.material }}>
          <Typography sx={headerTextStyles}>
            Main Material
          </Typography>
        </Box>
        <Box sx={{ ...cellStyles, width: columnWidths.finish, justifyContent: 'flex-end' }}>
          <Typography sx={headerTextStyles}>
            Surface Finish
          </Typography>
        </Box>
        {showStandard && (
          <Box sx={{ ...cellStyles, width: columnWidths.standard }}>
            <Typography sx={headerTextStyles}>
              Applicable Standard
            </Typography>
          </Box>
        )}
      </Box>

      {/* Rows */}
      {data.map((sku, index) => {
        const isSelected = selectedSku && selectedSku.material === sku.material && selectedSku.size === sku.size;
        
        const rowStyles = isDropdown ? {
          background: isSelected ? mixWithWhite(primaryColor, 0.20) : '#ffffff',
          border: '0.39px solid #b3b3b3',
          borderWidth: '0px 0px 0.39px 0px',
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          alignSelf: 'stretch',
          flexShrink: 0,
          position: 'relative',
          borderRadius: index === data.length - 1 ? '0px 0px 3.2px 3.2px' : '0px',
          cursor: onSkuSelect ? 'pointer' : 'default',
          '&:hover': onSkuSelect ? {
            background: isSelected ? mixWithWhite(primaryColor, 0.26) : mixWithWhite(primaryColor, 0.18)
          } : {}
        } : {
          background: '#ffffff',
          borderStyle: 'solid',
          borderColor: '#b3b3b3',
          borderWidth: '0 0 0.48px 0',
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          alignSelf: 'stretch',
          flexShrink: 0,
          position: 'relative'
        };

        return (
          <Box
            key={index}
            onClick={() => onSkuSelect && onSkuSelect(sku)}
            sx={rowStyles}
          >
            <Box sx={{ ...cellStyles, width: columnWidths.size }}>
              <Typography sx={cellTextStyles}>
                {sku.size}
              </Typography>
            </Box>
            <Box sx={{ ...cellStyles, width: columnWidths.material }}>
              <Typography sx={cellTextStyles}>
                {sku.material}
              </Typography>
            </Box>
            <Box sx={{ ...cellStyles, width: columnWidths.finish }}>
              <Typography sx={cellTextStyles}>
                {sku.finish}
              </Typography>
            </Box>
            {showStandard && (
              <Box sx={{ ...cellStyles, width: columnWidths.standard }}>
                <Typography sx={cellTextStyles}>
                  {sku.standard || '-'}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

UnifiedSkuTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string.isRequired,
      material: PropTypes.string.isRequired,
      finish: PropTypes.string.isRequired,
      standard: PropTypes.string
    })
  ),
  selectedSku: PropTypes.shape({
    size: PropTypes.string,
    material: PropTypes.string,
    finish: PropTypes.string
  }),
  onSkuSelect: PropTypes.func,
  variant: PropTypes.oneOf(['dropdown', 'detail']),
  showStandard: PropTypes.bool
};

export default memo(UnifiedSkuTable);
