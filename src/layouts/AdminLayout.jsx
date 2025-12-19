import {
  Box,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { selectThemesLoading } from '../store/slices/themesSlice';
import SmallTriangleIcon from '../components/SmallTriangleIcon';

// Styled Components
const AdminSidebar = styled(Box)(({ theme }) => ({
  width: 265,
  flexShrink: 0,
  borderRight: `1px solid ${theme.palette.divider || '#e0e0e0'}`,
  backgroundColor: theme.palette.background.paper || '#fff',
  height: '100%',
  overflowY: 'auto',
  scrollbarWidth: 'none', 
  '&::-webkit-scrollbar': {
    display: 'none', 
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.default || '#f5f5f5',
}));

const NavigationList = styled(List)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '24px 8px',
}));

const MenuItemContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
}));

const MenuItemHeading = styled(ListItem)(({ theme }) => ({
  borderRadius: 4,
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 44,
  width: '100%',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const MenuItemIconContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  position: 'relative',
}));

const MenuItemIconText = styled('span')(({ theme, active }) => ({
  color: active ? (theme.palette.primary.main ) : (theme.palette.text.primary || '#000000'),
  textAlign: 'center',
  fontFamily: '"Material Symbols Outlined"',
  fontSize: 24,
  fontWeight: 400,
  fontVariationSettings: '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 24',
}));

const MenuItemLabel = styled(ListItemText)(({ theme, active }) => ({
  flex: 1,
  minWidth: 0,
  '& .MuiListItemText-primary': {
    color: active ? (theme.palette.primary.main) : (theme.palette.text.primary || '#000000'),
    textAlign: 'left',
    fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
    fontSize: 'var(--label-large-font-size, 14px)',
    lineHeight: 'var(--label-large-line-height, 20px)',
    letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
    fontWeight: 'var(--label-large-font-weight, 500)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const SubMenuContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  paddingLeft: 36,
  width: '100%',
  alignSelf: 'flex-start',
}));

const SubMenuItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 4,
  padding: '8px 12px',
  marginLeft: -12,
  marginRight: 36,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 40,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
  },
}));

const SubMenuItemLabel = styled(ListItemText)(({ theme, active }) => ({
  '& .MuiListItemText-primary': {
    color: active ? (theme.palette.primary.main) : (theme.palette.text.primary || '#000000'),
    textAlign: 'left',
    fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
    fontSize: 'var(--label-large-font-size, 14px)',
    lineHeight: 'var(--label-large-line-height, 20px)',
    letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
    fontWeight: 'var(--label-large-font-weight, 500)',
  },
}));

// Admin menu items configuration
const adminMenuItems = [
  { id: 'look-feel', label: 'Look & Feel', iconName: 'palette' },
  { id: 'theme-general-settings', label: 'Theme General Settings', iconName: 'settings' },
  { id: 'theme-configuration', label: 'Theme Configuration', iconName: 'Design_Services' },
  { id: 'derivate-management', label: 'Derivate Management', iconName: 'imagesmode' },
  { id: 'channel-management', label: 'Channel Management', iconImage: '/assets/SymbolsIcon.png', isSpecial: true },
  { id: 'legal', label: 'Legal', iconName: 'contract' },
  { id: 'communication-email', label: 'Communication & Email', iconName: 'email' },
  { 
    id: 'publications', 
    label: 'Publications', 
    iconName: 'list',
    hasSubMenu: true,
    subMenu: [
      { id: 'template-marketplace', label: 'Template Marketplace' },
      { id: 'my-publications', label: 'My Publications' },
      { id: 'tenant-admin', label: 'Manage Publications' },
      { id: 'super-admin', label: 'Manage Publications (Global)' }
    ]
  },
  { id: 'data-sheet-config', label: 'Data Sheet Config', iconName: 'bar_chart' },
  { id: 'mass-download', label: 'Mass Download', iconName: 'download_2' },
  { id: 'social-profile', label: 'Social Profile', iconName: 'public' },
  { id: 'user-management', label: 'User Management', iconName: 'group' },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectThemesLoading);
  const theme = useTheme();

  // 初始化时从URL路径中确定活跃的菜单项
  const getInitialActiveMenuItem = () => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 如果路径以 /admin 结尾，默认显示 look-feel
    if (lastSegment === 'admin') {
      return 'look-feel';
    }
    
    // 检查是否是已知的菜单项
    const foundItem = adminMenuItems.find(item => item.id === lastSegment);
    return foundItem ? lastSegment : 'look-feel';
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getInitialActiveMenuItem);
  const [expandedMenus, setExpandedMenus] = useState({});

  // 监听路径变化，仅在确实需要时更新活跃菜单项
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 只在以下情况更新 activeMenuItem：
    // 1. 路径匹配已知菜单项（直接访问URL）
    // 2. 路径是 /admin（初始加载）
    if (lastSegment === 'admin') {
      setActiveMenuItem('look-feel');
    } else {
      // 检查是否是主菜单项
      const foundItem = adminMenuItems.find(item => item.id === lastSegment);
      if (foundItem) {
        setActiveMenuItem(lastSegment);
      } else {
        // 检查是否是子菜单项
        for (const item of adminMenuItems) {
          if (item.subMenu) {
            const foundSubItem = item.subMenu.find(subItem => subItem.id === lastSegment);
            if (foundSubItem) {
              setActiveMenuItem(lastSegment);
              setExpandedMenus(prev => ({ ...prev, [item.id]: true }));
              break;
            }
          }
        }
      }
      // 对于 under-construction 或其他情况，保持当前的 activeMenuItem 不变
    }
  }, [location.pathname]);

  // 处理菜单项点击
  const handleMenuItemClick = (menuId, hasSubMenu = false) => {
    if (hasSubMenu) {
      // 切换展开/折叠状态
      setExpandedMenus(prev => ({
        ...prev,
        [menuId]: !prev[menuId]
      }));
    } else {
      // 直接设置活跃菜单项
      setActiveMenuItem(menuId);
      // 导航到对应路由
      navigate(menuId, { replace: true });
    }
  };

  // 处理子菜单项点击
  const handleSubMenuItemClick = (subMenuId) => {
    setActiveMenuItem(subMenuId);
    navigate(subMenuId, { replace: true });
  };

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );  
  }

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Admin Sidebar */}
      <AdminSidebar>
        <NavigationList component="nav">
          {adminMenuItems.filter(item => item.id !== 'data-sheet-config').map(item => {
            const isActive = activeMenuItem === item.id;
            const isExpanded = expandedMenus[item.id] || false;
            const hasSubMenu = item.hasSubMenu && item.subMenu;
            
            return (
              <MenuItemContainer key={item.id}>
                <MenuItemHeading
                  onClick={() => handleMenuItemClick(item.id, hasSubMenu)}
                  disablePadding
                  sx={item.isSpecial ? {
                    '& .MuiListItemText-primary': {
                      color: (isActive && !hasSubMenu)
                        ? (theme) => theme.palette.primary.main
                        : (theme) => theme.palette.text.primary || '#000000',
                    },
                    '& .material-symbols-outlined': {
                      color: (isActive && !hasSubMenu)
                        ? (theme) => theme.palette.primary.main
                        : (theme) => theme.palette.text.primary || '#000000',
                    }
                  } : {}}
                >
                  <MenuItemIconContainer>
                    {item.iconImage ? (
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          maskImage: `url(${item.iconImage})`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          backgroundColor: (isActive && !hasSubMenu)
                            ? (theme) => theme.palette.primary.main
                            : (theme) => theme.palette.text.primary || '#000000',
                        }}
                      />
                    ) : (
                      <MenuItemIconText 
                        active={isActive && !hasSubMenu}
                        className="material-symbols-outlined"
                      >
                        {item.iconName}
                      </MenuItemIconText>
                    )}
                  </MenuItemIconContainer>
                  <MenuItemLabel 
                    active={isActive && !hasSubMenu}
                    primary={item.label}
                  />
                  {hasSubMenu && (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: '8px' }}>
                      <SmallTriangleIcon 
                        expanded={isExpanded} 
                        color={theme.palette.text.primary || '#000000'} 
                      />
                    </Box>
                  )}
                </MenuItemHeading>
                {hasSubMenu && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <SubMenuContainer>
                      {item.subMenu.map(subItem => {
                        const isSubActive = activeMenuItem === subItem.id;
                        return (
                          <SubMenuItem
                            key={subItem.id}
                            onClick={() => handleSubMenuItemClick(subItem.id)}
                            disablePadding
                          >
                            <SubMenuItemLabel 
                              active={isSubActive}
                              primary={subItem.label}
                            />
                          </SubMenuItem>
                        );
                      })}
                    </SubMenuContainer>
                  </Collapse>
                )}
              </MenuItemContainer>
            );
          })}
        </NavigationList>
      </AdminSidebar>

      {/* Main Content Area - Render child routes */}
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Box>
  );
}

export default AdminLayout; 