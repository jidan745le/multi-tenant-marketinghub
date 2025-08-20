import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Divider,
  styled,
  Paper
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// 静态数据
const TOC_STRUCTURE_DS = [
  { id: 'brand-info', title: 'BRAND BOOK' },
  { id: 'colors', title: 'COLOR PALETTE' },
  { id: 'fonts', title: 'TYPOGRAPHY' },
  { id: 'icons', title: 'ICONOGRAPHY' },
  { id: 'logos', title: 'LOGOS' }
];

const TOC_STRUCTURE_MA = [
  { id: 'videos', title: 'PROMOTIONAL VIDEOS' },
  { id: 'lifestyles', title: 'BRAND STORY IMAGES' },
  { id: 'catalogs', title: 'CATALOGS' }
];


// 导航项
const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.25, 1),
  backgroundColor: active ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.grey[700], 
  '&:hover': {
    backgroundColor: active ? 'rgba(255, 102, 0, 0.16)' : theme.palette.action.hover,
  },
  transition: 'all 0.2s ease-in-out',
}));


const Toc = ({  activeSection, onSectionClick }) => {
  const tocStructureDS = TOC_STRUCTURE_DS;
  const tocStructureMA = TOC_STRUCTURE_MA;

  // 导航点击
  const handleNavClick = (section) => {
    const targetId = section.id;
    const anchor = `#${section.id}`;
    
    onSectionClick?.(targetId, anchor);
    
    if (anchor) {
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  };

  return (
    <Box sx={{ height: '60%', display: 'flex', flexDirection: 'column' }}>
      {/* Design Support */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h2" fontWeight="bold" fontSize="1.08rem">
          Design Support
        </Typography>
      </Box>
      <List sx={{ py: 1 }}>
        {tocStructureDS.map((section) => {
          const isActive = activeSection === section.id;
        
          return (
            <Box key={section.id}>
              <NavItem
                active={isActive}
                onClick={() => handleNavClick(section)}
              >
                <ListItemText 
                  primary={section.title}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'inherit' : 'inherit'
                  }}
                />
              </NavItem>
            </Box>
          );
        })}
      </List>
      {/* Marketing Assets */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider'}}>
        <Typography variant="h6" component="h2" fontWeight="bold" fontSize="1.08rem">
          Marketing Assets
        </Typography>
      </Box>
      <List sx={{ py: 1 }}>
        {tocStructureMA.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            <Box key={section.id}>
              <NavItem
                active={isActive}
                onClick={() => handleNavClick(section)}
              >
                <ListItemText 
                  primary={section.title}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 400, // 高亮时字体加粗
                    color: isActive ? 'inherit' : 'inherit' // 继承父组件的颜色
                  }}
                />
              </NavItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default Toc;
