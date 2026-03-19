document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const statusMessage = document.getElementById('status-message');
    const submitBtn = e.target.querySelector('button');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusMessage.className = 'message-box';
    statusMessage.textContent = '';

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            statusMessage.textContent = "A 6-digit reset code has been sent to your email. Redirecting...";
            statusMessage.className = 'message-box message-success';
            document.getElementById('email').value = '';
            
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                window.location.href = 'reset-password.html';
            }, 2000);
        } else {
            statusMessage.textContent = data.message || "Failed to send reset link.";
            statusMessage.className = 'message-box message-error';
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        statusMessage.textContent = "An network error occurred. Please try again.";
        statusMessage.className = 'message-box message-error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
});