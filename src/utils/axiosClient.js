// 新功能使用 axios，旧代码继续使用 fetch/apiClient
import axios from 'axios';
import CookieService from './cookieService';

// axios实例（用于 /apis 接口）
export const axiosInstance = axios.create({
  baseURL: '/apis',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 统一添加 token
axiosInstance.interceptors.request.use((config) => {
  const token = CookieService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 统一处理错误和数据
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401
    if (error.response?.status === 401) {
      CookieService.clearAuth();
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const tenantName = pathSegments[1]?.charAt(0).toUpperCase() + pathSegments[1]?.slice(1) || 'Kendo';
      const theme = pathSegments[1] || 'kendo';
      const locale = pathSegments[0] || 'en';
      window.location.href = `/${tenantName}/Login?theme=${theme}&locale=${locale}`;
      return Promise.reject(error);
    }

    // 其他错误
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.msg
      || error.message;
    
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = error.response?.status;
    
    return Promise.reject(customError);
  }
);

export default axiosInstance;
