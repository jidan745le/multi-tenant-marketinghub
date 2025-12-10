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
export const selectUser = (state) => {
  if (!state || !state.user) return null;
  return state.user.user || null;
};
export const selectUserPermissions = (state) => {
  if (!state || !state.user) return [];
  return state.user.permissions || [];
};
export const selectUserRoles = (state) => {
  if (!state || !state.user) return [];
  return state.user.roles || [];
};
export const selectIsAuthenticated = (state) => {
  if (!state || !state.user) return false;
  return state.user.isAuthenticated || false;
};
export const selectUserLoading = (state) => {
  if (!state || !state.user) return false;
  return state.user.loading || false;
};
export const selectUserError = (state) => {
  if (!state || !state.user) return null;
  return state.user.error || null;
};

// Permission checkers
export const selectHasPermission = (state, permissionCode) => {
    const permissions = state?.user?.permissions || [];
    return permissions.includes(permissionCode);
};

export const selectHasAnyPermission = (state, permissionCodes) => {
    const permissions = state?.user?.permissions || [];
    return permissionCodes.some(code => permissions.includes(code));
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
