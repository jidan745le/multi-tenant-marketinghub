import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const ProductCardGrid = ({ 
  products = [],
  onProductClick,
  onImageClick 
}) => {
  const { primaryColor } = useTheme();

  const handleProductClick = (product, index) => {
    if (onProductClick) {
      onProductClick(product, index);
    }
  };

  const handleImageClick = (product, index, event) => {
    event.stopPropagation(); // 阻止事件冒泡
    if (onImageClick) {
      onImageClick(product, index);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: { xs: '10px', sm: '13.7px', md: '20px', lg: '25px' },
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative',
      flexWrap: 'wrap'
    }}>
      {products.map((product, index) => (
        <Box
          key={index}
          onClick={() => handleProductClick(product, index)}
          sx={{
            flexShrink: 0,
            width: { xs: '200px', sm: '244.29px', md: '280px', lg: '300px' },
            height: { xs: '160px', sm: '196.19px', md: '220px', lg: '240px' },
            position: 'relative',
            cursor: onProductClick ? 'pointer' : 'default',
            '&:hover': onProductClick ? {
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease',
              '& .product-border': {
                borderColor: primaryColor,
                boxShadow: `0 4px 12px ${primaryColor}20`
              }
            } : {}
          }}
        >
          {/* 边框 */}
          <Box
            className="product-border"
            sx={{
              borderRadius: '3.42px',
              borderStyle: 'solid',
              borderColor: '#d9d9d9',
              borderWidth: '0.86px',
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          />

          {/* 产品图片 */}
          <Box
            component="img"
            src={product.image}
            alt={product.name || `Product ${index + 1}`}
            onClick={(event) => handleImageClick(product, index, event)}
            sx={{
              width: { xs: '80px', sm: '107.97px', md: '120px', lg: '130px' },
              height: { xs: '65px', sm: '88.93px', md: '100px', lg: '110px' },
              position: 'absolute',
              left: { xs: '15px', sm: '18.36px', md: '20px', lg: '22px' },
              top: { xs: '15px', sm: '17.4px', md: '20px', lg: '22px' },
              objectFit: 'contain',
              aspectRatio: '107.97/88.93',
              cursor: onImageClick ? 'pointer' : 'default',
              borderRadius: '4px',
              '&:hover': onImageClick ? {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease'
              } : {}
            }}
          />

          {/* 产品编号 */}
          <Typography sx={{
            color: primaryColor,
            textAlign: 'center',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: { xs: '10px', sm: '11.6px', md: '12px', lg: '13px' },
            lineHeight: '7.92px',
            letterSpacing: '0.25px',
            fontWeight: 400,
            position: 'absolute',
            left: { xs: '10px', sm: '12.56px', md: '15px', lg: '18px' },
            top: { xs: '100px', sm: '136.27px', md: '150px', lg: '160px' },
            cursor: onProductClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            '&:hover': onProductClick ? {
              color: primaryColor,
              transform: 'scale(1.05)',
              // fontWeight: 500
            } : {},
            '&:active': onProductClick ? {
              transform: 'scale(0.95)',
              color: primaryColor,
              opacity: 0.8
            } : {}
          }}>
            {product.code}
          </Typography>

          {/* 产品名称 */}
          <Typography sx={{
            color: '#000000',
            textAlign: 'left',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: { xs: '12px', sm: '13.7px', md: '14px', lg: '15px' },
            lineHeight: '130%',
            letterSpacing: '0.01em',
            fontWeight: 400,
            position: 'absolute',
            left: { xs: '10px', sm: '12.56px', md: '15px', lg: '18px' },
            top: { xs: '110px', sm: '147.87px', md: '165px', lg: '175px' },
            width: { xs: 'calc(100% - 20px)', sm: '217.51px', md: 'calc(100% - 30px)', lg: 'calc(100% - 36px)' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

ProductCardGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    })
  ),
  onProductClick: PropTypes.func,
  onImageClick: PropTypes.func
};

export default memo(ProductCardGrid);
