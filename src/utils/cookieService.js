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
    }

    /**
     * Get user info
     * @returns {Object|null} User info object or null
     */
    static getUserInfo() {
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
     * Set user info
     * @param {Object} userInfo - User info object
     * @param {Object} options - Cookie options
     */
    static setUserInfo(userInfo, options = {}) {
        this.setCookie(this.USER_INFO_KEY, JSON.stringify(userInfo), options);
    }

    /**
     * Clear all authentication data
     */
    static clearAuth() {
        this.deleteCookie(this.TOKEN_KEY);
        this.deleteCookie(this.USER_INFO_KEY);
    }
}

export default CookieService;
