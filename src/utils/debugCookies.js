// Debug utility for testing cookie and localStorage functionality
import CookieService from './cookieService';

class CookieDebugger {
    static testTokenStorage() {
        console.log('🧪 Testing token storage...');

        // Test token
        const testToken = 'test-token-12345-abcdef';

        // Clear first
        CookieService.clearAuth();
        console.log('1. Cleared auth data');

        // Save token
        CookieService.setToken(testToken);
        console.log('2. Saved test token:', testToken);

        // Read token
        const retrievedToken = CookieService.getToken();
        console.log('3. Retrieved token:', retrievedToken);

        // Check localStorage directly
        const lsToken = localStorage.getItem('auth_token');
        console.log('4. Direct localStorage read:', lsToken);

        // Check cookie directly
        const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
        console.log('5. Direct cookie read:', cookieToken);

        // Results
        const results = {
            testToken,
            retrievedToken,
            lsToken,
            cookieToken,
            tokenSaved: !!retrievedToken,
            tokenMatch: retrievedToken === testToken,
            lsMatch: lsToken === testToken
        };

        console.log('🧪 Test results:', results);
        return results;
    }

    static testUserInfoStorage() {
        console.log('🧪 Testing user info storage...');

        const testUser = {
            id: 123,
            email: 'test@example.com',
            name: 'Test User'
        };

        // Clear first
        CookieService.clearAuth();
        console.log('1. Cleared auth data');

        // Save user info
        CookieService.setUserInfo(testUser);
        console.log('2. Saved test user:', testUser);

        // Read user info
        const retrievedUser = CookieService.getUserInfo();
        console.log('3. Retrieved user:', retrievedUser);

        // Check localStorage directly
        const lsUser = localStorage.getItem('user_info');
        console.log('4. Direct localStorage read:', lsUser);

        // Results
        const results = {
            testUser,
            retrievedUser,
            lsUser: lsUser ? JSON.parse(lsUser) : null,
            userSaved: !!retrievedUser,
            emailMatch: retrievedUser?.email === testUser.email
        };

        console.log('🧪 Test results:', results);
        return results;
    }

    static runFullTest() {
        console.log('🧪 Running full cookie/localStorage test...');

        const tokenResults = this.testTokenStorage();
        const userResults = this.testUserInfoStorage();

        const overallResults = {
            tokenTest: tokenResults,
            userTest: userResults,
            allPassed: tokenResults.tokenMatch && userResults.emailMatch
        };

        console.log('🧪 Overall test results:', overallResults);
        return overallResults;
    }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
    window.CookieDebugger = CookieDebugger;
}

export default CookieDebugger;
