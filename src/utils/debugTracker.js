// Debug tracking utility for login flow
class DebugTracker {
    static logs = [];
    static maxLogs = 50;

    static log(step, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            step,
            data,
            url: window.location.href
        };

        this.logs.push(logEntry);

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        console.log(`🔍 [${timestamp}] ${step}:`, data);

        // Store in sessionStorage for debugging
        try {
            sessionStorage.setItem('auth_debug_logs', JSON.stringify(this.logs));
        } catch (e) {
            // Ignore storage errors
        }
    }

    static getLogs() {
        return this.logs;
    }

    static clearLogs() {
        this.logs = [];
        sessionStorage.removeItem('auth_debug_logs');
    }

    static exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
    window.DebugTracker = DebugTracker;
}

export default DebugTracker;
