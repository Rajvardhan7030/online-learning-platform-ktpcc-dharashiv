document.addEventListener("DOMContentLoaded", () => {
    const statusIcon = document.getElementById("status-icon");
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");
    const loginBtn = document.getElementById("login-btn");
    const verifyForm = document.getElementById("verify-form");
    const verifyCodeInput = document.getElementById("verify-code");

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (!email) {
        statusIcon.className = "fas fa-times-circle error-icon";
        statusTitle.textContent = "Verification Error";
        statusMessage.textContent = "Email address missing from the URL. Please register again.";
        verifyForm.style.display = "none";
        return;
    }

    verifyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const code = verifyCodeInput.value.trim();

        if (code.length !== 6) {
            alert("Please enter a valid 6-digit verification code.");
            return;
        }

        try {
            statusTitle.textContent = "Verifying Code...";
            statusIcon.className = "fas fa-spinner fa-spin success-icon";
            statusIcon.style.color = "#6C63FF";

            const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (response.ok) {
                statusIcon.className = "fas fa-check-circle success-icon";
                statusIcon.style.color = "#4CAF50";
                statusTitle.textContent = "Email Verified!";
                statusMessage.textContent = data.message || "Your email has been successfully verified. You can now log in to your account.";
                verifyForm.style.display = "none";
                loginBtn.style.display = "inline-block";
            } else {
                statusIcon.className = "fas fa-envelope-open-text success-icon";
                statusIcon.style.color = "#6C63FF";
                statusTitle.textContent = "Verification Failed";
                statusMessage.textContent = data.message || "Failed to verify email. The code may be invalid or expired.";
                alert(data.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            statusIcon.className = "fas fa-times-circle error-icon";
            statusIcon.style.color = "#f44336";
            statusTitle.textContent = "Error";
            statusMessage.textContent = "An error occurred during verification. Please try again later.";
        }
    });
});