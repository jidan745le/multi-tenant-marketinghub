import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 懒加载组件
const Loader = (Component) => {
  return function LoaderComponent(props) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...props} />
      </Suspense>
    );
  };
};

// 延迟加载页面组件
const ProductCatalogue = Loader(lazy(() => import('../pages/ProductCatalogue')));
const UnderConstruction = Loader(lazy(() => import('../pages/UnderConstruction')));
const ThemeTest = Loader(lazy(() => import('../pages/ThemeTest')));

const router = [
  // 根路径重定向到默认语言和品牌的产品目录
  {
    path: '/',
    element: <Navigate to="/en_GB/kendo-china/products" replace />
  },
  
  // 仅语言路径，重定向到默认品牌和页面
  {
    path: '/:lang',
    element: <Navigate to="/en_GB/kendo-china/products" replace />
  },
  
  // 语言和品牌路径，重定向到默认页面
  {
    path: '/:lang/:brand',
    element: <Navigate to="/en_GB/kendo-china/products" replace />
  },
  
  // 完整的三级路径：/:lang/:brand/:page
  {
    path: '/:lang/:brand/products',
    element: <ProductCatalogue />
  },
  {
    path: '/:lang/:brand/home',
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/medias',
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
    element: <UnderConstruction />
  },
  {
    path: '/:lang/:brand/test',
    element: <ThemeTest />
  },
  
  // 捕获所有其他路由，重定向到默认页面
  {
    path: '*',
    element: <Navigate to="/en_GB/kendo-china/products" replace />
  }
];

export default router; 