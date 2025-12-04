import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectUserRoles } from '../store/slices/userSlice';
import CookieService from '../utils/cookieService';
import ProtectedRoute from './ProtectedRoute';

/**
 * AdminRoute - 保护admin管理页面，只允许admin角色访问
 * 检查用户角色（从localStorage或Redux store）
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  
  // 从Redux store获取用户角色
  const reduxRoles = useSelector(selectUserRoles);
  
  // 从localStorage获取完整用户信息中的角色（优先使用完整信息）
  const fullUserInfo = CookieService.getFullUserInfo();
  const basicUserInfo = CookieService.getUserInfo();
  const localStorageRoles = fullUserInfo?.roles || basicUserInfo?.roles || [];
  
  // 合并所有角色来源，去重
  const allRoles = [...new Set([...reduxRoles, ...localStorageRoles])];
  
  // 检查是否有admin角色（不区分大小写）
  const hasAdminRole = allRoles.some(role => {
    if (typeof role === 'string') {
      return role.toLowerCase().includes('admin');
    }
    // 如果role是对象，检查name或code字段
    if (typeof role === 'object' && role !== null) {
      const roleName = role.name || role.code || role.role || role.id || '';
      return String(roleName).toLowerCase().includes('admin');
    }
    return false;
  });
  
  console.log('🔒 AdminRoute 检查:', {
    reduxRoles,
    localStorageRoles,
    allRoles,
    hasAdminRole,
    currentPath: location.pathname
  });
  
  // 如果没有admin角色，重定向到默认页面
  if (!hasAdminRole) {
    console.log('❌ 用户没有admin角色，重定向到默认页面');
    
    // 尝试从localStorage获取默认重定向路径
    const defaultRedirect = localStorage.getItem('mh_default_redirect') || '/en/kendo/category';
    
    // 或者从当前路径构建非admin路径
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let redirectPath = defaultRedirect;
    
    if (pathSegments.length >= 2) {
      // 格式: /:lang/:brand/admin/...
      const lang = pathSegments[0];
      const brand = pathSegments[1];
      redirectPath = `/${lang}/${brand}/category`;
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // 有admin角色，先通过ProtectedRoute检查认证，然后渲染子组件
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AdminRoute;

