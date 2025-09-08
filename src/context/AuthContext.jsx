import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearLanguageCache } from '../store/slices/themesSlice';
import { clearUserData, setUserData } from '../store/slices/userSlice';
import apiClient from '../utils/apiClient';
import CookieService from '../utils/cookieService';
import CookieDebugger from '../utils/debugCookies';
import DebugTracker from '../utils/debugTracker';

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
    const dispatch = useDispatch();

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

    // Check if user has required permissions to access main app
    const hasRequiredPermissions = (permissions) => {
        if (!permissions || !Array.isArray(permissions)) {
            console.warn('⚠️ 权限数据不存在或格式错误:', permissions);
            return false;
        }
        
        const requiredPermissions = [
            'marketinghub:theme:kendo',
            'marketinghub:theme:bosch',
            'marketinghub:system:admin'
        ];

        const hasPermission = requiredPermissions.some(permission => 
            permissions.includes(permission)
        );

        console.log('🔍 权限检查详情:', {
            userPermissions: permissions,
            requiredPermissions,
            hasMatchingPermission: hasPermission,
            matchingPermissions: permissions.filter(p => requiredPermissions.includes(p))
        });

        return hasPermission;
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
        DebugTracker.log('AUTH_INIT_START', {});
        console.log('🚀 AuthContext 开始初始化检查...');
        
        // 从cookie中检查认证状态
        const storedToken = CookieService.getToken();
        const userInfo = CookieService.getUserInfo();
        
        console.log('🔍 AuthContext 初始化检查:', {
            currentURL: window.location.href,
            hasStoredToken: !!storedToken,
            tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'null',
            hasUserInfo: !!userInfo,
            userInfoValid: !!userInfo?.id,
            userEmail: userInfo?.email || 'no email'
        });

        if (storedToken || userInfo) {
            // 如果有token或用户信息，尝试恢复认证状态
            DebugTracker.log('AUTH_RESTORE_ATTEMPT', {
                hasToken: !!storedToken,
                hasUserInfo: !!userInfo,
                userEmail: userInfo?.email
            });
            
            if (storedToken) {
                console.log('🔑 找到token，设置认证状态为已登录');
                setToken(storedToken);
                setIsAuthenticated(true);
                
                if (userInfo) {
                    setUser(userInfo);
                    // 将存储的用户数据同步到Redux
                    dispatch(setUserData({
                        user: userInfo,
                        permissions: userInfo.permissions || [],
                        roles: userInfo.roles || []
                    }));
                }
                
                DebugTracker.log('AUTH_RESTORE_SUCCESS', {
                    userEmail: userInfo?.email,
                    hasPermissions: !!(userInfo?.permissions && userInfo.permissions.length > 0)
                });
                console.log('✅ 认证状态恢复成功:', userInfo?.email || 'token only');
            } else if (userInfo) {
                // 只有用户信息没有token，可能是token过期了，但我们仍然可以尝试使用用户信息
                console.log('⚠️ 只找到用户信息，没有token，尝试部分恢复');
                setUser(userInfo);
                setIsAuthenticated(false); // 没有token就不算完全认证
                dispatch(setUserData({
                    user: userInfo,
                    permissions: userInfo.permissions || [],
                    roles: userInfo.roles || []
                }));
                
                DebugTracker.log('AUTH_PARTIAL_RESTORE', {
                    userEmail: userInfo.email,
                    reason: 'no_token'
                });
            }
        } else {
            DebugTracker.log('AUTH_RESTORE_FAILED', {
                hasToken: !!storedToken,
                hasUserInfo: !!userInfo,
                reason: 'no_data'
            });
            console.log('❌ 未找到认证信息，设置为未登录状态');
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            dispatch(clearUserData());
        }

        setLoading(false);
        console.log('✅ AuthContext 初始化完成');
        
        // 在开发模式下暴露调试工具
        if (import.meta.env.DEV) {
            window.CookieDebugger = CookieDebugger;
            console.log('🛠️ Debug tools available: window.CookieDebugger.runFullTest()');
        }
    }, []);

    const login = async (credentials) => {
        try {
            DebugTracker.log('LOGIN_START', { email: credentials.email });
            setLoading(true);
            
            // Extract tenantName from URL and add it to credentials
            const loginPathSegments = location.pathname.split('/').filter(Boolean);
            const loginTenantName = loginPathSegments[0]; // e.g., "KENDO" from "/:tenant/Login"
            
            const loginData = {
                ...credentials,
                tenantName: loginTenantName
            };
            
            console.log('Login data with tenant:', loginData);
            
            const response = await apiClient.post('/login', loginData);
            DebugTracker.log('LOGIN_API_SUCCESS', { userEmail: response.user?.email });
            const { token: newToken, user: userData } = response;

            // 使用CookieService保存token和用户信息
            console.log('🍪 保存token到cookie和localStorage:', {
                hasToken: !!newToken,
                tokenLength: newToken?.length,
                tokenStart: newToken?.substring(0, 20)
            });
            
            DebugTracker.log('SAVE_TOKEN_START', {
                hasToken: !!newToken,
                tokenLength: newToken?.length,
                userEmail: userData?.email
            });
            
            CookieService.setToken(newToken);
            console.log('🍪 保存用户信息到cookie和localStorage:', userData?.email);
            CookieService.setUserInfo(userData);
            
            // 验证保存是否成功
            const savedToken = CookieService.getToken();
            const savedUserInfo = CookieService.getUserInfo();
            
            DebugTracker.log('SAVE_TOKEN_VERIFY', {
                tokenSaved: !!savedToken,
                userInfoSaved: !!savedUserInfo,
                tokenMatch: savedToken === newToken,
                userEmailMatch: savedUserInfo?.email === userData?.email,
                cookieCount: document.cookie.split(';').length
            });
            
            console.log('🔍 验证保存结果:', {
                tokenSaved: !!savedToken,
                tokenLength: savedToken?.length,
                userInfoSaved: !!savedUserInfo,
                tokenMatch: savedToken === newToken,
                userEmailMatch: savedUserInfo?.email === userData?.email,
                allCookies: document.cookie
            });

            // 更新状态
            setToken(newToken);
            setIsAuthenticated(true);
            setUser(userData);
            setLoading(false);
            
            DebugTracker.log('LOGIN_STATE_UPDATED', {
                hasToken: !!newToken,
                isAuthenticated: true,
                userId: userData?.id,
                userEmail: userData?.email
            });

            // 将用户数据存储到Redux
            dispatch(setUserData({
                user: userData,
                permissions: userData.permissions || [],
                roles: userData.roles || []
            }));

            // 根据登录页面的URL参数设置localStorage的租户信息
            const pathSegments = location.pathname.split('/').filter(Boolean);
            const searchParams = new URLSearchParams(location.search);
            
            // 从登录页面URL解析租户信息: /:tenantName/Login?theme=xxx&locale=xxx
            const tenantFromPath = pathSegments[0]; // 如 "KENDO"
            const themeParam = searchParams.get('theme'); // 如 "kendo"
            const localeParam = searchParams.get('locale') || 'en'; // 如 "en"

            // 构建应用页面路径格式，使用用户信息优先
            const tenantName = userData.tenantName || tenantFromPath || 'Kendo';
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

            // 检查用户权限并进行相应的重定向
            console.log('🔍 开始权限检查:', userData.permissions);
            const hasPermissions = hasRequiredPermissions(userData.permissions);
            console.log('🔍 权限检查结果:', hasPermissions);

            if (hasPermissions) {
                // 用户有访问权限，进行正常重定向
                if (returnUrl) {
                    console.log('✅ 用户有权限，跳转到返回URL:', returnUrl);
                    setTimeout(() => {
                        window.location.href = returnUrl;
                    });
                } else {
                    console.log('✅ 用户有权限，跳转到默认页面:', `/${appLanguage}/${brand}/category`);
                    // 直接跳转到正确的默认页面，而不是通过dashboard
                    setTimeout(() => {
                        navigate(`/${appLanguage}/${brand}/category`);
                    }, 100);
                }
            } else {
                // 用户没有访问权限，重定向到感谢页面
                console.log('❌ 用户没有必要权限，跳转到感谢页面:', `/${tenantFromPath}/ThankYou?theme=${themeParam}&locale=${localeParam}`);
                setTimeout(() => {
                    navigate(`/${tenantFromPath}/ThankYou?theme=${themeParam}&locale=${localeParam}`);
                }, 100);
            }
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error);

            // 检查是否是账户未激活错误
            if (error.response?.status === 403 &&
                error.response?.data?.message === "Account not activated. Please check your email for verification link.") {
                // 从当前URL解析租户信息
                const pathSegments = location.pathname.split('/').filter(Boolean);
                const searchParams = new URLSearchParams(location.search);
                const tenantFromPath = pathSegments[0];
                const themeParam = searchParams.get('theme');
                const localeParam = searchParams.get('locale') || 'en';
                
                // 跳转到验证页面，传递邮箱和直接启用重发标志
                navigate(`/${tenantFromPath}/VerificationSent?theme=${themeParam}&locale=${localeParam}`, {
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

        // 清除所有Redux状态
        dispatch(clearUserData());
        dispatch(clearLanguageCache({})); // 清除所有主题/语言缓存

        // 设置logout标志，防止ProtectedRoute干扰
        sessionStorage.setItem('logout_in_progress', 'true');

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
            tenantName = (user?.tenantName) || pathSegments[1] || 'Kendo';
            // alert(JSON.stringify(user));
            // alert(JSON.stringify(pathSegments));
        } else if (pathSegments.length === 1 && pathSegments[0] !== 'Login') {
            // 可能是租户根路径
            tenantName = pathSegments[0] || (user?.tenantName) || 'Kendo';
            currentTheme = pathSegments[0]?.toLowerCase() || 'kendo';
            currentLocale = 'en';
        } else {
            // 回退到用户信息或默认值
            tenantName = (user?.tenantName) || 'Kendo';
            currentTheme = (user?.tenantName?.toLowerCase()) || 'kendo';
            currentLocale = 'en';
        }

        // alert(JSON.stringify(tenantName));
        // alert(JSON.stringify(currentTheme));
        // alert(JSON.stringify(currentLocale));
        
            // 跳转至登录页，使用正确的URL格式
        navigate(`/${tenantName}/Login?theme=${currentTheme}&locale=${currentLocale}`);
        
        // 延迟清除logout标志，确保跳转完成
        setTimeout(() => {
            sessionStorage.removeItem('logout_in_progress');
        }, 100);
    };

    // Get full user info including subApplications when needed
    const getFullUserInfo = () => {
        return CookieService.getFullUserInfo();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated, 
            login, 
            logout, 
            loading,
            getFullUserInfo 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
