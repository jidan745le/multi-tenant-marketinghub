import { Navigate, useParams } from 'react-router-dom';

// Admin重定向组件 - 处理未知的admin子路由
const AdminRedirect = () => {
  const { lang, brand } = useParams();
  return <Navigate to={`/${lang}/${brand}/admin/under-construction`} replace />;
};

export default AdminRedirect; 