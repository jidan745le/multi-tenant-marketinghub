import { createTheme } from '@mui/material/styles';

// 品牌主题配置 - 作为回退使用
const brandThemes = {
    'kendo': {
        primaryColor: '#ff6600',
        secondaryColor: '#003366',
        logo: '/logos/kendo-china-logo.png',
        favicon: '/favicon.ico'
    },
    'bosch': {
        primaryColor: '#666666',
        secondaryColor: '#333333',
        logo: '/logos/general-logo.png',
        favicon: '/favicon.ico'
    }
};

// 原始的静态主题创建函数 - 保留向后兼容性
const themeCreator = (brandCode) => {
    console.log('themeCreator: Creating theme for brand:', brandCode);
    console.log('themeCreator: Available brands:', Object.keys(brandThemes));

    // 获取品牌主题配置，如果没有找到则使用默认
    const brandTheme = brandThemes[brandCode] || brandThemes['kendo'];

    console.log('themeCreator: Selected brand theme:', brandTheme);

    return createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: brandTheme.primaryColor,
            },
            secondary: {
                main: brandTheme.secondaryColor,
            },
            background: {
                default: '#f5f5f5',
            },
        },
        typography: {
            fontFamily: '"Roboto-Regular", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h2: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h3: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h4: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h5: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h6: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                    @font-face {
                        font-family: 'Roboto-Regular';
                        src: url('./src/assets/fonts/Roboto-Regular.ttf') format('truetype');
                    }
                    @font-face {
                        font-family: 'Roboto-Medium';
                        src: url('./src/assets/fonts/Roboto-Medium.ttf') format('truetype');
                    }
                `,
            },
        },
    });
};

// 新的动态主题创建函数 - 使用API返回的主题色
export const createDynamicTheme = (brandCode, apiThemeColors = null, apiThemeLogo = null, apiFavicon = null, apiOnwhiteLogo = null, apiOncolorLogo = null, apiFallbackImage = null) => {
    console.log('🎨 createDynamicTheme: 品牌代码:', brandCode);
    console.log('🎨 createDynamicTheme: API主题色:', apiThemeColors);
    console.log('🎨 createDynamicTheme: API主题Logo:', apiThemeLogo);
    console.log('🎨 createDynamicTheme: API Favicon:', apiFavicon);
    console.log('🎨 createDynamicTheme: API Onwhite Logo:', apiOnwhiteLogo);
    console.log('🎨 createDynamicTheme: API Oncolor Logo:', apiOncolorLogo);
    console.log('🎨 createDynamicTheme: API Fallback Image:', apiFallbackImage);

    // 如果有API主题色，使用API数据；否则使用静态配置作为回退
    let primaryColor, secondaryColor, logoUrl, faviconUrl, onwhiteLogoUrl, oncolorLogoUrl, fallbackImageUrl;

    if (apiThemeColors && apiThemeColors.primary_color && apiThemeColors.secondary_color) {
        primaryColor = apiThemeColors.primary_color;
        secondaryColor = apiThemeColors.secondary_color;
        console.log('✨ 使用API动态主题色:', { primaryColor, secondaryColor });
    } else {
        // 回退到静态配置
        const fallbackTheme = brandThemes[brandCode] || brandThemes['kendo'];
        primaryColor = fallbackTheme.primaryColor;
        secondaryColor = fallbackTheme.secondaryColor;
        console.log('⚠️ 使用静态回退主题色:', { primaryColor, secondaryColor });
    }

    // 处理logo
    if (apiThemeLogo && apiThemeLogo.url) {
        logoUrl = apiThemeLogo.url;
        console.log('✨ 使用API动态Logo:', logoUrl);
    } else {
        // 回退到静态配置
        const fallbackTheme = brandThemes[brandCode] || brandThemes['kendo'];
        logoUrl = fallbackTheme.logo;
        console.log('⚠️ 使用静态回退Logo:', logoUrl);
    }

    // 处理favicon
    if (apiFavicon && apiFavicon.url) {
        faviconUrl = apiFavicon.url;
        console.log('✨ 使用API动态Favicon:', faviconUrl);
    } else {
        // 回退到静态配置
        const fallbackTheme = brandThemes[brandCode] || brandThemes['kendo'];
        faviconUrl = fallbackTheme.favicon;
        console.log('⚠️ 使用静态回退Favicon:', faviconUrl);
    }

    // 处理onwhite_logo
    if (apiOnwhiteLogo && apiOnwhiteLogo.url) {
        onwhiteLogoUrl = apiOnwhiteLogo.url;
        console.log('✨ 使用API动态Onwhite Logo:', onwhiteLogoUrl);
    } else {
        // 回退到静态配置
        onwhiteLogoUrl = '';
        console.log('⚠️ 没有Onwhite Logo数据');
    }

    // 处理oncolor_logo
    if (apiOncolorLogo && apiOncolorLogo.url) {
        oncolorLogoUrl = apiOncolorLogo.url;
        console.log('✨ 使用API动态Oncolor Logo:', oncolorLogoUrl);
    } else {
        // 回退到静态配置
        oncolorLogoUrl = '';
        console.log('⚠️ 没有Oncolor Logo数据');
    }

    // 处理fallback_image
    if (apiFallbackImage && apiFallbackImage.url) {
        fallbackImageUrl = apiFallbackImage.url;
        console.log('✨ 使用API动态Fallback Image:', fallbackImageUrl);
    } else {
        // 没有回退图片则设为空
        fallbackImageUrl = '';
        console.log('⚠️ 没有Fallback Image数据');
    }

    return createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            },
            background: {
                default: '#f5f5f5',
            },
        },
        typography: {
            fontFamily: '"Roboto-Regular", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h2: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h3: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h4: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h5: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
            h6: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: `
                    @font-face {
                        font-family: 'Roboto-Regular';
                        src: url('./src/assets/fonts/Roboto-Regular.ttf') format('truetype');
                    }
                    @font-face {
                        font-family: 'Roboto-Medium';
                        src: url('./src/assets/fonts/Roboto-Medium.ttf') format('truetype');
                    }
                `,
            },
        },
        // 添加品牌信息到主题中，方便其他组件访问
        brand: {
            code: brandCode,
            colors: apiThemeColors,
            logo: {
                url: logoUrl,
                data: apiThemeLogo
            },
            favicon: {
                url: faviconUrl,
                data: apiFavicon
            },
            onwhiteLogo: {
                url: onwhiteLogoUrl,
                data: apiOnwhiteLogo
            },
            oncolorLogo: {
                url: oncolorLogoUrl,
                data: apiOncolorLogo
            },
            fallbackImage: {
                url: fallbackImageUrl,
                data: apiFallbackImage
            },
            isFromAPI: !!(apiThemeColors || apiThemeLogo || apiFavicon || apiOnwhiteLogo || apiOncolorLogo || apiFallbackImage)
        }
    });
};

export default themeCreator; 