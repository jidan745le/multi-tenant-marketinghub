import {
  ArrowDropDown,
  Language
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../hooks/useBrand';
import { useDynamicMenus } from '../hooks/useDynamicMenus';
import { useLanguage } from '../hooks/useLanguage';
import { getColorFilter } from '../utils/colorFilter';

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

const NavItemIcon = styled(Box)(({ theme, active }) => {
  const primaryColor = theme.palette.primary.main || '#f16508';
  
  return {
    color: active ? primaryColor : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    '& .MuiSvgIcon-root': {
      strokeWidth: '0.8',
    },
    '& img': {
      filter: active 
        ? getColorFilter(primaryColor) 
        : 'brightness(0) invert(1)', // 白色滤镜
      transition: 'filter 0.2s ease',
    },
  };
});

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

// 占位符样式
const PlaceholderNavItem = styled(Box)(() => ({
  padding: '0px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  borderBottom: '2px solid transparent',
}));

const PlaceholderIcon = styled(Box)(() => ({
  width: '24px',
  height: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  animation: 'pulse 1.5s ease-in-out infinite',
}));

const PlaceholderText = styled(Box)(({ width = '80px' }) => ({
  width: width,
  height: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  animation: 'pulse 1.5s ease-in-out infinite',
}));

// 全局动画定义
const GlobalStyles = styled('div')(() => ({
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

// NavBar Component
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItems, debug } = useDynamicMenus();
  const [activeItem, setActiveItem] = useState(''); // 使用API key格式
  const { t } = useTranslation();


  // 根据当前路径设置活动项
  useEffect(() => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/'); 
    // 路径格式: /:lang/:brand/:page
    const currentPage = pathSegments[3]; // 当前页面部分

    if (!currentPage || menuItems.length === 0) {
      // 如果没有页面或菜单还没加载，默认选中第一个菜单项
      if (menuItems.length > 0) {
        setActiveItem(menuItems[0].key);
      }
      return;
    }

    // 动态匹配：根据API菜单数据的path字段查找匹配的菜单项
    const matchedMenuItem = menuItems.find(item => {
      // 提取菜单项路径的页面部分进行匹配
      // item.path 格式: /:lang/:brand/page
      const menuPathSegments = item.path.split('/');
      const menuPage = menuPathSegments[menuPathSegments.length - 1]; // 获取最后一部分
      return menuPage === currentPage;
    });

    const activeKey = matchedMenuItem ? matchedMenuItem.key : (menuItems[0]?.key || 'home');  
    
    setActiveItem(activeKey);
  }, [location.pathname, menuItems]); // 添加menuItems依赖

  // 处理菜单项标签的翻译 (目前未使用，但保留以备将来使用)
  // const translateMenuLabel = (item) => {
  //   if (!item || !item.label) return '';
  //   
  //   // 检查标签是否是翻译键（如 'nav.home'）
  //   if (item.label.includes('.')) {
  //     // 尝试翻译
  //     const translated = t(item.label);
  //     // 如果翻译返回的与输入相同，可能表示没有翻译，直接使用标签值
  //     return translated !== item.label ? translated : item.label;
  //   }
  //   
  //   // 不是翻译键，直接返回原始标签
  //   return item.label;
  // };

  const handleNavItemClick = (itemKey, path) => {
    setActiveItem(itemKey);
    navigate(path);
  };

  return (
    <StyledNavBar>
      <GlobalStyles />
      {menuItems.length === 0 ? (
        <>
          <PlaceholderNavItem>
            <PlaceholderIcon />
            <PlaceholderText width="60px" />
          </PlaceholderNavItem>
          <PlaceholderNavItem>
            <PlaceholderIcon />
            <PlaceholderText width="100px" />
          </PlaceholderNavItem>
          <PlaceholderNavItem>
            <PlaceholderIcon />
            <PlaceholderText width="80px" />
          </PlaceholderNavItem>
          <PlaceholderNavItem>
            <PlaceholderIcon />
            <PlaceholderText width="120px" />
          </PlaceholderNavItem>
        </>
      ) : (
        menuItems.map((item) => {
          const isActive = activeItem === item.key;
          return <NavItem
            key={item.key}
            active={isActive ? 1 : 0}
            onClick={() => handleNavItemClick(item.key, item.path)}
          >
            <NavItemIcon active={isActive ? 1 : 0}>
              {item.icon}
            </NavItemIcon>
            <NavItemLabel active={isActive ? 1 : 0}>
              {t(item.label)}
            </NavItemLabel>
          </NavItem>
        })
      )}
    </StyledNavBar>
  );
};

// TopRow Component with Language and Brand Switching
const TopRow = () => {
  const { t: translate } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const {supportedLanguages,getCurrentLanguageInfo,currentLanguage, changeLanguage} = useLanguage();
  const { brands, currentBrand, switchBrand, debug } = useBrand();  
  const currentLanguageInfo = getCurrentLanguageInfo();
  const [portalAnchorEl, setPortalAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 直接从localStorage读取user_info检查admin角色（使用useMemo确保值稳定）
  const hasAdminRole = useMemo(() => {
    try {
      // 尝试多个可能的key名称
      const userInfoStr = localStorage.getItem('user_info') || localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const roles = userInfo?.roles || [];
        
        // 检查是否有admin角色（不区分大小写）
        const hasAdmin = roles.some(role => {
          if (typeof role === 'string') {
            return role.toLowerCase().includes('admin');
          }
          if (typeof role === 'object' && role !== null) {
            const roleName = role.name || role.code || role.role || role.id || '';
            return String(roleName).toLowerCase().includes('admin');
          }
          return false;
        });
        
        return hasAdmin;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, [isAuthenticated, user]); // 当认证状态或用户变化时重新计算

  const handlePortalClick = (event) => {
    setPortalAnchorEl(event.currentTarget);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setPortalAnchorEl(null);
    setLanguageAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleLegalTermsClick = () => {
    const pathSegments = location.pathname.split('/');
    const lang = pathSegments[1] || 'en_GB';
    const brand = pathSegments[2] || 'kendo';
    navigate(`/${lang}/${brand}/legal-terms`);
    handleClose();
  };

  const handlePrivacyPolicyClick = () => {
    const pathSegments = location.pathname.split('/');
    const lang = pathSegments[1] || 'en_GB';
    const brand = pathSegments[2] || 'kendo';
    navigate(`/${lang}/${brand}/legal-privacy`);
    handleClose();
  };

  const handleBrandSelect = (brandCode) => {
    switchBrand(brandCode);
    handleClose();
  };

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    handleClose();
  };

  return (
    <StyledTopRow>
      {/* Left side - Logo and Portal Selection */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LogoContainer>
          {currentBrand?.strapiData?.theme_logo?.url ? <img 
            style={{height:'100%'}} 
            src={
              currentBrand?.strapiData?.theme_logo?.url 
                ? `${import.meta.env.VITE_STRAPI_BASE_URL}${currentBrand.strapiData.theme_logo.url}`
                : '' // 回退到静态logo
            }
            alt={`${currentBrand?.displayName || 'Brand'} logo`}

          />:null}
        </LogoContainer>
        
        <PortalDropdown onClick={handlePortalClick}>
          {currentBrand?.displayName ? (
            <PortalLabel>
              {currentBrand.displayName}
              {debug.isLoading && (
                <CircularProgress 
                  size={14} 
                  sx={{ 
                    ml: 1,
                    color: '#666666'
                  }} 
                />
              )}
            </PortalLabel>
          ) : (
            <CircularProgress 
              size={16} 
              sx={{ 
                color: '#666666'
              }} 
            />
          )}
          <ArrowDropDown sx={{ color: '#000000', strokeWidth: '1.5' }} />
        </PortalDropdown>
        
        <Menu
          anchorEl={portalAnchorEl}
          open={Boolean(portalAnchorEl)}
          onClose={handleClose}
        >
          {brands.map((brand) => (
            <MenuItem 
              key={brand.code} 
              onClick={() => handleBrandSelect(brand.code)}
              selected={brand.code === currentBrand?.code}
            >
              {brand.displayName}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Right side - Actions, Language, Profile */}
      <ActionsContainer>
        {/* Action Buttons */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionIconButton title={translate('topbar.download')}>
            <DownloadOutlined />
          </ActionIconButton>
          <ActionIconButton title={translate('topbar.share')}>
            <ShareOutlined />
          </ActionIconButton>
          <ActionIconButton title={translate('topbar.notes')}>
            <StickyNote2Outlined />
          </ActionIconButton>
        </Box> */}

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

        {/* Profile Avatar with Dropdown */}
        {isAuthenticated && user && (
          <>
            <ProfileAvatar onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </ProfileAvatar>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                '& .MuiPaper-root': {
                  width: '240px',
                  borderRadius: '4px',
                  border: '1px solid #bfbfbf',
                  boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
                  padding: 0,
                },
                '& .MuiList-root': {
                  padding: 0,
                },
              }}
            >
              {/* Header with ADMIN label - 只在有admin角色时显示 */}
              <Box sx={{ 
                padding: '16px 12px 12px 12px',
                borderBottom: '1px solid #e0e0e0',
                position: 'relative',
              }}>
                {hasAdminRole && (
                  <Typography sx={{ 
                    color: '#1e1e1e',
                    fontFamily: '"Lato-Bold", sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    lineHeight: '140%',
                    marginBottom: '12px',
                  }}>
                    ADMIN
                  </Typography>
                )}
                
                {/* User Info Row */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <ProfileAvatar sx={{ 
                    width: '40px', 
                    height: '40px',
                    fontSize: '16px',
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </ProfileAvatar>
                  <Box>
                    <Typography sx={{ 
                      color: '#1e1e1e',
                      fontFamily: '"OpenSans-Regular", sans-serif',
                      fontSize: '14px',
                      lineHeight: '140%',
                      fontWeight: 400,
                    }}>
                      {user.name || user.email.split('@')[0]}
                    </Typography>
                    <Typography sx={{ 
                      color: '#858585',
                      fontFamily: '"HelveticaNeue-Regular", sans-serif',
                      fontSize: '12px',
                      lineHeight: '140%',
                      fontWeight: 400,
                    }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Menu Items */}
              <MenuItem 
                onClick={handleLegalTermsClick}
                sx={{ 
                  padding: '0px 12px',
                  height: '44px',
                  borderRadius: '4px',
                  margin: '4px',
                  gap: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
        
                <Typography sx={{
                  color: '#000000',
                  fontFamily: '"Roboto-Medium", sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  fontWeight: 500,
                  flex: 1,
                }}>
                  {translate('profile.legalTerms')}
                </Typography>
              </MenuItem>

              <MenuItem 
                onClick={handlePrivacyPolicyClick}
                sx={{ 
                  padding: '0px 12px',
                  height: '44px',
                  borderRadius: '4px',
                  margin: '4px',
                  gap: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >    
                <Typography sx={{
                  color: '#000000',
                  fontFamily: '"Roboto-Medium", sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  fontWeight: 500,
                  flex: 1,
                }}>
                  {translate('profile.privacyPolicy')}
                </Typography>
              </MenuItem>

              {/* Admin入口 - 只在有admin角色时显示 */}
              {hasAdminRole && (
                <MenuItem 
                  onClick={() => {
                    const pathSegments = location.pathname.split('/').filter(Boolean);
                    const lang = pathSegments[0] || 'en_GB';
                    const brand = pathSegments[1] || 'kendo';
                    navigate(`/${lang}/${brand}/admin`);
                    handleClose();
                  }}
                  sx={{ 
                    padding: '0px 12px',
                    height: '44px',
                    borderRadius: '4px',
                    margin: '4px',
                    gap: '12px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography sx={{
                    color: '#000000',
                    fontFamily: '"Roboto-Medium", sans-serif',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.1px',
                    fontWeight: 500,
                    flex: 1,
                  }}>
                    Admin Management
                  </Typography>
                </MenuItem>
              )}

              {/* Separator line before logout */}
              <Box sx={{ 
                height: '1px', 
                backgroundColor: '#e0e0e0', 
                margin: '4px 0' 
              }} />

              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  padding: '0px 12px',
                  height: '44px',
                  borderRadius: '4px',
                  margin: '4px',
                  gap: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
        
                <Typography sx={{
                  color: '#000000',
                  fontFamily: '"Roboto-Medium", sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  fontWeight: 500,
                  flex: 1,
                }}>
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )}
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

