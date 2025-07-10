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

const router = [
    // 根路径重定向到产品目录
    {
        path: '/',
        element: <Navigate to="/products" replace />
    },
    // 产品目录页面
    {
        path: '/products',
        element: <ProductCatalogue />
    },
    // 其他所有路由都重定向到 Under Construction 页面
    {
        path: '/home',
        element: <UnderConstruction />
    },
    {
        path: '/medias',
        element: <UnderConstruction />
    },
    {
        path: '/videos',
        element: <UnderConstruction />
    },
    {
        path: '/brand-book',
        element: <UnderConstruction />
    },
    {
        path: '/accessories',
        element: <UnderConstruction />
    },
    {
        path: '/after-sales-service',
        element: <UnderConstruction />
    },
    {
        path: '/training',
        element: <UnderConstruction />
    },
    {
        path: '/admin',
        element: <UnderConstruction />
    },
    // 捕获所有其他路由
    {
        path: '*',
        element: <Navigate to="/products" replace />
    }
];

export default router; 