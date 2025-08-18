import { Navigate, useParams } from 'react-router-dom';

const getDefaultAdminPath = (lang, brand) => {
  try {
    const stored = localStorage.getItem('mh_default_admin_redirect');
    if (stored && typeof stored === 'string') return stored;
  } catch (_) {}
  return `/${lang || 'en_GB'}/${brand || 'kendo'}/admin/under-construction`;
};

const AdminRootRedirect = () => {
  const { lang, brand } = useParams();
  const target = getDefaultAdminPath(lang, brand);
  return <Navigate to={target} replace />;
};

export default AdminRootRedirect;


