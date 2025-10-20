import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const BackToTopButton = () => {
  const { primaryColor} = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain amount
  const toggleVisibility = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    if (scrollContainer) {
      const scrollTop = scrollContainer.scrollTop;
      setIsVisible(scrollTop > 300);
    } else {
      // 前面那个不行就用这个：监听 window 滚动
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 300);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', toggleVisibility);
    } else {
      window.addEventListener('scroll', toggleVisibility);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', toggleVisibility);
      } else {
        window.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        width: '48px',
        height: '48px',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        cursor: 'pointer',
        display: isVisible ? 'block' : 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={scrollToTop}
    >
      <Box
        sx={{
          background: `${primaryColor}22`,
          borderRadius: '4px',
          width: '50px',
          height: '54px',
          position: 'absolute',
          left: '0px',
          top: '0px',
          aspectRatio: '1',
          transition: 'background 0.2s ease',
        }}
      />
      {/* 图标*/}
      <Box
        component="img"
        src="/assets/vertical_Align_Top.png"
        alt="Back to top"
        sx={{
          position: 'absolute',
          left: '10px',
          top: '16px',
          width: '30px',
          height: '30px',
          display: 'inline-block',
          zIndex: 1001,
        }}
      />
  </Box>
  );
};

export default BackToTopButton;
