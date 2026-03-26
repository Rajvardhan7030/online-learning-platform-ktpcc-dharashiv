document.addEventListener("DOMContentLoaded", () => {
    const statusIcon = document.getElementById("status-icon");
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");
    const loginBtn = document.getElementById("login-btn");
    const verifyForm = document.getElementById("verify-form");
    const verifyCodeInput = document.getElementById("verify-code");
    const resendBtn = document.getElementById("resend-btn");
    const resendTimer = document.getElementById("resend-timer");
    const resendContainer = document.getElementById("resend-container");

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (!email) {
        statusIcon.className = "fas fa-times-circle error-icon";
        statusTitle.textContent = "Verification Error";
        statusMessage.textContent = "Email address missing from the URL. Please register again.";
        verifyForm.style.display = "none";
        resendContainer.style.display = "none";
        return;
    }

    // Timer logic for resend button
    let cooldownTimer = 0;
    const startCooldown = (seconds) => {
        cooldownTimer = seconds;
        resendBtn.disabled = true;
        resendBtn.style.color = "#999";
        resendBtn.style.cursor = "not-allowed";
        resendTimer.style.display = "block";
        
        const interval = setInterval(() => {
            cooldownTimer--;
            resendTimer.textContent = `Wait ${cooldownTimer}s before resending`;
            
            if (cooldownTimer <= 0) {
                clearInterval(interval);
                resendBtn.disabled = false;
                resendBtn.style.color = "#6C63FF";
                resendBtn.style.cursor = "pointer";
                resendTimer.style.display = "none";
            }
        }, 1000);
    };

    // Resend OTP handler
    resendBtn.addEventListener("click", async () => {
        try {
            resendBtn.disabled = true;
            resendBtn.textContent = "Sending...";

            const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert("New verification code sent to your email!");
                startCooldown(60); // 1 minute cooldown
            } else if (response.status === 429) {
                // If backend says wait, extract time or just set default
                const message = data.message || "";
                const secondsMatch = message.match(/\d+/);
                const seconds = secondsMatch ? parseInt(secondsMatch[0]) : 60;
                startCooldown(seconds);
                alert(data.message);
            } else {
                alert(data.message || "Failed to resend code.");
            }
        } catch (error) {
            console.error("Resend error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            resendBtn.textContent = "Resend Code";
            if (cooldownTimer <= 0) {
                resendBtn.disabled = false;
            }
        }
    });

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
                resendContainer.style.display = "none";
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