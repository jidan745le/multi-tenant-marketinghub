import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useThemeContext } from '../contexts/ThemeContext';

// 自定义useTheme hook
export const useTheme = () => {
    const theme = useMuiTheme();
    const setThemeName = useThemeContext();

    return {
        theme,
        setThemeName,
        currentBrand: theme.brand?.name || 'kendo',
        brandLogo: theme.brand?.logo,
        primaryColor: theme.palette.primary.main,
        secondaryColor: theme.palette.secondary.main,
    };
};

export default useTheme; 