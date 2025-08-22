// Cookie service for handling authentication tokens
class CookieService {
    static TOKEN_KEY = 'auth_token';
    static USER_INFO_KEY = 'user_info';

    /**
     * Set a cookie with optional configuration
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {Object} options - Cookie options
     */
    static setCookie(name, value, options = {}) {
        const {
            maxAge = 60 * 60 * 24, // 1 day default
            path = '/',
            secure = window.location.protocol === 'https:',
            sameSite = 'Lax'
        } = options;

        let cookieString = `${name}=${encodeURIComponent(value)}`;
        cookieString += `; max-age=${maxAge}`;
        cookieString += `; path=${path}`;
        if (secure) cookieString += '; secure';
        cookieString += `; samesite=${sameSite}`;

        document.cookie = cookieString;
    }

    /**
     * Get a cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    static getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(s => s.trim());
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    static deleteCookie(name) {
        this.setCookie(name, '', { maxAge: 0 });
    }

    /**
     * Get authentication token
     * @returns {string|null} Auth token or null
     */
    static getToken() {
        return this.getCookie(this.TOKEN_KEY);
    }

    /**
     * Set authentication token
     * @param {string} token - Auth token
     * @param {Object} options - Cookie options
     */
    static setToken(token, options = {}) {
        this.setCookie(this.TOKEN_KEY, token, options);
        // Also store in localStorage for easier access
        try {
            localStorage.setItem(this.TOKEN_KEY, token);
        } catch (error) {
            console.warn('Failed to store token in localStorage:', error);
        }
    }

    /**
     * Get user info - attempts to get from localStorage first, then from cookie
     * @returns {Object|null} User info object or null
     */
    static getUserInfo() {
        // Try localStorage first (for full user data)
        try {
            const localUserInfo = localStorage.getItem(this.USER_INFO_KEY);
            if (localUserInfo) {
                return JSON.parse(localUserInfo);
            }
        } catch (error) {
            console.warn('Failed to parse user info from localStorage:', error);
        }

        // Fallback to cookie (contains only essential data)
        const userInfoStr = this.getCookie(this.USER_INFO_KEY);
        if (userInfoStr) {
            try {
                return JSON.parse(userInfoStr);
            } catch (error) {
                console.error('Failed to parse user info from cookie:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Extract essential user data for cookie storage
     * @param {Object} userInfo - Full user info object
     * @returns {Object} Essential user data
     */
    static extractEssentialUserData(userInfo) {
        if (!userInfo) return null;

        return {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            tenantId: userInfo.tenantId,
            tenantName: userInfo.tenantName,
            // Include basic tenant info without large arrays
            tenant: userInfo.tenant ? {
                id: userInfo.tenant.id,
                name: userInfo.tenant.name,
                status: userInfo.tenant.status,
                subscription_plan: userInfo.tenant.subscription_plan
            } : null
        };
    }

    /**
     * Set user info - stores essential data in cookie and full data in localStorage
     * @param {Object} userInfo - User info object
     * @param {Object} options - Cookie options
     */
    static setUserInfo(userInfo, options = {}) {
        if (!userInfo) return;

        // Store full user data in localStorage
        try {
            localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
        } catch (error) {
            console.warn('Failed to store full user info in localStorage:', error);
        }

        // Store only essential data in cookie to avoid size limits
        const essentialData = this.extractEssentialUserData(userInfo);
        if (essentialData) {
            this.setCookie(this.USER_INFO_KEY, JSON.stringify(essentialData), options);
        }
    }

    /**
     * Clear all authentication data from both cookies and localStorage
     */
    static clearAuth() {
        this.deleteCookie(this.TOKEN_KEY);
        this.deleteCookie(this.USER_INFO_KEY);
        // Also clear from localStorage
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_INFO_KEY);
            // Clear tenant-related localStorage items as well
            localStorage.removeItem('mh_tenant');
            localStorage.removeItem('mh_default_redirect');
            localStorage.removeItem('mh_default_admin_redirect');
        } catch (error) {
            console.warn('Failed to clear auth data from localStorage:', error);
        }
    }

    /**
     * Get full user info (including subApplications) from localStorage
     * @returns {Object|null} Full user info object or null
     */
    static getFullUserInfo() {
        try {
            const localUserInfo = localStorage.getItem(this.USER_INFO_KEY);
            if (localUserInfo) {
                return JSON.parse(localUserInfo);
            }
        } catch (error) {
            console.warn('Failed to parse full user info from localStorage:', error);
        }
        return null;
    }
}

export default CookieService;
