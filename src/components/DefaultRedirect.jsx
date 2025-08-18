import { Navigate } from 'react-router-dom';

const getDefaultPath = () => {
  try {
    const stored = localStorage.getItem('mh_default_redirect');
    if (stored && typeof stored === 'string') {
      return stored;
    }
  } catch (_) {}
  return '/en_GB/kendo/category';
};

const DefaultRedirect = () => {
  const target = getDefaultPath();
  return <Navigate to={target} replace />;
};

export default DefaultRedirect;


