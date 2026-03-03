// ==========================================
// Form Submission & API Connection Logic
// ==========================================
const BACKEND_URL = API_BASE_URL;

// 1. Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration Successful! Please sign in with your new account.');
            e.target.reset(); 
            toggleFlip(); 
        } else {
            // Display backend validation errors cleanly
            if (result.errors && result.errors.length > 0) {
                const errorMessages = result.errors.map(err => err.msg).join('\n');
                alert('Registration failed:\n' + errorMessages);
            } else {
                alert('Registration failed: ' + (result.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server.');
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

        if (response.ok) {
            localStorage.setItem('ide_user', JSON.stringify(result));
            window.location.href = '/index.html';
        } else {
            // Display backend validation errors cleanly
            if (result.errors && result.errors.length > 0) {
                const errorMessages = result.errors.map(err => err.msg).join('\n');
                alert('Login failed:\n' + errorMessages);
            } else {
                alert('Login failed: ' + (result.message || 'Invalid credentials'));
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server. Is your Node backend running?');
    }
});