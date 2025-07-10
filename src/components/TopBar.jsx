import {
  ArrowDropDown,
  DownloadOutlined,
  Language,
  ShareOutlined,
  StickyNote2Outlined
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/icon/kendo.png';

// Styled Components
const StyledTopBar = styled(Box)(({ theme }) => ({
  background: '#333333',
  padding: '24px 24px 0px 24px',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
}));

const StyledTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '24px',
}));

const StyledNavBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: '12px',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '32px',
  marginRight: '12px',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: '#EB6100',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
}));

const PortalDropdown = styled(Box)(({ theme }) => ({
  background: '#f7f7f7',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  padding: '0px 8px 0px 12px',
  display: 'flex',
  alignItems: 'center',
  height: '40px',
  minWidth: '92px',
  cursor: 'pointer',
  '&:hover': {
    background: '#eeeeee',
  },
}));

const PortalLabel = styled(Typography)(({ theme }) => ({
  color: '#000000',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  marginRight: '8px',
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: '#ffffff',
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    strokeWidth: '0.8',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const LanguageDropdown = styled(Box)(({ theme }) => ({
  background: '#f7f7f7',
  borderRadius: '4px',
  border: '1px solid #cccccc',
  padding: '0px 8px 0px 12px',
  display: 'flex',
  alignItems: 'center',
  height: '40px',
  minWidth: '139px',
  cursor: 'pointer',
  '&:hover': {
    background: '#eeeeee',
  },
}));

const NavItem = styled(Box)(({ theme, active }) => ({
  padding: '0px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  cursor: 'pointer',
  borderBottom: active ? '2px solid #EB6100' : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const NavItemIcon = styled(Box)(({ theme, active }) => ({
  color: active ? '#f16508' : '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  '& .MuiSvgIcon-root': {
    strokeWidth: '0.8',
  },
}));

const NavItemLabel = styled(Typography)(({ theme, active }) => ({
  color: active ? '#EB6100' : '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '32px',
  height: '32px',
  backgroundColor: '#fafafa',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 500,
}));

// TopRow Component
const TopRow = () => {
  const [portalAnchorEl, setPortalAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  const handlePortalClick = (event) => {
    setPortalAnchorEl(event.currentTarget);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setPortalAnchorEl(null);
    setLanguageAnchorEl(null);
  };

  return (
    <StyledTopRow>
      {/* Left side - Logo and Portal Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LogoContainer>
          <img style={{height:'100%'}} src={logo} alt="logo" />
        </LogoContainer>
        
        <PortalDropdown onClick={handlePortalClick}>
          <PortalLabel>EMEA</PortalLabel>
          <ArrowDropDown sx={{ color: '#000000', strokeWidth: '1.5' }} />
        </PortalDropdown>
        
        <Menu
          anchorEl={portalAnchorEl}
          open={Boolean(portalAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>KENDO China</MenuItem>
          <MenuItem onClick={handleClose}>Saame OEM - Bosch</MenuItem>
          <MenuItem onClick={handleClose}>Saame OEM - General</MenuItem>
        </Menu>
      </Box>

      {/* Right side - Actions, Language, Profile */}
      <ActionsContainer>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionIconButton>
            <DownloadOutlined />
          </ActionIconButton>
          <ActionIconButton>
            <ShareOutlined />
          </ActionIconButton>
          <ActionIconButton>
            <StickyNote2Outlined />
          </ActionIconButton>
        </Box>

        {/* Language Dropdown */}
        <LanguageDropdown onClick={handleLanguageClick}>
          <Language sx={{ color: '#000000', marginRight: '8px', strokeWidth: '1.5' }} />
          <PortalLabel>English</PortalLabel>
          <ArrowDropDown sx={{ color: '#000000', strokeWidth: '1.5' }} />
        </LanguageDropdown>
        
        <Menu
          anchorEl={languageAnchorEl}
          open={Boolean(languageAnchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>简体中文</MenuItem>
          <MenuItem onClick={handleClose}>العربية</MenuItem>
          <MenuItem onClick={handleClose}>Français</MenuItem>
          <MenuItem onClick={handleClose}>Pусский</MenuItem>
          <MenuItem onClick={handleClose}>Español</MenuItem>
          <MenuItem onClick={handleClose}>Deutsch</MenuItem>
          <MenuItem onClick={handleClose}>日本語</MenuItem>
          <MenuItem onClick={handleClose}>한국어</MenuItem>
          <MenuItem onClick={handleClose}>Tiếng Việt</MenuItem>
          <MenuItem onClick={handleClose}>ไทย</MenuItem>
          <MenuItem onClick={handleClose}>Bahasa indonesia</MenuItem>
        </Menu>

        {/* Profile Avatar */}
        <ProfileAvatar>S</ProfileAvatar>
      </ActionsContainer>
    </StyledTopRow>
  );
};

// NavBar Component
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Product Catalog');

  // 菜单项配置，包含路由路径
  const navItems = [
    { label: 'Home', icon: <span className="material-symbols-outlined">home</span>, key: 'Home', path: '/home' },
    { label: 'Brand Assets', icon: <span className="material-symbols-outlined">branding_watermark</span>, key: 'Brand Assets', path: '/brand-book' },
    { label: 'Video Library', icon: <span className="material-symbols-outlined">video_library</span>, key: 'Video Library', path: '/videos' },
    { label: 'Media Library', icon: <span className="material-symbols-outlined">photo_library</span>, key: 'Media Library', path: '/medias' },
    { label: 'New Products', icon: <span className="material-symbols-outlined">add_circle</span>, key: 'New Products', path: '/accessories' },
    { label: 'Product Catalog', icon: <span className="material-symbols-outlined">search</span>, key: 'Product Catalog', path: '/products' },
    { label: 'After Sales Service', icon: <span className="material-symbols-outlined">info</span>, key: 'After Sales Service', path: '/after-sales-service' },
  ];

  // 根据当前路径设置活动菜单项
  useEffect(() => {
    const currentPath = location.pathname;
    const currentNavItem = navItems.find(item => item.path === currentPath);
    if (currentNavItem) {
      setActiveItem(currentNavItem.key);
    }
  }, [location.pathname]);

  const handleNavItemClick = (key, path) => {
    setActiveItem(key);
    navigate(path);
  };

  return (
    <StyledNavBar>
      {navItems.map((item) => (
        <NavItem
          key={item.key}
          active={activeItem === item.key}
          onClick={() => handleNavItemClick(item.key, item.path)}
        >
          <NavItemIcon active={activeItem === item.key}>
            {item.icon}
          </NavItemIcon>
          <NavItemLabel active={activeItem === item.key}>
            {item.label}
          </NavItemLabel>
        </NavItem>
      ))}
    </StyledNavBar>
  );
};

// Main TopBar Component
function TopBar() {
  return (
    <StyledTopBar>
      <TopRow />
      <NavBar />
    </StyledTopBar>
  );
}

export default TopBar;
export { NavBar, TopRow };

