import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import { getBackgroundImageUrl, getLoginConfig, validateTenant } from '../services/tenantValidationService';
import apiClient from '../utils/apiClient';

// Styled Components
const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  boxSizing: 'border-box',
});

const LoginSide = styled(Box)({
  flex: 4,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: 'white',
  padding: '40px',
  boxSizing: 'border-box',
});

const TopRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '0 120px',
  width: '100%',
  marginBottom: '20px',
});

const LoginContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  margin: '0 auto',
  height: '100%',
  padding: '0px 120px',
});

const FormContainer = styled(Box)({
  width: '100%',
  maxWidth: '400px',
});

const Title = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 600,
  color: '#333',
  textAlign: 'center',
  marginBottom: '8px',
  marginTop: '0px !important',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const NameRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
});

const InputGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

const StyledTextField = styled(TextField)(({ theme, error }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1rem',
    '& fieldset': {
      borderColor: error ? 'var(--primary-color, #e53935)' : '#ddd',
    },
    '&:hover fieldset': {
      borderColor: error ? 'var(--primary-color, #e53935)' : '#ddd',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-color, #e53935)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
  },
}));

const StyledSelect = styled(Select)(({ theme, error }) => ({
  width: '100%',
  borderRadius: '8px',
  fontSize: '1rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? 'var(--primary-color, #e53935)' : '#ddd',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? 'var(--primary-color, #e53935)' : '#ddd',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--primary-color, #e53935)',
  },
  '& .MuiSelect-select': {
    padding: '12px 16px',
  },
}));

const ErrorText = styled(Typography)({
  color: 'var(--primary-color, #e53935)',
  fontSize: '0.85rem',
  marginTop: '2px',
});

const SignUpButton = styled(Button)({
  width: '100%',
  padding: '12px',
  backgroundColor: 'var(--primary-color, #e53935)',
  color: 'white',
  border: '1px solid var(--primary-color, #e53935)',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 500,
  cursor: 'pointer',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: 'var(--primary-color, #e53935)',
    borderColor: 'var(--primary-color, #e53935)',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
    cursor: 'not-allowed',
    color: 'white',
  },
});

const LinkContainer = styled(Box)({
  textAlign: 'center',
  marginTop: '20px',
  color: '#666',
});

const StyledLink = styled(Link)({
  color: 'var(--primary-color, #e53935)',
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    color: 'var(--hover-color, var(--secondary-color, #d32f2f))',
    textDecoration: 'underline',
  },
});

const ImageSide = styled(Box)({
  flex: 5,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: '20px',
});

const Spinner = styled(Box)({
  width: '40px',
  height: '40px',
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #e53935',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    country: '',
    partnerId: '',
    preferredLanguage: 'English'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tenantData, setTenantData] = useState(null);
  const [loginConfig, setLoginConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Parse URL parameters (same as LoginPage)
  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const pathParts = location.pathname.split('/').filter(Boolean);

    // Extract tenant from path: /:tenant/Register
    const tenant = pathParts[0];
    const theme = searchParams.get('theme');
    const locale = searchParams.get('locale') || 'en_GB';

    return { tenant, theme, locale };
  };

  // Load tenant data for theme configuration
  useEffect(() => {
    const loadTenantData = async () => {
      try {
        setLoading(true);
        const { tenant: tenantName, locale } = parseUrlParams();

        if (!tenantName) {
          setLoginConfig({
            primaryColor: '#e53935',
            secondaryColor: '#d32f2f',
            logoUrl: null,
            background: null
          });
          setLoading(false);
          return;
        }
        
        console.log(`🔍 Loading tenant data for signup: ${tenantName} with locale: ${locale}`);
        
        const result = await validateTenant(tenantName, locale);
        
        if (result.isValid) {
          setTenantData(result);
          const config = getLoginConfig(result.selectedTheme);
          setLoginConfig({ ...config, selectedTheme: result.selectedTheme });
          console.log('✅ Tenant data loaded for signup:', result);
        } else {
          console.warn('⚠️ Could not load tenant data, using defaults');
          // Set default configuration
          setLoginConfig({
            primaryColor: '#e53935',
            secondaryColor: '#d32f2f',
            logoUrl: null,
            background: null
          });
        }
      } catch (error) {
        console.error('❌ Error loading tenant data for signup:', error);
        // Set default configuration on error
        setLoginConfig({
          primaryColor: '#e53935',
          secondaryColor: '#d32f2f',
          logoUrl: null,
          background: null
        });
      } finally {
        setLoading(false);
      }
    };

    loadTenantData();
  }, [location.pathname, location.search]);

  // Extract available languages from tenant data (same as LoginPage)
  const getAvailableLanguages = () => {
    if (!tenantData?.tenant?.themes) return [];
    
    const allLanguages = [];
    tenantData.tenant.themes.forEach(theme => {
      if (theme.languages && Array.isArray(theme.languages)) {
        theme.languages.forEach(lang => {
          if (!allLanguages.find(existing => existing.iso_639_code === lang.iso_639_code)) {
            allLanguages.push(lang);
          }
        });
      }
    });
    
    return allLanguages;
  };

  const availableLanguages = getAvailableLanguages();

  // Function to update URL parameters (same as LoginPage)
  const updateUrlParams = (newParams) => {
    const { tenant } = parseUrlParams();
    const searchParams = new URLSearchParams(location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });

    const newUrl = `/${tenant}/Register?${searchParams.toString()}`;
    navigate(newUrl);
  };

  // Handle selector changes (same as LoginPage)
  const handleLocaleChange = (newLocale) => {
    updateUrlParams({ locale: newLocale });
  };

  const handleThemeChange = (newTheme) => {
    updateUrlParams({ theme: newTheme });
  };

  // Get current values from URL (same as LoginPage)
  const { locale: currentLocale, theme: currentTheme } = parseUrlParams();

  // Common countries list
  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea',
    'China', 'Hong Kong', 'Taiwan', 'Singapore', 'Malaysia', 'Thailand', 'India', 'Brazil', 'Mexico',
    'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Other'
  ];

  // Language options
  const languages = [
    'English', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean', 'German', 
    'French', 'Spanish', 'Italian', 'Portuguese', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 
    'Finnish', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Address validation (optional, but if provided should be reasonable length)
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
    }

    // Country validation (optional, but if provided should be reasonable length)
    if (formData.country && formData.country.length > 100) {
      newErrors.country = 'Country must be less than 100 characters';
    }

    // Partner ID validation (optional, but if provided should be reasonable length)
    if (formData.partnerId && formData.partnerId.length > 50) {
      newErrors.partnerId = 'Partner ID must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get tenantName from URL and add it to formData
      const { tenant: tenantName } = parseUrlParams();
      const registrationData = {
        ...formData,
        tenantName: tenantName,
        source: "marketinghub"
      };
      
      console.log('Registration data with tenant:', registrationData);
      
      const responseData = await apiClient.post('/register', registrationData);
      console.log('Registration response data:', responseData);
      
      // apiClient.post returns the parsed JSON data, not the response object
      // If we get here without an error, the request was successful (200/201)
      if (responseData && (responseData.message || responseData.email)) {
        const { tenant } = parseUrlParams();
        console.log('Parsed URL params:', { tenant, currentTheme, currentLocale });
        
        const targetUrl = `/${tenant}/VerificationSent?theme=${currentTheme}&locale=${currentLocale}`;
        console.log('Navigating to:', targetUrl);
        
        navigate(targetUrl, {
          state: {
            email: formData.email,
            phone: formData.phone
          }
        });
      } else {
        console.log('Unexpected response data:', responseData);
        setErrors({ submit: 'Registration completed but unexpected response format.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while tenant data loads
  if (loading) {
    return (
      <PageContainer>
        <LoginSide>
          <LoadingContainer>
            <Spinner />
            <Typography style={{ color: '#666', fontSize: '16px' }}>Loading...</Typography>
          </LoadingContainer>
        </LoginSide>
        <ImageSide style={{ backgroundColor: '#f5f5f5' }} />
      </PageContainer>
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
    <PageContainer style={{ height: '100vh', ...dynamicStyles }}>
      <LoginSide>
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 3
        }}>
          <TopRow>
            <Logo
              size='80px'
              logoUrl={loginConfig?.logoUrl}
              primaryColor={loginConfig?.primaryColor}
            />
            <Box style={{
              display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center',
              height: '100%'
            }}>
              <LanguageSelector
                currentLocale={currentLocale}
                onLocaleChange={handleLocaleChange}
                availableLanguages={availableLanguages}
              />
            </Box>
          </TopRow>
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 7
        }}>
          <LoginContent>
            <FormContainer>
            <Title>Create Your Account</Title>

            <Form onSubmit={handleSubmit}>
              <NameRow>
                <InputGroup>
                  <StyledTextField
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    variant="outlined"
                  />
                  {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                </InputGroup>
                <InputGroup>
                  <StyledTextField
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    variant="outlined"
                  />
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </InputGroup>
              </NameRow>

              <InputGroup>
                <StyledTextField
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  variant="outlined"
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <StyledTextField
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  variant="outlined"
                />
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <StyledTextField
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  variant="outlined"
                />
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <StyledTextField
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  variant="outlined"
                />
                {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <StyledTextField
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  variant="outlined"
                  multiline
                  rows={3}
                />
                {errors.address && <ErrorText>{errors.address}</ErrorText>}
              </InputGroup>

              <NameRow>
                <InputGroup>
                  <FormControl variant="outlined" fullWidth>
                    <StyledSelect
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      error={!!errors.country}
                      displayEmpty
                    >
                      <MenuItem value="">Select Country</MenuItem>
                      {countries.map(country => (
                        <MenuItem key={country} value={country}>{country}</MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                  {errors.country && <ErrorText>{errors.country}</ErrorText>}
                </InputGroup>
                <InputGroup>
                  <StyledTextField
                    type="text"
                    name="partnerId"
                    placeholder="Partner ID"
                    value={formData.partnerId}
                    onChange={handleInputChange}
                    error={!!errors.partnerId}
                    variant="outlined"
                  />
                  {errors.partnerId && <ErrorText>{errors.partnerId}</ErrorText>}
                </InputGroup>
              </NameRow>

              <InputGroup>
                <FormControl variant="outlined" fullWidth>
                  <StyledSelect
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    error={!!errors.preferredLanguage}
                  >
                    {languages.map(language => (
                      <MenuItem key={language} value={language}>{language}</MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
                {errors.preferredLanguage && <ErrorText>{errors.preferredLanguage}</ErrorText>}
              </InputGroup>

              {errors.submit && (
                <ErrorText style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {errors.submit}
                </ErrorText>
              )}

              <SignUpButton
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </SignUpButton>
            </Form>

            <LinkContainer>
              <Typography component="span">Already have an account? </Typography>
              <StyledLink to={`/${parseUrlParams().tenant}/Login?theme=${currentTheme}&locale=${currentLocale}`}>
                Sign In
              </StyledLink>
            </LinkContainer>
            </FormContainer>
          </LoginContent>
        </Box>
      </LoginSide>
      <ImageSide
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
          backgroundColor: backgroundImageUrl ? 'transparent' : '#f5f5f5'
        }}
      >
        <Box style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          opacity: 0.48,
          background: backgroundImageUrl
            ? 'linear-gradient(60deg, rgba(211, 212, 220, 0.70) 19.78%, rgba(0, 12, 77, 0.70) 88.11%)'
            : `linear-gradient(45deg, ${loginConfig?.primaryColor || '#e53935'} 0%, ${loginConfig?.secondaryColor || loginConfig?.primaryColor || '#d32f2f'} 100%)`
        }}></Box>
      </ImageSide>
    </PageContainer>
  );
};

export default SignUpPage;
