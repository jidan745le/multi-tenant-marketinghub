import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import CookieService from '../utils/cookieService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [returnUrl, setReturnUrl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Map short locale (e.g., 'en') from LoginPage to app language code (e.g., 'en_GB')
    const mapLocaleToAppLanguage = (locale) => {
        const mapping = {
            en: 'en_GB', zh: 'zh_CN', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', ja: 'ja_JP',
            ko: 'ko_KR', it: 'it_IT', pt: 'pt_PT', ru: 'ru_RU', ar: 'ar_SA', nl: 'nl_NL',
            pl: 'pl_PL', cs: 'cs_CZ', da: 'da_DK', fi: 'fi_FI', hu: 'hu_HU', nb: 'nb_NO',
            sv: 'sv_SE', bg: 'bg_BG', hr: 'hr_HR', et: 'et_EE', el: 'el_GR', lt: 'lt_LT',
            lv: 'lv_LV'
        };
        if (!locale) return 'en_GB';
        const normalized = String(locale).toLowerCase();
        return mapping[normalized] || (normalized.length === 2 ? `${normalized}_${normalized.toUpperCase()}` : 'en_GB');
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const returnUrlParam = params.get('returnUrl');
        if (returnUrlParam) {
            setReturnUrl(returnUrlParam);
            console.log('returnUrlParam', returnUrlParam);
        }
    }, [location]);

    useEffect(() => {
        // 从cookie中检查认证状态
        const storedToken = CookieService.getToken();
        const userInfo = CookieService.getUserInfo();

        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            if (userInfo) {
                setUser(userInfo);
            }
        } else {
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await apiClient.post('/login', credentials);
            const { token: newToken, user: userData } = response;

            // 使用CookieService保存token和用户信息
            CookieService.setToken(newToken);
            CookieService.setUserInfo(userData);

            // 更新状态
            setToken(newToken);
            setIsAuthenticated(true);
            setUser(userData);
            setLoading(false);

            // 根据登录页面的URL参数设置localStorage的租户信息
            const pathSegments = location.pathname.split('/').filter(Boolean);
            const searchParams = new URLSearchParams(location.search);
            
            // 从登录页面URL解析租户信息: /:tenantName/Login?theme=xxx&locale=xxx
            const tenantFromPath = pathSegments[0]; // 如 "KENDO"
            const themeParam = searchParams.get('theme'); // 如 "kendo"
            const localeParam = searchParams.get('locale') || 'en'; // 如 "en"

            // 构建应用页面路径格式，使用用户信息优先
            const tenantName = userData.tenantName || tenantFromPath || 'KENDO';
            const brand = themeParam || tenantName.toLowerCase() || 'kendo';
            
            // 将locale转换为应用格式 (en -> en_GB)
            const appLanguage = mapLocaleToAppLanguage(localeParam);

            // 设置localStorage的租户和重定向信息
            try {
                localStorage.setItem('mh_tenant', JSON.stringify({ 
                    tenant: tenantName, 
                    brand: brand, 
                    language: appLanguage 
                }));
                localStorage.setItem('mh_default_redirect', `/${appLanguage}/${brand}/category`);
                localStorage.setItem('mh_default_admin_redirect', `/${appLanguage}/${brand}/admin/under-construction`);
                
                console.log('✅ 设置localStorage:', {
                    tenant: tenantName,
                    brand: brand,
                    language: appLanguage,
                    defaultRedirect: `/${appLanguage}/${brand}/category`
                });
            } catch (error) {
                console.warn('Failed to set localStorage:', error);
            }

            // 处理登录成功后的重定向
            if (returnUrl) {
                setTimeout(() => {
                    window.location.href = returnUrl;
                });
            } else {
                console.log('Navigating to default page...');
                // 直接跳转到正确的默认页面，而不是通过dashboard
                setTimeout(() => {
                    navigate(`/${appLanguage}/${brand}/category`);
                }, 100);
            }
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error);

            // 检查是否是账户未激活错误
            if (error.response?.status === 403 &&
                error.response?.data?.message === "Account not activated. Please check your email for verification link.") {
                // 跳转到验证页面，传递邮箱和直接启用重发标志
                navigate('/verification-sent', {
                    state: {
                        email: credentials.email,
                        skipTimer: true
                    }
                });
                return false;
            }

            throw error; // 将错误抛出，以便在LoginForm中捕获
        }
    };

    const logout = () => {
        // 使用CookieService清除认证信息
        CookieService.clearAuth();

        // 重置状态
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);

        // 构建正确的登录页URL格式: /:tenantName/Login?theme=${currentTheme}&locale=${currentLocale}
        // 尝试从当前路径或用户信息获取租户和主题信息
        const pathSegments = location.pathname.split('/').filter(Boolean);
        
        let tenantName, currentTheme, currentLocale;
        
        if (pathSegments.length >= 2) {
            // 当前路径格式: /:lang/:brand/:page
            currentLocale = pathSegments[0] || 'en';
            currentTheme = pathSegments[1] || 'kendo'; // brand作为theme
            // 使用用户的tenantName或brand作为tenantName
            tenantName = (user?.tenantName) || pathSegments[1] || 'KENDO';
        } else if (pathSegments.length === 1 && pathSegments[0] !== 'Login') {
            // 可能是租户根路径
            tenantName = pathSegments[0] || (user?.tenantName) || 'KENDO';
            currentTheme = pathSegments[0]?.toLowerCase() || 'kendo';
            currentLocale = 'en';
        } else {
            // 回退到用户信息或默认值
            tenantName = (user?.tenantName) || 'KENDO';
            currentTheme = (user?.tenantName?.toLowerCase()) || 'kendo';
            currentLocale = 'en';
        }
        
        // 跳转至登录页，使用正确的URL格式
        navigate(`/${tenantName}/Login?theme=${currentTheme}&locale=${currentLocale}`);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
