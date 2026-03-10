document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const statusMessage = document.getElementById('status-message');
    const submitBtn = e.target.querySelector('button');

    if (password !== confirmPassword) {
        statusMessage.textContent = "Passwords do not match.";
        statusMessage.className = 'message-box message-error';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        statusMessage.textContent = "Error: Invalid or missing token in URL.";
        statusMessage.className = 'message-box message-error';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Resetting...';
    statusMessage.className = 'message-box';
    statusMessage.textContent = '';

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            statusMessage.textContent = data.message || "Password reset successful.";
            statusMessage.className = 'message-box message-success';
            document.getElementById('reset-form').style.display = 'none';
            document.getElementById('login-link-container').style.display = 'block';
        } else {
            statusMessage.textContent = data.message || "Failed to reset password.";
            statusMessage.className = 'message-box message-error';
        }
    } catch (error) {
        console.error("Reset password error:", error);
        statusMessage.textContent = "An error occurred. Please try again.";
        statusMessage.className = 'message-box message-error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
});