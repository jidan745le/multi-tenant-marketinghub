import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 使用导入的加载器组件
import AdminRedirect from '../components/AdminRedirect';
import Loader from '../utils/Loader';

// 延迟加载页面组件
const ProductCatalogue = Loader(lazy(() => import('../pages/ProductCatalogue')));
const NewProducts = Loader(lazy(() => import('../pages/NewProducts')));
const MediaCatalogue = Loader(lazy(() => import('../pages/MediaCatalogue')));
const Videos = Loader(lazy(() => import('../pages/Videos')));
const HomePage = Loader(lazy(() => import('../pages/HomePage')));
const UnderConstruction = Loader(lazy(() => import('../pages/UnderConstruction')));
const AdminLayout = Loader(lazy(() => import('../layouts/AdminLayout')));
const LookAndFeel = Loader(lazy(() => import('../pages/LookAndFeel')));
const ThemeGeneralSettings = Loader(lazy(() => import('../pages/ThemeGeneralSettings')));
const ThemeConfiguration = Loader(lazy(() => import('../pages/ThemeConfiguration')));
const UnderConstructionAdmin = Loader(lazy(() => import('../pages/UnderConstructionAdmin')));
const CommunicationSettings = Loader(lazy(() => import('../pages/CommunicationSettings')));
const LegalSettings = Loader(lazy(() => import('../pages/LegalSettings')));
const SocialProfileSettings = Loader(lazy(() => import('../pages/SocialProfileSettings')));
const LoginPage = Loader(lazy(() => import('../pages/LoginPage')));
const BrandbookPage = Loader(lazy(() => import('../pages/BrandbookPage')));

const router = [
  // Login page route with tenant validation
  {
    path: '/:tenant/Login',
    element: <LoginPage />
  },
  
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
    element: <NewProducts />
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
    element: <Videos />
  },
  {
    path: '/:lang/:brand/brand-book',
    element: <BrandbookPage />
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
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="look-feel" replace />
      },
      {
        path: 'look-feel',
        element: <LookAndFeel />
      },
      {
        path: 'theme-general-settings',
        element: <ThemeGeneralSettings />
      },
      {
        path: 'theme-configuration',
        element: <ThemeConfiguration />
      },
      {
        path: 'legal',
        element: <LegalSettings />
      },
      {
        path: 'communication-email',
        element: <CommunicationSettings />
      },
      {
        path: 'social-profile',
        element: <SocialProfileSettings />
      },
      {
        path: 'under-construction',
        element: <UnderConstructionAdmin />
      },
      {
        path: '*',
        element: <AdminRedirect />
      }
    ]
  },
  
  // 独立的管理页面路由 (重定向到默认语言和品牌)
  {
    path: '/admin',
    element: <Navigate to="/en_GB/kendo/admin" replace />
  },
 
  
  // 捕获所有其他路由，重定向到默认页面
  {
    path: '*',
    element: <Navigate to="/en_GB/kendo/category" replace />
  }
];

export default router; 