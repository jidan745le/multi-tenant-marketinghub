import React, {  useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  styled
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import UpdateIcon from '@mui/icons-material/Update';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CookieIcon from '@mui/icons-material/Cookie';

// 导航项样式
const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.25, 0),
  backgroundColor: 'transparent',
  color: active ? theme.palette.primary.main : '#000000',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: 'all 0.2s ease-in-out',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}));



const LegalToc = ({ activeSection, onSectionClick, tocItems: externalTocItems }) => {
  const tocItems = (externalTocItems && externalTocItems.length)
    ? externalTocItems
    : '';

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          if (activeSection !== tocItems[i].id) {
            onSectionClick?.(tocItems[i].id);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems, activeSection, onSectionClick]);

  // 导航点击处理
  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
    onSectionClick?.(sectionId);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mt: { xs: 0, md: 4 }, minWidth: '240px', width: '100%' }}>
      <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 9, fontSize: '1.3rem' }}>
        Contents
      </Typography>
      <List sx={{ py: 0, width: '100%' }}>
        {tocItems.map((item) => {
          // const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ width: '100%' }}>
              <NavItem
                active={isActive}
                onClick={() => handleNavClick(item.id)}
              >
                {/* <ListItemIcon sx={{ minWidth: 36 }}>
                  {IconComponent ? (
                    <IconComponent 
                      sx={{ 
                        fontSize: '1.1rem',
                        color: isActive ? 'primary.main' : 'grey.600'
                      }} 
                    />
                  ) : null}
                </ListItemIcon> */}
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'inherit' : '#000000',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  //   wordWrap: 'break-word',
                  // overflowWrap: 'break-word'
                  }}
                />
              </NavItem>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default LegalToc;
