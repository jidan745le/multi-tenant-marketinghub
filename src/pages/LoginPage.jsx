import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import { getBackgroundImageUrl, getLoginConfig, validateTenant } from '../services/tenantValidationService';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tenantData, setTenantData] = useState(null);
  const [loginConfig, setLoginConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse URL parameters
  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const pathParts = location.pathname.split('/').filter(Boolean);

    // Extract tenant from path: /:tenant/Login
    const tenant = pathParts[0];
    const theme = searchParams.get('theme');
    const locale = searchParams.get('locale') || 'en_GB';

    return { tenant, theme, locale };
  };

  const loadTenantData = async (forceReload = false) => {
    try {
      setLoading(true);
      setError(null);

      const { tenant: tenantName, locale } = parseUrlParams();

      if (!tenantName) {
        setError('Invalid URL: Tenant name is required');
        setLoading(false);
        return;
      }

      console.log(`🔍 Loading tenant data for: ${tenantName} with locale: ${locale}`);

      // Only reload tenant data if forced (language change) or if not already loaded
      if (forceReload || !tenantData) {
        const result = await validateTenant(tenantName, locale);

        if (!result.isValid) {
          setError(`Tenant "${tenantName}" not found. Please check the URL and try again.`);
          setLoading(false);
          return;
        }

        console.log('✅ Tenant data loaded successfully:', result);
        setTenantData(result);

        // Update theme selection and login config with new tenant data
        const { theme: themeParam } = parseUrlParams();
        let selectedTheme;
        if (themeParam) {
          selectedTheme = result.tenant.themes.find(t => t.theme_key === themeParam);
          if (!selectedTheme) {
            console.warn(`Theme "${themeParam}" not found, falling back to best theme`);
            selectedTheme = result.selectedTheme;
          }
        } else {
          selectedTheme = result.selectedTheme;
        }

        const config = getLoginConfig(selectedTheme);
        console.log('🔧 Setting login config:', config);
        setLoginConfig({ ...config, selectedTheme });
      } else {
        // Just update theme configuration with existing tenant data
        updateThemeAndConfig();
      }

      setLoading(false);

    } catch (err) {
      console.error('❌ Error loading tenant data:', err);
      setError('Failed to load tenant information. Please try again.');
      setLoading(false);
    }
  };

  // Update theme selection and login config based on URL params
  const updateThemeAndConfig = () => {
    if (!tenantData) return;

    const { theme: themeParam } = parseUrlParams();

    let selectedTheme;
    if (themeParam) {
      // Find specific theme by theme_key
      selectedTheme = tenantData.tenant.themes.find(t => t.theme_key === themeParam);
      if (!selectedTheme) {
        console.warn(`Theme "${themeParam}" not found, falling back to best theme`);
        selectedTheme = tenantData.selectedTheme;
      }
    } else {
      // Use the originally selected best theme
      selectedTheme = tenantData.selectedTheme;
    }

    const config = getLoginConfig(selectedTheme);
    console.log('🔧 Setting login config:', config);
    setLoginConfig({ ...config, selectedTheme });
  };

  // Handle URL parameter changes
  useEffect(() => {
    const { tenant: tenantName, locale, theme } = parseUrlParams();

    // If no search parameters, add defaults and return (will trigger useEffect again)
    if (!location.search || location.search === '') {
      console.log('🔀 No search params, adding defaults');
      const defaultParams = {
        theme: tenantName?.toLowerCase() || 'kendo',
        locale: 'en_GB'
      };
      updateUrlParams(defaultParams);
      return;
    }

    console.log('📍 URL params:', { tenantName, locale, theme });

    // Check if this is a language change (requires API reload)
    const currentLocaleInUrl = locale; // 从URL解析出的当前locale
    const storedLocale = tenantData?.locale; // 存储在tenantData中的locale
    const isLanguageChange = tenantData && storedLocale && (currentLocaleInUrl !== storedLocale);

    console.log('🔍 语言变化检测:', {
      currentLocaleInUrl,
      storedLocale,
      isLanguageChange,
      hasTenantData: !!tenantData
    });

    if (isLanguageChange) {
      console.log('🌐 Language change detected, reloading tenant data');
      loadTenantData(true);
    } else if (!tenantData) {
      // Initial load
      console.log('🚀 Initial load');
      loadTenantData();
    } else {
      // Just theme change, update config without API call
      console.log('🎨 Theme change only');
      updateThemeAndConfig();
    }
  }, [location.pathname, location.search]);

  // Function to update URL parameters
  const updateUrlParams = (newParams) => {
    const { tenant } = parseUrlParams();
    const searchParams = new URLSearchParams(location.search);

    // Update search parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });

    const newUrl = `/${tenant}/Login?${searchParams.toString()}`;
    navigate(newUrl);
  };

  const handleRetry = () => {
    loadTenantData();
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loginSide}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #f3f3f3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#666', fontSize: '16px' }}>Loading tenant information...</p>
          </div>
        </div>
        <div className={styles.imageSide} style={{ backgroundColor: '#f5f5f5' }}></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorTitle}>Tenant Not Found</div>
        <div className={styles.errorMessage}>{error}</div>
        <button className={styles.retryButton} onClick={handleRetry}>
          Try Again
        </button>
      </div>
    );
  }

  // Get background image URL
  const backgroundImageUrl = loginConfig?.background
    ? getBackgroundImageUrl(loginConfig.background)
    : null;

  // Extract available languages from tenant data
  const getAvailableLanguages = () => {
    if (!tenantData?.tenant?.themes) return [];
    
    // 从所有主题中提取语言信息
    const allLanguages = [];
    tenantData.tenant.themes.forEach(theme => {
      if (theme.languages && Array.isArray(theme.languages)) {
        theme.languages.forEach(lang => {
          // 避免重复语言
          if (!allLanguages.find(existing => existing.iso_639_code === lang.iso_639_code)) {
            allLanguages.push(lang);
          }
        });
      }
    });
    
    console.log('🔍 从主题中提取的语言列表:', allLanguages);
    return allLanguages;
  };

  const availableLanguages = getAvailableLanguages();

  // Handle selector changes
  const handleLocaleChange = (newLocale) => {
    updateUrlParams({ locale: newLocale });
  };

  const handleThemeChange = (newTheme) => {
    updateUrlParams({ theme: newTheme });
  };

  // Get current values from URL
  const { locale: currentLocale, theme: currentTheme } = parseUrlParams();

  // Create dynamic theme styles
  const dynamicStyles = loginConfig?.primaryColor ? {
    '--primary-color': loginConfig.primaryColor,
    '--secondary-color': loginConfig.secondaryColor || loginConfig.primaryColor,
    '--hover-color': loginConfig.secondaryColor || loginConfig.primaryColor
  } : {};

  // Pass dynamic content to LoginForm
  const dynamicLoginForm = (
    <LoginForm
      pretitle={loginConfig?.pretitle}
      title={loginConfig?.title}
      subtitle={loginConfig?.subtitle}
      primaryColor={loginConfig?.primaryColor}
      secondaryColor={loginConfig?.secondaryColor}
    />
  );

  return (
    <div className={styles.pageContainer} style={{ height: '100vh', ...dynamicStyles }}>
      <div className={styles.loginSide}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 3
        }}>
          <div className={styles.topRow}>
            <Logo
              size='80px'
              logoUrl={loginConfig?.logoUrl}
              primaryColor={loginConfig?.primaryColor}
            />
            <div style={{
              display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center',
              height: '100%'
            }}>

              <LanguageSelector
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
                availableLanguages={availableLanguages}
              />
              {/* {tenantData?.tenant?.themes && (
                <ThemeSelector 
                  themes={tenantData.tenant.themes}
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeChange}
                />
              )} */}
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 7
        }}>
          <div className={styles.loginContent}>
            {dynamicLoginForm}
          </div>
        </div>
      </div>
      <div
        className={styles.imageSide}
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
          backgroundColor: backgroundImageUrl ? 'transparent' : '#f5f5f5'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          opacity: 0.48,
          background: backgroundImageUrl
            ? 'linear-gradient(60deg, rgba(211, 212, 220, 0.70) 19.78%, rgba(0, 12, 77, 0.70) 88.11%)'
            : `linear-gradient(45deg, ${loginConfig?.primaryColor || '#e53935'} 0%, ${loginConfig?.secondaryColor || loginConfig?.primaryColor || '#d32f2f'} 100%)`
        }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
