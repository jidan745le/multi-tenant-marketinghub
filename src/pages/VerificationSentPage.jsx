import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { getBackgroundImageUrl, getLoginConfig, validateTenant } from '../services/tenantValidationService';
import styles from '../styles/VerificationPage.module.css';
import apiClient from '../utils/apiClient';

const VerificationSentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tenantData, setTenantData] = useState(null);
    const [loginConfig, setLoginConfig] = useState(null);
    const [themeLoading, setThemeLoading] = useState(true);

    const { email, phone } = location.state || {};
    const [skipTimer, setSkipTimer] = useState(location.state?.skipTimer || false);

    // Parse URL parameters (same as LoginPage)
    const parseUrlParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const pathParts = location.pathname.split('/').filter(Boolean);

        // Extract tenant from path: /:tenant/VerificationSent
        const tenant = pathParts[0];
        const theme = searchParams.get('theme');
        const locale = searchParams.get('locale') || 'en_GB';

        return { tenant, theme, locale };
    };

    // Load tenant data for theme configuration
    useEffect(() => {
        const loadTenantData = async () => {
            try {
                setThemeLoading(true);
                const { tenant: tenantName, locale } = parseUrlParams();
                
                const result = await validateTenant(tenantName, locale);
                
                if (result.isValid) {
                    setTenantData(result);
                    const config = getLoginConfig(result.selectedTheme);
                    setLoginConfig({ ...config, selectedTheme: result.selectedTheme });
                } else {
                    // Set default configuration
                    setLoginConfig({
                        primaryColor: '#e53935',
                        secondaryColor: '#d32f2f',
                        logoUrl: null,
                        background: null
                    });
                }
            } catch (error) {
                console.error('❌ Error loading tenant data:', error);
                setLoginConfig({
                    primaryColor: '#e53935',
                    secondaryColor: '#d32f2f',
                    logoUrl: null,
                    background: null
                });
            } finally {
                setThemeLoading(false);
            }
        };

        loadTenantData();
    }, [location.search]);

    useEffect(() => {
        // Redirect if no email provided
        if (!email) {
            const { tenant, theme, locale } = parseUrlParams();
            navigate(`/${tenant}/Register?theme=${theme}&locale=${locale}`);
            return;
        }
        
        // If skipTimer is true, enable resend button immediately
        if (skipTimer) {
            setResendTimer(0);
            setCanResend(true);
            return;
        }
        
        // Start countdown timer
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, navigate, skipTimer]);

    const handleResendEmail = async () => {
        if (!canResend || loading) return;

        setLoading(true);
        try {
            // Get tenantName from URL and add to request
            const { tenant: tenantName } = parseUrlParams();
            
            const resendData = {
                email: email,
                tenantName: tenantName,
                source: "marketinghub"
            };
            
            console.log('Resend verification data:', resendData);
            
            const response = await apiClient.post('/resend-verification', resendData);

            // Reset timer
            setResendTimer(60);
            setCanResend(false);
            if (skipTimer) {
                setSkipTimer(false);
            }

            // Show success message
            alert('Verification email sent successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to resend email. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while theme data loads
    if (themeLoading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.contentSide}>
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
                            borderTop: '4px solid #e53935',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
                    </div>
                </div>
                <div className={styles.imageSide} style={{ backgroundColor: '#f5f5f5' }}></div>
            </div>
        );
    }

    // Get background image URL
    const backgroundImageUrl = loginConfig?.background
        ? getBackgroundImageUrl(loginConfig.background)
        : null;

    // Create dynamic theme styles
    const dynamicStyles = loginConfig?.primaryColor ? {
        '--primary-color': loginConfig.primaryColor,
        '--secondary-color': loginConfig.secondaryColor || loginConfig.primaryColor,
        '--hover-color': loginConfig.secondaryColor || loginConfig.primaryColor
    } : {};

    return (
        <div className={styles.pageContainer} style={{ ...dynamicStyles }}>
            <div className={styles.contentSide}>
                <div className={styles.content}>
                    <Logo 
                        size='80px'
                        logoUrl={loginConfig?.logoUrl}
                        primaryColor={loginConfig?.primaryColor}
                    />
                    <div className={styles.verificationContainer}>
                        <h2 className={styles.title}>Verify Your E-mail Address</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                Thanks for signing up! Please follow the instructions in the verification email we've sent to
                            </p>
                            <p className={styles.email}>{email}</p>
                        </div>

                        <div className={styles.helpSection}>
                            <h3 className={styles.helpTitle}>Didn't receive an email?</h3>
                            <ul className={styles.helpList}>
                                <li>Check your spam folder. Sometimes emails end up there.</li>
                                <li>Resend the email confirmation by clicking the button below.</li>
                            </ul>

                            <button
                                className={`${styles.resendButton} ${!canResend ? styles.disabled : ''}`}
                                onClick={handleResendEmail}
                                disabled={!canResend}
                            >
                                {canResend ? 'Resend verification email' : `Resend available in 0:${resendTimer.toString().padStart(2, '0')}`}
                            </button>
                        </div>

                        <div className={styles.supportSection}>
                            <p className={styles.supportTitle}>Need help?</p>
                            <p className={styles.supportText}>
                                Contact our support team at <a href="mailto:support@rg-experience.com" className={styles.supportLink}>support@rg-experience.com</a>
                            </p>
                        </div>

                        <div className={styles.linkContainer}>
                            <Link to={`/${parseUrlParams().tenant}/Login?theme=${parseUrlParams().theme}&locale=${parseUrlParams().locale}`} className={styles.backLink}>
                                Back to Login
                            </Link>
                        </div>
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

export default VerificationSentPage;
