import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { selectThemesLoading } from '../store/slices/themesSlice';

// Styled Components
const AdminSidebar = styled(Box)(() => ({
  width: 231,
  flexShrink: 0,
  borderRight: '1px solid #e0e0e0',
  backgroundColor: '#fff',
  height: '100%',
  overflowY: 'auto',
}));

const ContentArea = styled(Box)(() => ({
  flexGrow: 1,
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#f5f5f5',
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
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  width: 216,
}));

const MenuItemHeading = styled(ListItem)(({ theme, active }) => ({
  borderRadius: 4,
  padding: '0px 12px',
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 44,
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
  color: active ? 'var(--colors-palettes-primary-primary60, #f16508)' : 'var(--black, #000000)',
  textAlign: 'center',
  fontFamily: '"Material Symbols Outlined"',
  fontSize: 24,
  fontWeight: 400,
  fontVariationSettings: '"FILL" 0, "wght" 200, "GRAD" 0, "opsz" 24',
}));

const MenuItemLabel = styled(ListItemText)(({ theme, active }) => ({
  flex: 1,
  '& .MuiListItemText-primary': {
    color: active ? 'var(--colors-palettes-primary-primary60, #f16508)' : 'var(--black, #000000)',
    textAlign: 'left',
    fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)',
    fontSize: 'var(--label-large-font-size, 14px)',
    lineHeight: 'var(--label-large-line-height, 20px)',
    letterSpacing: 'var(--label-large-letter-spacing, 0.1px)',
    fontWeight: 'var(--label-large-font-weight, 500)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

// Admin menu items configuration
const adminMenuItems = [
  { id: 'look-feel', label: 'Look & Feel', iconName: 'palette' },
  { id: 'theme-general-settings', label: 'Theme General Settings', iconName: 'settings' },
  { id: 'theme-configuration', label: 'Theme Configuration', iconName: 'Design_Services' },
  { id: 'derivate-management', label: 'Derivate Management', iconName: 'imagesmode' },
  { id: 'legal', label: 'Legal', iconName: 'contract' },
  { id: 'communication-email', label: 'Communication & Email', iconName: 'email' },
  { id: 'data-sheet-config', label: 'Data Sheet Config', iconName: 'bar_chart' },
  { id: 'mass-download', label: 'Mass Download', iconName: 'download_2' },
  { id: 'social-profile', label: 'Social Profile', iconName: 'public' },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectThemesLoading);

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
      const foundItem = adminMenuItems.find(item => item.id === lastSegment);
      if (foundItem) {
        setActiveMenuItem(lastSegment);
      }
      // 对于 under-construction 或其他情况，保持当前的 activeMenuItem 不变
    }
  }, [location.pathname]);

  // 处理菜单项点击
  const handleMenuItemClick = (menuId) => {
    // 直接设置活跃菜单项
    setActiveMenuItem(menuId);
    // 导航到对应路由
    navigate(menuId, { replace: true });
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
          {adminMenuItems.map(item => {
            const isActive = activeMenuItem === item.id;
            return (
              <MenuItemContainer key={item.id}>
                <MenuItemHeading
                  active={isActive}
                  onClick={() => handleMenuItemClick(item.id)}
                  disablePadding
                >
                  <MenuItemIconContainer>
                    <MenuItemIconText 
                      active={isActive}
                      className="material-symbols-outlined"
                    >
                      {item.iconName}
                    </MenuItemIconText>
                  </MenuItemIconContainer>
                  <MenuItemLabel 
                    active={isActive}
                    primary={item.label}
                  />
                </MenuItemHeading>
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