import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';


// 三角形角标
const TriangleIcon = ({ expanded, ...props }) => (
  <Box
    component="span"
    sx={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: expanded ? 'none' : '6px solid white',
      borderBottom: expanded ? '6px solid white' : 'none',
      transition: 'all 0.15s ease-in-out',
      transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
      transformOrigin: 'center',
      display: 'inline-block',
      marginRight: '8px',
      ...props.sx
    }}
  />
);

const ProductSidebar = ({ 
  navigationItems = [],
  expandedSections = {},
  onSectionToggle = () => {},
  onNavigate = () => {},
  brandName = 'KENDO'
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ 
      width: { xs: 280, sm: 320, md: 360, lg: 380 }, 
      minWidth: 316,
      bgcolor: '#333333', 
      color: 'white'
    }}>
      {/* 固定Logo*/}
      <Box sx={{ 
        p: 2, 
        marginTop: 5, 
        position: 'sticky',
        top: 0,
        bgcolor: '#333333',
        zIndex: 1
      }}>
        <Box
          component="img"
          src="/assets/pdp_logo_mock.png"
          alt={brandName}
          sx={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </Box>

      {/* 可滚动导航 */}
      <Box sx={{ 
        p: 1, 
        marginTop: 4, 
        ml: 0.5,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 150px)',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '&::-moz-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {navigationItems.map((item) => (
          <Accordion
            key={item.id}
            expanded={expandedSections[item.id]}
            onChange={() => onSectionToggle(item.id)}
            sx={{
              bgcolor: 'transparent',
              color: 'white',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              '& .MuiAccordionSummary-root': {
                 minHeight: '48px !important',
                 height: '48px',
                 borderRadius: '4px',
                 '& .MuiAccordionSummary-expandIconWrapper': {
                   transform: 'none !important',
                 },
                 '&:hover': { 
                   bgcolor: theme.palette.primary.main + '15', 
                   borderRadius: 1,
                 }
               },
              '& .MuiAccordionDetails-root': {
                pt: 0,
                pb: 1,
                pl: 4
              }
            }}
          >
            <AccordionSummary
              expandIcon={<TriangleIcon expanded={expandedSections[item.id]} />}
              sx={{ 
                px: 1,
                '& .MuiAccordionSummary-content': {
                  margin: '4px 0',
                  alignItems: 'center'
                }
              }}
              onClick={() => onNavigate(item.id)}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                ml: 1,
                width: '100%'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    fontSize: '1.05rem',
                    py: 0.5,
                    px: 1,
                    cursor: 'pointer',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    lineHeight: '2.4',
                    width: '100%',
                    color: '#ffffff'
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2 }}>
              {item.subItems.map((subItem, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    fontSize: '1.05rem',
                    py: 0.5,
                    px: 1,
                    ml: -1,
                    pl: 2,
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.8)',
                    textTransform: 'none',
                    letterSpacing: '0.3px',
                    lineHeight: '2.4',
                    fontWeight: 400,
                    '&:hover': { 
                       bgcolor: theme.palette.primary.main + '15', 
                       borderRadius: 1,
                       color: theme.palette.primary.main
                     }
                  }}
                  onClick={() => onNavigate(item.id, subItem)}
                >
                  {subItem}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default ProductSidebar;
