import React, { useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';

// 静态数据
const TOC_STRUCTURE_DS = [
  { id: 'brand-info', title: 'BRAND BOOK' },
  { id: 'colors', title: 'COLOR PALETTE' },
  { id: 'fonts', title: 'TYPOGRAPHY' },
  { id: 'icons', title: 'ICONOGRAPHY' },
  { id: 'logos', title: 'LOGOS' }
];

const TOC_STRUCTURE_MA = [
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


const Toc = ({  data, activeSection, onSectionClick }) => {
  const { t } = useTranslation();

  const tocStructureDS = useMemo(() => {
    const list = [];
    if (data?.bookInfo?.length) list.push({ id: 'brand-info', title: data.bookInfo?.[0]?.nav_title || 'BRAND BOOK' });
    if (data?.colors?.length) list.push({ id: 'colors', title: data?.sectionTitles?.colors || 'COLOR PALETTE' });
    if (data?.fonts?.length) list.push({ id: 'fonts', title: data?.sectionTitles?.fonts || 'TYPOGRAPHY' });  
    // 遍历 externalMedias
    if (data?.externalMedias && Array.isArray(data.externalMedias)) {
      data.externalMedias.forEach((media) => {
        if (!media) return;
        
        const mediaType = media.mediaType?.toLowerCase();
        if (mediaType === 'icons') {
          list.push({ id: 'icons', title: media.subtitle || 'ICONOGRAPHY' });
        } else if (mediaType === 'logos') {
          list.push({ id: 'logos', title: media.subtitle || 'LOGOS' });
        }
      });
    }
    return list.length ? list : TOC_STRUCTURE_DS;
  }, [data]);

  const tocStructureMA = useMemo(() => {
    const list = [];
    if (data?.externalMedias && Array.isArray(data.externalMedias)) {
      data.externalMedias.forEach((media) => {
        if (!media) return;
        
        const mediaType = media.mediaType?.toLowerCase();
        if (mediaType === 'catalogs') {
          list.push({ id: 'catalogs', title: media.subtitle || 'CATALOGS' });
        }
      });
    }
    
    return list.length ? list : TOC_STRUCTURE_MA;
  }, [data]);
   
  // 导航点击
  const handleNavClick = (section) => {
    const targetId = section.id;
    const anchor = `#${section.id}`;
    
    onSectionClick?.(targetId, anchor);
    
    if (anchor) {
      const element = document.querySelector(anchor);
      if (element) {
        //对brandbook导航做一个限制：导航位置会留出顶部距离
        if (targetId === 'brand-info') {
          let scrollContainer = element.parentElement;
          while (scrollContainer && scrollContainer !== document.body) {
            const style = window.getComputedStyle(scrollContainer);
            if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                style.overflowY === 'auto' || style.overflowY === 'scroll') {
              const containerRect = scrollContainer.getBoundingClientRect();
              const elementRect = element.getBoundingClientRect();
              const offsetTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - 24;
              
              scrollContainer.scrollTo({ 
                top: Math.max(0, offsetTop), 
                behavior: 'smooth' 
              });
              return;
            }
            scrollContainer = scrollContainer.parentElement;
          }
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        } else {
          // 其他导航保持原有行为
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    }
  };

  return (
    <Box sx={{ height: '60%', display: 'flex', flexDirection: 'column' }}>
      {/* Design Support */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h2" fontWeight="bold" fontSize="1.08rem">
          {t('brandbook.designSupport', 'Design Support')}
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
                    color: isActive ? 'inherit' : 'inherit',
                    lineHeight: '2'
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
          {t('brandbook.marketingAssets', 'Marketing Assets')}
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
                    color: isActive ? 'inherit' : 'inherit'
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
