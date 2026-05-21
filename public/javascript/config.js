// API Configuration
// Optional runtime override:
// <script>window.ELEARN_CONFIG = { API_BASE_URL: 'https://your-api.railway.app' }</script>
const runtimeConfig = window.ELEARN_CONFIG || {};
const hostname = window.location.hostname;

const isPrivate172 = /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
const isLocal = hostname === 'localhost' ||
                 hostname === '127.0.0.1' ||
                 hostname.startsWith('192.168.') ||
                 hostname.startsWith('10.') ||
                 isPrivate172;

const trimTrailingSlash = (url) => url.replace(/\/+$/, '');

const API_BASE_URL = trimTrailingSlash(runtimeConfig.API_BASE_URL || (
    isLocal ? 'http://127.0.0.1:5000' : 'https://api.e-learn.in'
));

const IDE_BASE_URL = trimTrailingSlash(runtimeConfig.IDE_BASE_URL || (
    isLocal ? 'http://localhost:3000' : 'https://ide.e-learn.in'
));

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL, IDE_BASE_URL };
}
