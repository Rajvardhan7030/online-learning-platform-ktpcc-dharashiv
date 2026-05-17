// ==========================================
// Form Submission & API Connection Logic
// ==========================================
const BACKEND_URL = API_BASE_URL;

/**
 * Utility to display errors clearly to the user.
 */
const showError = (message) => {
    const isFlipped = document.getElementById('flip-container').classList.contains('flipped');
    const errorDiv = isFlipped ? document.getElementById('register-error') : document.getElementById('login-error');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert('Error: ' + message);
    }
};

// 1. Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Visual Feedback: Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing Up...';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Trim email to prevent validation failures from trailing spaces
    if (data.email) data.email = data.email.trim();

    // Password Matching Validation
    if (data.password !== data.confirmPassword) {
        showError('Passwords do not match!');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
    }

    // CRITICAL FIX: Remove confirmPassword before sending to backend
    // Backend validator only accepts: username, email, password
    const { confirmPassword, ...requestData } = data;

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)  // Send cleaned data without confirmPassword
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert('Registration Successful! ' + result.message);
            // Redirect to verification page
            window.location.href = `/html/verify.html?email=${encodeURIComponent(requestData.email)}`;
        } else {
            // Re-enable button on failure
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Handle validation errors array from express-validator
            if (result.errors && Array.isArray(result.errors)) {
                const errorMessages = result.errors.map(err => err.msg).join('\n');
                showError(errorMessages);
            } else {
                showError(result.message || 'Registration failed');
            }
        }
    } catch (error) {
        // Re-enable button on error
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        console.error('Registration Error:', error);
        showError('Could not connect to the server. Please ensure the backend is running.');
    }
});

// 2. Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Visual Feedback: Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Trim email to prevent validation failures from trailing spaces
    if (data.email) data.email = data.email.trim();

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
            // Re-enable button on failure
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;

            // Handle validation errors array
            if (result.errors && Array.isArray(result.errors)) {
                const errorMessages = result.errors.map(err => err.msg).join('\n');
                showError(errorMessages);
            } else {
                showError(result.message || 'Invalid credentials');
            }
        }
    } catch (error) {
        // Re-enable button on error
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        console.error('Login Error:', error);
        showError('Could not connect to the server.');
    }
});