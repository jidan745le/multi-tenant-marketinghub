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
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/icon/kendo.png';
import { useBrand } from '../hooks/useBrand';
import { useLanguage } from '../hooks/useLanguage';

// Styled Components
const StyledTopBar = styled(Box)(() => ({
  background: '#333333',
  padding: '24px 24px 0px 24px',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
}));

const StyledTopRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '24px',
}));

const StyledNavBar = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: '12px',
}));

const LogoContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '32px',
  marginRight: '12px',
}));

// 使用主题的动态颜色的LogoText
const LogoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main, // 使用主题的主色调
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
}));

const PortalDropdown = styled(Box)(() => ({
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

const PortalLabel = styled(Typography)(() => ({
  color: '#000000',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  marginRight: '8px',
}));

const ActionsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

// 更新ActionIconButton以使用主题颜色
const ActionIconButton = styled(IconButton)(() => ({
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

const LanguageDropdown = styled(Box)(() => ({
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

// 更新NavItemIcon和NavItemLabel以使用主题颜色
const NavItem = styled(Box)(({ theme, active }) => ({
  padding: '0px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  cursor: 'pointer',
  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const NavItemIcon = styled(Box)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : '#ffffff',
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
  color: active ? theme.palette.primary.main : '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
}));

const ProfileAvatar = styled(Avatar)(() => ({
  width: '32px',
  height: '32px',
  backgroundColor: '#fafafa',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 500,
}));

// NavBar Component
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { currentBrand } = useBrand();
  const [activeItem, setActiveItem] = useState('Product Catalog');

  // 菜单项配置，包含路由路径和翻译键
  const navItems = [
    { 
      label: t('nav.home'), 
      icon: <span className="material-symbols-outlined">home</span>, 
      key: 'Home', 
      path: `/${currentLanguage}/${currentBrand}/home` 
    },
    { 
      label: t('nav.brand.assets'), 
      icon: <span className="material-symbols-outlined">branding_watermark</span>, 
      key: 'Brand Assets', 
      path: `/${currentLanguage}/${currentBrand}/brand-book` 
    },
    { 
      label: t('nav.video.library'), 
      icon: <span className="material-symbols-outlined">video_library</span>, 
      key: 'Video Library', 
      path: `/${currentLanguage}/${currentBrand}/videos` 
    },
    { 
      label: t('nav.media.library'), 
      icon: <span className="material-symbols-outlined">photo_library</span>, 
      key: 'Media Library', 
      path: `/${currentLanguage}/${currentBrand}/medias` 
    },
    { 
      label: t('nav.new.products'), 
      icon: <span className="material-symbols-outlined">add_circle</span>, 
      key: 'New Products', 
      path: `/${currentLanguage}/${currentBrand}/accessories` 
    },
    { 
      label: t('nav.product.catalog'), 
      icon: <span className="material-symbols-outlined">search</span>, 
      key: 'Product Catalog', 
      path: `/${currentLanguage}/${currentBrand}/products` 
    },
    { 
      label: t('nav.after.sales.service'), 
      icon: <span className="material-symbols-outlined">info</span>, 
      key: 'After Sales Service', 
      path: `/${currentLanguage}/${currentBrand}/after-sales-service` 
    },
  ];

  // 根据当前路径设置活动菜单项
  useEffect(() => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/');
    const page = pathSegments[3]; // /:lang/:brand/:page
    
    // 根据页面路径匹配菜单项
    const pageToKey = {
      'home': 'Home',
      'brand-book': 'Brand Assets',
      'videos': 'Video Library',
      'medias': 'Media Library',
      'accessories': 'New Products',
      'products': 'Product Catalog',
      'after-sales-service': 'After Sales Service',
    };
    
    const newActiveItem = pageToKey[page] || 'Product Catalog';
    setActiveItem(newActiveItem);
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
          active={activeItem === item.key ? 1 : 0}
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

// TopRow Component with Language and Brand Switching
const TopRow = () => {
  const { t } = useTranslation();
  const { supportedLanguages, currentLanguage, changeLanguage, getCurrentLanguageInfo } = useLanguage();
  const { supportedBrands, currentBrand, changeBrand, getCurrentBrandInfo } = useBrand();
  
  console.log('TopRow: currentBrand =', currentBrand);
  console.log('TopRow: supportedBrands =', supportedBrands);
  
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

  const handleBrandSelect = (brandCode) => {
    changeBrand(brandCode);
    handleClose();
  };

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    handleClose();
  };

  const currentLanguageInfo = getCurrentLanguageInfo();
  const currentBrandInfo = getCurrentBrandInfo();

  return (
    <StyledTopRow>
      {/* Left side - Logo and Portal Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LogoContainer>
          <img style={{height:'100%'}} src={logo} alt="logo" />
        </LogoContainer>
        
        <PortalDropdown onClick={handlePortalClick}>
          <PortalLabel>{currentBrandInfo?.displayName || 'Loading...'}</PortalLabel>
          <ArrowDropDown sx={{ color: '#000000', strokeWidth: '1.5' }} />
        </PortalDropdown>
        
        <Menu
          anchorEl={portalAnchorEl}
          open={Boolean(portalAnchorEl)}
          onClose={handleClose}
        >
          {supportedBrands.map((brand) => (
            <MenuItem 
              key={brand.code} 
              onClick={() => handleBrandSelect(brand.code)}
              selected={brand.code === currentBrand}
            >
              {brand.displayName}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Right side - Actions, Language, Profile */}
      <ActionsContainer>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionIconButton title={t('topbar.download')}>
            <DownloadOutlined />
          </ActionIconButton>
          <ActionIconButton title={t('topbar.share')}>
            <ShareOutlined />
          </ActionIconButton>
          <ActionIconButton title={t('topbar.notes')}>
            <StickyNote2Outlined />
          </ActionIconButton>
        </Box>

        {/* Language Dropdown */}
        <LanguageDropdown onClick={handleLanguageClick}>
          <Language sx={{ color: '#000000', marginRight: '8px', strokeWidth: '1.5' }} />
          <PortalLabel>{currentLanguageInfo.nativeName}</PortalLabel>
          <ArrowDropDown sx={{ color: '#000000', strokeWidth: '1.5' }} />
        </LanguageDropdown>
        
        <Menu
          anchorEl={languageAnchorEl}
          open={Boolean(languageAnchorEl)}
          onClose={handleClose}
        >
          {supportedLanguages.map((language) => (
            <MenuItem 
              key={language.code} 
              onClick={() => handleLanguageSelect(language.code)}
              selected={language.code === currentLanguage}
            >
              {language.nativeName}
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Avatar */}
        <ProfileAvatar>S</ProfileAvatar>
      </ActionsContainer>
    </StyledTopRow>
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

