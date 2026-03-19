// Profile Dropdown Toggle
    function toggleDropdown() {
        document.getElementById("profileDropdown").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.closest('.nav-profile')) {
            var dropdowns = document.getElementsByClassName("profile-dropdown");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    // ==========================================
    // Profile Data & Logout Logic
    // ==========================================
    
// 1. Load User Data & Auto-Redirect
document.addEventListener("DOMContentLoaded", () => {
    const userDataString = localStorage.getItem('ide_user'); 
    const currentPath = window.location.pathname;
    
    // Check if the user is exactly on the root or index.html page
    const isWelcomePage = currentPath === '/' || currentPath.endsWith('index.html');
    
    if (userDataString) {
        // ONLY redirect if they are on the welcome page. Let them browse tutorials freely!
        if (isWelcomePage) {
            window.location.href = 'public/html/dashboard.html';
            return; // Stop execution so it redirects cleanly
        }
        
        // For all other pages (Dashboard, Tutorial): Show profile menu, hide auth buttons
        const authButtons = document.getElementById('auth-buttons');
        const profileMenu = document.getElementById('profile-menu');
        
        if (authButtons && profileMenu) {
            authButtons.style.display = 'none';
            profileMenu.style.display = 'inline-block';
            
            try {
                const userData = JSON.parse(userDataString);
                if (userData.username) document.getElementById('display-name').textContent = userData.username;
                if (userData.email) document.getElementById('display-email').textContent = userData.email;
            } catch (error) {
                console.error("Could not parse user data.");
            }
        }
        return; 
    } 
    
    // USER IS LOGGED OUT: Ensure Auth buttons are visible
    const authButtons = document.getElementById('auth-buttons');
    const profileMenu = document.getElementById('profile-menu');
    
    if (authButtons && profileMenu) {
        authButtons.style.display = 'block';
        profileMenu.style.display = 'none';
    }
});
    // 2. The Logout Function
    function logout() {
        if(confirm("Are you sure you want to log out?")) {
            // Delete the authentication token from memory
            localStorage.removeItem('ide_user');
            
            // Redirect them back to the main homepage
            // We use the location of this script to determine how to get home
            const currentPath = window.location.pathname;
            if (currentPath.includes('/public/html/')) {
                window.location.href = '../../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    }
    // ==========================================
    // IDE Bridge Logic (Global)
    // ==========================================
    function openIDE(event) {
        event.preventDefault(); 

        // Use the base URL from config.js
        const ideUrl = typeof IDE_BASE_URL !== 'undefined' ? IDE_BASE_URL : 'http://127.0.0.1:3000';

        // Grab the MongoDB user token we saved during login/signup
        const userData = localStorage.getItem('ide_user');

        if (userData) {
            // If logged in, encode the data and send it to the React port
            const encodedData = encodeURIComponent(userData);
            window.open(`${ideUrl}/?auth=${encodedData}`, '_blank');
        } else {
            // If logged out, just open the IDE normally
            window.open(ideUrl, '_blank');
        }
    }