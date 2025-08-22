import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to get full user information including subApplications
 * This data is stored in localStorage to avoid cookie size limits
 * @returns {Object} { fullUserInfo, loading, error, refetch }
 */
export const useFullUserInfo = () => {
    const { getFullUserInfo, isAuthenticated } = useAuth();
    const [fullUserInfo, setFullUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFullUserInfo = () => {
        try {
            setLoading(true);
            setError(null);

            if (!isAuthenticated) {
                setFullUserInfo(null);
                setLoading(false);
                return;
            }

            const userInfo = getFullUserInfo();
            setFullUserInfo(userInfo);
        } catch (err) {
            console.error('Error fetching full user info:', err);
            setError(err);
            setFullUserInfo(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFullUserInfo();
    }, [isAuthenticated]);

    return {
        fullUserInfo,
        loading,
        error,
        refetch: fetchFullUserInfo
    };
};

export default useFullUserInfo;
