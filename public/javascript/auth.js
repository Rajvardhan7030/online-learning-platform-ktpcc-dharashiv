// ==========================================
// Form Submission & API Connection Logic
// ==========================================
const BACKEND_URL = API_BASE_URL;

/**
 * Utility to display errors clearly to the user.
 */
const showError = (message) => {
    alert('Error: ' + message);
};

// 1. Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Password Matching Validation
    if (data.password !== data.confirmPassword) {
        showError('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert('Registration Successful! ' + result.message);
            // Redirect to verification page
            window.location.href = `/public/html/verify.html?email=${encodeURIComponent(data.email)}`;
        } else {
            showError(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration Error:', error);
        showError('Could not connect to the server. Please ensure the backend is running.');
    }
});

// 2. Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            // Store user data excluding status
            const { status, ...userData } = result;
            localStorage.setItem('ide_user', JSON.stringify(userData));

            // Redirect to dashboard or home
            window.location.href = '../../index.html';
        } else {
            showError(result.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Login Error:', error);
        showError('Could not connect to the server.');
    }
});