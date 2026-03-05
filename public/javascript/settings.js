/**
 * Settings Page JavaScript - E-Learn Platform
 * Debugged and Optimized Version
 */

let currentOpenSetting = null;

function toggleSetting(settingName) {
    const section = document.getElementById(settingName + '-section');
    const container = document.getElementById(settingName + '-form-container');
    
    if (currentOpenSetting === settingName) {
        closeSetting(settingName);
        return;
    }
    
    if (currentOpenSetting) closeSetting(currentOpenSetting);
    
    section.classList.add('active');
    currentOpenSetting = settingName;
    
    setTimeout(() => {
        const firstInput = container.querySelector('input:not([disabled])');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeSetting(settingName) {
    const section = document.getElementById(settingName + '-section');
    const form = document.getElementById(settingName + '-form');
    
    section.classList.remove('active');
    
    setTimeout(() => {
        if (form) {
            form.reset();
            
            // FIX 1: Restore the active username after a form reset so it isn't lost!
            if (settingName === 'username') {
                const user = JSON.parse(localStorage.getItem('ide_user')) || {};
                if (user.username) {
                    document.getElementById('current-username').value = user.username;
                }
            }

            const passwordInputs = form.querySelectorAll('input[type="text"]');
            passwordInputs.forEach(input => {
                if (input.id.includes('password')) input.type = 'password';
            });

            const toggleButtons = form.querySelectorAll('.toggle-password i');
            toggleButtons.forEach(icon => icon.className = 'fas fa-eye');
        }
    }, 400);
    
    if (currentOpenSetting === settingName) currentOpenSetting = null;
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
    input.focus();
}

function updateUsername(event) {
    event.preventDefault();
    const newUsername = document.getElementById('new-username').value.trim();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!newUsername) return showToast('Please enter a valid username', 'error');
    
    setButtonLoading(submitBtn, true, '<i class="fas fa-save"></i> Save Changes');
    
    // Simulate API call (Ready to be replaced with real fetch soon)
    setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('ide_user')) || {};
        
        // FIX 2: Matched 'username' with your Node.js backend schema!
        user.username = newUsername; 
        localStorage.setItem('ide_user', JSON.stringify(user));
        
        const displayNameEl = document.getElementById('display-name');
        if (displayNameEl) displayNameEl.textContent = newUsername;
        
        document.getElementById('current-username').value = newUsername;
        
        setButtonLoading(submitBtn, false, '<i class="fas fa-save"></i> Save Changes');
        showToast('Username updated successfully!', 'success');
        closeSetting('username');
    }, 1000);
}

function updatePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!currentPassword || !newPassword || !confirmPassword) return showToast('Please fill in all password fields', 'error');
    if (newPassword.length < 6) return showToast('New password must be at least 6 characters', 'error'); // Fixed to match your authroutes.js schema!
    if (newPassword !== confirmPassword) return showToast('New passwords do not match', 'error');
    
    setButtonLoading(submitBtn, true, '<i class="fas fa-key"></i> Update Password');
    
    setTimeout(() => {
        setButtonLoading(submitBtn, false, '<i class="fas fa-key"></i> Update Password');
        showToast('Password updated successfully!', 'success');
        closeSetting('password');
    }, 1200);
}

function deleteAccount(event) {
    event.preventDefault();
    const password = document.getElementById('delete-password').value;
    const confirmChecked = document.getElementById('confirm-delete').checked;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!password) return showToast('Please enter your password', 'error');
    if (!confirmChecked) return showToast('Please confirm that you understand the consequences', 'error');
    
    submitBtn.innerHTML = '<div class="spinner"></div> Deleting...';
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        localStorage.removeItem('ide_user');
        showToast('Account deleted. Redirecting...', 'error');
        setTimeout(() => window.location.href = '/index.html', 2000);
    }, 2000);
}

function setButtonLoading(button, loading, originalHtml) {
    if (loading) {
        button.innerHTML = '<div class="spinner"></div> Saving...';
        button.classList.add('loading');
    } else {
        button.innerHTML = originalHtml;
        button.classList.remove('loading');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i><span class="toast-message">${message}</span>`;
    container.appendChild(toast);
    
    // FIX 3: Force browser to calculate layout before adding the class, making the slide animation perfectly smooth!
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('ide_user')) || {};
    
    // FIX 4: Use user.username instead of user.name
    if (user.username) {
        const currentUsernameInput = document.getElementById('current-username');
        if (currentUsernameInput) currentUsernameInput.value = user.username;
    }
});