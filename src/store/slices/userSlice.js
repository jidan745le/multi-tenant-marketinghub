import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    permissions: [],
    roles: [],
    isAuthenticated: false,
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUserData: (state, action) => {
            const { user, permissions, roles } = action.payload;
            state.user = user;
            state.permissions = permissions || [];
            state.roles = roles || [];
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        clearUserData: (state) => {
            state.user = null;
            state.permissions = [];
            state.roles = [];
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        setUserError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    setUserLoading,
    setUserData,
    clearUserData,
    setUserError
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectUserPermissions = (state) => state.user.permissions;
export const selectUserRoles = (state) => state.user.roles;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

// Permission checkers
export const selectHasPermission = (state, permissionCode) => {
    return state.user.permissions.includes(permissionCode);
};

export const selectHasAnyPermission = (state, permissionCodes) => {
    return permissionCodes.some(code => state.user.permissions.includes(code));
};

// Check for required permissions to access main app
export const selectCanAccessMainApp = (state) => {
    const requiredPermissions = [
        'marketinghub:theme:kendo',
        'marketinghub:theme:bosch',
        'marketinghub:system:admin'
    ];
    return selectHasAnyPermission(state, requiredPermissions);
};

export default userSlice.reducer;
