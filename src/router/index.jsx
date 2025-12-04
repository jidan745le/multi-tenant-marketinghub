import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// 使用导入的加载器组件
import AdminRedirect from '../components/AdminRedirect';
import AdminRootRedirect from '../components/AdminRootRedirect';
import AdminRoute from '../components/AdminRoute';
import DefaultRedirect from '../components/DefaultRedirect';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../utils/Loader';

// 延迟加载页面组件
const ProductCatalogue = Loader(lazy(() => import('../pages/Products/ProductCatalogue')));
const NewProducts = Loader(lazy(() => import('../pages/Products/NewProducts')));
const MediaCatalogue = Loader(lazy(() => import('../pages/MediaCatalogue')));
const Videos = Loader(lazy(() => import('../pages/Videos')));
const AfterSalesService = Loader(lazy(() => import('../pages/AfterSalesService')));
const InternalDocuments = Loader(lazy(() => import('../pages/InternalDocuments')));
const CertificationsCompliance = Loader(lazy(() => import('../pages/CertificationsCompliance')));
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
const LegalTermsPage = Loader(lazy(() => import('../pages/LegalTermsPage')));
const LegalPrivacyPage = Loader(lazy(() => import('../pages/LegalPrivacyPage')));
const SignUpPage = Loader(lazy(() => import('../pages/SignUpPage')));
const VerificationSentPage = Loader(lazy(() => import('../pages/VerificationSentPage')));
const EmailVerificationPage = Loader(lazy(() => import('../pages/EmailVerificationPage')));
const ThankYouPage = Loader(lazy(() => import('../pages/ThankYouPage')));
const UserManagement = Loader(lazy(() => import('../pages/UserManagement')));
const DerivateManagement = Loader(lazy(() => import('../pages/DerivateManagement')));
const SuperAdmin = Loader(lazy(() => import('../pages/SuperAdmin')));
const TenantAdmin = Loader(lazy(() => import('../pages/TenantAdmin')));
const ChannelManagement = Loader(lazy(() => import('../pages/ChannelManagement')));
const ProductDetailPage = Loader(lazy(() => import('../pages/ProductDetailPage')));
const ComparePage = Loader(lazy(() => import('../pages/ComparePage')));
const MyPublications = Loader(lazy(() => import('../pages/MyPublications')));
const TemplateMarketplace = Loader(lazy(() => import('../pages/TemplateMarketplace')));

const router = [
  // Login page route with tenant validation
  {
    path: '/:tenant/Login',
    element: <LoginPage />
  },
  
  // Sign Up and Verification routes with tenant validation
  {
    path: '/:tenant/Register',
    element: <SignUpPage />
  },
  {
    path: '/:tenant/VerificationSent',
    element: <VerificationSentPage />
  },
  {
    path: '/:tenant/VerifyEmail',
    element: <EmailVerificationPage />
  },
  {
    path: '/:tenant/ThankYou',
    element: <ThankYouPage />
  },
  
  // 根路径重定向到默认语言和品牌的产品目录
  {
    path: '/',
    element: <DefaultRedirect />
  },
  
  // 仅语言路径，重定向到默认品牌和页面
  {
    path: '/:lang',
    element: <DefaultRedirect />
  },
  
  // 语言和品牌路径，重定向到默认页面
  {
    path: '/:lang/:brand',
    element: <DefaultRedirect />
  },
  
  // 完整的三级路径：/:lang/:brand/:page (需要认证)
  {
    path: '/:lang/:brand/category',
    element: <ProtectedRoute><ProductCatalogue /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/home',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/products',
    element: <ProtectedRoute><NewProducts /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/medias',
    element: <ProtectedRoute><MediaCatalogue /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/accessory',
    element: <ProtectedRoute><UnderConstruction /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/videos',
    element: <ProtectedRoute><Videos /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/product-detail/:id',
    element: <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/compare',
    element: <ProtectedRoute><ComparePage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/brand-book',
    element: <ProtectedRoute> <BrandbookPage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/product-detail/:id',
    element: <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/legal-terms',
    element: <ProtectedRoute><LegalTermsPage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/legal-privacy',
    element: <ProtectedRoute><LegalPrivacyPage /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/accessories',
    element: <ProtectedRoute><UnderConstruction /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/after-sales-service',
    element: <ProtectedRoute><AfterSalesService /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/aftersales',
    element: <ProtectedRoute><AfterSalesService /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/internal-documents',
    element: <ProtectedRoute><InternalDocuments /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/internaldocuments',
    element: <ProtectedRoute><InternalDocuments /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/certifications-compliance',
    element: <ProtectedRoute><CertificationsCompliance /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/certifications',
    element: <ProtectedRoute><CertificationsCompliance /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/training',
    element: <ProtectedRoute><UnderConstruction /></ProtectedRoute>
  },
  {
    path: '/:lang/:brand/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
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
        path: 'user-management',
        element: <UserManagement />
      },
      {
        path: 'derivate-management',
        element: <DerivateManagement />
      },
      {
        path: 'channel-management',
        element: <ChannelManagement />
      },
      {
        path: 'super-admin',
        element: <SuperAdmin />
      },
      {
        path: 'tenant-admin',
        element: <TenantAdmin />
      },
      {
        path: 'my-publications',
        element: <MyPublications />
      },
      {
        path: 'template-marketplace',
        element: <TemplateMarketplace />
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
  
  // 独立的管理页面路由 (从localStorage读取默认路径)
  {
    path: '/admin',
    element: <AdminRoute><AdminRootRedirect /></AdminRoute>
  },
  
  // Dashboard route - redirect to default page
  {
    path: '/dashboard',
    element: <ProtectedRoute><DefaultRedirect /></ProtectedRoute>
  },

];

export default router; 