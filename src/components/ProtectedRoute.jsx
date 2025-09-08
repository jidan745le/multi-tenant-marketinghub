import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const location = useLocation();
  
  console.log('🔒 ProtectedRoute 检查:', {
    isAuthenticated,
    loading,
    hasUser: !!user,
    userEmail: user?.email || 'no user',
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'no token',
    currentPath: location.pathname,
    timestamp: new Date().toISOString()
  });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    // 检查是否是logout过程中，如果是则不进行重定向
    const isLogoutInProgress = sessionStorage.getItem('logout_in_progress');
    if (isLogoutInProgress) {
      console.log('🔄 ProtectedRoute: Logout in progress, skipping redirect');
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Redirecting...
        </div>
      );
    }
    // Determine the tenant, theme and locale from the current path
    // Expected path format: /:lang/:brand/:page or /:tenantName/Login
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Try to extract tenant, theme and locale from current path
    let tenantName, currentTheme, locale;
    
    if (pathSegments.length >= 2) {
      // Format: /:lang/:brand/:page
      locale = pathSegments[0] || 'en';
      currentTheme = pathSegments[1] || 'kendo'; // brand作为theme
      // tenantName通常是大写，可以通过localStorage或从brand推断
      try {
        const storedTenant = localStorage.getItem('mh_tenant');
        if (storedTenant) {
          const parsed = JSON.parse(storedTenant);
          tenantName = parsed.tenant || 'Kendo';

        } else {
          tenantName = 'Kendo';
        }
      } catch {
        tenantName = pathSegments[1]?.toUpperCase() || 'Kendo';
      }
    } else {
      // Fallback: use first segment as tenant or default
      tenantName = pathSegments[0] || 'Kendo';
      currentTheme = pathSegments[0]?.toLowerCase() || 'kendo';
      locale = 'en';
    }
    
    // Create return URL to redirect back after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    
    // Build correct login URL format: /:tenantName/Login?theme=${currentTheme}&locale=${locale}&returnUrl=...
    return <Navigate to={`/${tenantName}/Login?theme=${currentTheme}&locale=${locale}&returnUrl=${returnUrl}`} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
