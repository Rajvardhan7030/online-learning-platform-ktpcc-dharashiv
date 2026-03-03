// API Configuration
const hostname = window.location.hostname;

// Check if we are running locally via localhost or Live Server (127.0.0.1)
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

const API_BASE_URL = isLocal 
    ? 'http://127.0.0.1:5000' // Make sure your Node server is actually on port 5000
    : 'https://your-production-api.com'; // Change this for production

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
