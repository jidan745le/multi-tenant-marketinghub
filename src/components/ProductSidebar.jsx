import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../hooks/useTheme';
import SmallTriangleIcon from './SmallTriangleIcon';

const ProductSidebar = ({ 
  navigationItems = [],
  expandedSections = {},
  onSectionToggle = () => {},
  onNavigate = () => {},
  brandName = 'KENDO'
}) => {
  const theme = useMuiTheme();
  const { currentBrand, brandLogo } = useAppTheme();
  console.log('ProductSidebar: currentBrand', currentBrand);
  console.log('ProductSidebar: brandLogo', brandLogo);
  const baseUrl = import.meta.env.VITE_STRAPI_BASE_URL || '';
  const resolvedLogoUrl = brandLogo?.url
    ? (brandLogo.url.startsWith('http') ? brandLogo.url : `${baseUrl}${brandLogo.url}`)
    : '/assets/pdp_logo_mock.png';
  const resolvedBrandName = brandName || (currentBrand ? currentBrand.toUpperCase() : 'KENDO');
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
          src={resolvedLogoUrl}
          alt={resolvedBrandName}
          sx={{
            height: '26px',
            width: 'auto',
            ml: 2.5,
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
              expandIcon={<SmallTriangleIcon expanded={expandedSections[item.id]} color="#ffffff" />}
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
