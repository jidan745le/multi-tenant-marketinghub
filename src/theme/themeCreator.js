import { createTheme } from '@mui/material/styles';

// 品牌主题配置
const brandThemes = {
    'kendo-china': {
        primaryColor: '#ff6600',
        secondaryColor: '#003366',
        logo: '/logos/kendo-china-logo.png'
    },
    'saame-oem-bosch': {
        primaryColor: '#0066cc',
        secondaryColor: '#003366',
        logo: '/logos/bosch-logo.png'
    },
    'saame-oem-general': {
        primaryColor: '#666666',
        secondaryColor: '#333333',
        logo: '/logos/general-logo.png'
    }
};

// 创建主题的函数
const themeCreator = (brandCode) => {
    console.log('themeCreator: Creating theme for brand:', brandCode);
    console.log('themeCreator: Available brands:', Object.keys(brandThemes));

    // 获取品牌主题配置，如果没有找到则使用默认
    const brandTheme = brandThemes[brandCode] || brandThemes['kendo-china'];

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
            button: {
                fontFamily: '"Roboto-Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
        },
        // 添加自定义品牌信息
        brand: {
            logo: brandTheme.logo,
            name: brandCode
        }
    });
};

export default themeCreator; 