import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 使用导入的加载器组件
import Loader from '../utils/Loader';

// 延迟加载页面组件
const ProductCatalogue = Loader(lazy(() => import('../pages/ProductCatalogue')));
const MediaCatalogue = Loader(lazy(() => import('../pages/MediaCatalogue')));
const HomePage = Loader(lazy(() => import('../pages/HomePage')));
const UnderConstruction = Loader(lazy(() => import('../pages/UnderConstruction')));
const AdminThemeSettings = Loader(lazy(() => import('../pages/AdminThemeSettings')));

const router = [
  // 根路径重定向到默认语言和品牌的产品目录
  {
    path: '/',
    element: <Navigate to="/en_GB/kendo/category" replace />
  },
  
  // 仅语言路径，重定向到默认品牌和页面
  {
    path: '/:lang',
    element: <Navigate to="/en_GB/kendo/category" replace />
  },
  
  // 语言和品牌路径，重定向到默认页面
  {
    path: '/:lang/:brand',
    element: <Navigate to="/en_GB/kendo/category" replace />
  },
  
  // 完整的三级路径：/:lang/:brand/:page
  {
    path: '/:lang/:brand/category',
    element: <ProductCatalogue />
  },
  {
    path: '/:lang/:brand/home',
    element: <HomePage />
  },
  {
    path: '/:lang/:brand/products',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/medias',
    element: <MediaCatalogue />
  },
  {
    path: '/:lang/:brand/accessory',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/videos',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/brand-book',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/accessories',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/after-sales-service',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/training',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/admin',
    element: <AdminThemeSettings />
  },
 
  
  // 捕获所有其他路由，重定向到默认页面
  {
    path: '*',
    element: <Navigate to="/en_GB/kendo/category" replace />
  }
];

export default router; 