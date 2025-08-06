import ColorLensIcon from '@mui/icons-material/ColorLens';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import SettingsIcon from '@mui/icons-material/Settings';
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

// 样式化组件
const AdminSidebar = styled(Box)(() => ({
  width: 220,
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

const SidebarMenuItem = styled(ListItem)(({ theme, active }) => ({
  padding: '8px 16px',
  cursor: 'pointer',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

// 管理后台菜单项
const menuItems = [
  { id: 'look-feel', label: 'Look & Feel', icon: <FavoriteIcon /> },
  { id: 'theme-general-settings', label: 'Theme General Settings', icon: <SettingsIcon /> },
  { id: 'theme-configuration', label: 'Theme Configuration', icon: <ColorLensIcon /> },
  { id: 'legal', label: 'Legal', icon: <FeaturedPlayListIcon /> },
  { id: 'communication-email', label: 'Communication & Email', icon: <FeaturedPlayListIcon /> },
  { id: 'social-profile', label: 'Social Profile', icon: <FeaturedPlayListIcon /> },
  { id: 'derivate-management', label: 'Derivate Management', icon: <FeaturedPlayListIcon /> },
  { id: 'data-sheet-config', label: 'Data Sheet Config', icon: <FeaturedPlayListIcon /> },
  { id: 'mass-download', label: 'Mass Download', icon: <FeaturedPlayListIcon /> },
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
    const foundItem = menuItems.find(item => item.id === lastSegment);
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
      const foundItem = menuItems.find(item => item.id === lastSegment);
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
      {/* 左侧边栏 */}
      <AdminSidebar>
        <List component="nav">
          {menuItems.map(item => (
            <SidebarMenuItem
              key={item.id}
              active={activeMenuItem === item.id}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemText primary={item.label} />
            </SidebarMenuItem>
          ))}
        </List>
      </AdminSidebar>

      {/* 主内容区域 - 渲染子路由 */}
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Box>
  );
}

export default AdminLayout; 