document.addEventListener("DOMContentLoaded", async () => {
    const statusIcon = document.getElementById("status-icon");
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");
    const loginBtn = document.getElementById("login-btn");

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        statusIcon.className = "fas fa-times-circle error-icon";
        statusTitle.textContent = "Verification Failed";
        statusMessage.textContent = "No verification token found in the URL.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            statusIcon.className = "fas fa-check-circle success-icon";
            statusTitle.textContent = "Email Verified!";
            statusMessage.textContent = "Your email has been successfully verified. You can now log in to your account.";
            loginBtn.style.display = "inline-block";
        } else {
            statusIcon.className = "fas fa-times-circle error-icon";
            statusTitle.textContent = "Verification Failed";
            statusMessage.textContent = data.message || "Failed to verify email. The link may be invalid or expired.";
        }
    } catch (error) {
        console.error("Verification error:", error);
        statusIcon.className = "fas fa-times-circle error-icon";
        statusTitle.textContent = "Error";
        statusMessage.textContent = "An error occurred during verification. Please try again later.";
    }
});