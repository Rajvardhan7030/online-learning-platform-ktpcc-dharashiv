/**
 * Settings Page JavaScript - E-Learn Platform
 * Fully Wired to Node.js Backend
 */

const BACKEND_URL = API_BASE_URL; // Comes from config.js
let currentOpenSetting = null;

// Helper function to get the user's token for secure requests
function getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('ide_user'));
    if (!user || !user.token) {
        window.location.href = '/public/html/auth.html'; // Kick them out if not logged in
        return null;
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };
}

function toggleSetting(settingName) {
    const section = document.getElementById(settingName + '-section');
    const container = document.getElementById(settingName + '-form-container');
    
    if (currentOpenSetting === settingName) return closeSetting(settingName);
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
            if (settingName === 'username') {
                const user = JSON.parse(localStorage.getItem('ide_user')) || {};
                if (user.username) document.getElementById('current-username').value = user.username;
            }
            const passwordInputs = form.querySelectorAll('input[type="text"]');
            passwordInputs.forEach(input => { if (input.id.includes('password')) input.type = 'password'; });
            const toggleButtons = form.querySelectorAll('.toggle-password i');
            toggleButtons.forEach(icon => icon.className = 'fas fa-eye');
        }
    }, 400);
    
    if (currentOpenSetting === settingName) currentOpenSetting = null;
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-password i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
    input.focus();
}

// ==========================================
// 1. REAL API CALL: Update Username
// ==========================================
async function updateUsername(event) {
    event.preventDefault();
    const newUsername = document.getElementById('new-username').value.trim();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!newUsername) return showToast('Please enter a valid username', 'error');
    
    setButtonLoading(submitBtn, true, '<i class="fas fa-save"></i> Save Changes');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/update-username`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ username: newUsername })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Update local storage with the new data the server sent back
            localStorage.setItem('ide_user', JSON.stringify(result));
            
            // Update the UI
            const displayNameEl = document.getElementById('display-name');
            if (displayNameEl) displayNameEl.textContent = result.username;
            document.getElementById('current-username').value = result.username;
            
            showToast('Username updated successfully!', 'success');
            closeSetting('username');
        } else {
            showToast(result.message || 'Failed to update username', 'error');
        }
    } catch (error) {
        showToast('Server error. Please try again.', 'error');
    } finally {
        setButtonLoading(submitBtn, false, '<i class="fas fa-save"></i> Save Changes');
    }
}

// ==========================================
// 2. REAL API CALL: Update Password
// ==========================================
async function updatePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!currentPassword || !newPassword || !confirmPassword) return showToast('Please fill in all password fields', 'error');
    if (newPassword.length < 6) return showToast('New password must be at least 6 characters', 'error');
    if (newPassword !== confirmPassword) return showToast('New passwords do not match', 'error');
    
    setButtonLoading(submitBtn, true, '<i class="fas fa-key"></i> Update Password');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/update-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Password updated successfully!', 'success');
            closeSetting('password');
        } else {
            showToast(result.message || 'Failed to update password', 'error');
        }
    } catch (error) {
        showToast('Server error. Please try again.', 'error');
    } finally {
        setButtonLoading(submitBtn, false, '<i class="fas fa-key"></i> Update Password');
    }
}

// ==========================================
// 3. REAL API CALL: Delete Account
// ==========================================
async function deleteAccount(event) {
    event.preventDefault();
    const password = document.getElementById('delete-password').value;
    const confirmChecked = document.getElementById('confirm-delete').checked;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!password) return showToast('Please enter your password', 'error');
    if (!confirmChecked) return showToast('Please confirm deletion', 'error');
    
    submitBtn.innerHTML = '<div class="spinner"></div> Deleting...';
    submitBtn.classList.add('loading');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/delete-account`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.removeItem('ide_user');
            showToast('Account deleted. Redirecting...', 'error');
            setTimeout(() => window.location.href = '/index.html', 1500);
        } else {
            showToast(result.message || 'Failed to delete account', 'error');
            submitBtn.innerHTML = '<i class="fas fa-trash"></i> Delete My Account';
            submitBtn.classList.remove('loading');
        }
    } catch (error) {
        showToast('Server error. Please try again.', 'error');
        submitBtn.innerHTML = '<i class="fas fa-trash"></i> Delete My Account';
        submitBtn.classList.remove('loading');
    }
}

// Utility Functions
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
    
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('ide_user')) || {};
    if (user.username) {
        const currentUsernameInput = document.getElementById('current-username');
        if (currentUsernameInput) currentUsernameInput.value = user.username;
    }
});