import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/**
 * AdminRoute - 保护admin管理页面，只允许admin角色访问
 * 直接从localStorage读取user_info检查角色
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  
  // 直接从localStorage读取user_info检查admin角色
  let hasAdminRole = false;
  
  try {
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      const roles = userInfo?.roles || [];
      
      // 检查是否有admin角色（不区分大小写）
      hasAdminRole = roles.some(role => {
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
    }
  } catch (error) {
    // 静默处理错误
  }
  
  // 如果没有admin角色，重定向到默认页面
  if (!hasAdminRole) {
    
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

