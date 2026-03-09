// API Configuration
const hostname = window.location.hostname;

// Check if we are running locally via localhost or Live Server (127.0.0.1)
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// Replace with your actual production URLs after deploying to Render/Vercel
const API_BASE_URL = isLocal 
    ? 'http://127.0.0.1:5000' 
    : 'https://codelearn-backend-rfqd.onrender.com'; // UPDATE THIS AFTER DEPLOYING BACKEND

const IDE_BASE_URL = isLocal
    ? 'http://localhost:3000'
    : 'https://code-learn-three.vercel.app'; // UPDATE THIS AFTER DEPLOYING IDE FRONTEND

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL, IDE_BASE_URL };
}
