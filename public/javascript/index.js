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
    // === PART 1: Splash Screen & Hero Animation ===
    const splashOverlay = document.getElementById('splash-overlay');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const hasVisited = localStorage.getItem('codelearn_visited');

    if (hasVisited) {
        // Skip splash for returning users
        if (splashOverlay) splashOverlay.style.display = 'none';
        if (heroContent) heroContent.classList.add('hero-visible');
        if (heroImage) heroImage.classList.add('hero-visible');
    } else {
        // First visit: play splash sequence
        if (splashOverlay) {
            setTimeout(() => {
                splashOverlay.classList.add('splash-exit');
                
                setTimeout(() => {
                    splashOverlay.classList.add('splash-hidden');
                    
                    // Trigger hero entrance
                    if (heroContent) heroContent.classList.add('hero-visible');
                    if (heroImage) heroImage.classList.add('hero-visible');
                    
                    // Mark as visited
                    localStorage.setItem('codelearn_visited', 'true');
                }, 800); // Wait for fade-out
            }, 2500); // Show splash for 2.5s
        }
    }

    // === PART 2: Scroll Reveal System ===
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // === EXISTING AUTH LOGIC ===
    const userDataString = localStorage.getItem('ide_user'); 
    const currentPath = window.location.pathname;
    
    // Check if the user is exactly on the root or index.html page
    const isWelcomePage = currentPath === '/' || currentPath.endsWith('index.html');
    
    // Define protected pages that require login
    const protectedPages = ['tutorial.html', 'forum.html', 'dashboard.html', 'settings.html'];
    const isProtectedPage = protectedPages.some(page => currentPath.endsWith(page));

    if (userDataString) {
        // ONLY redirect if they are on the welcome page.
        if (isWelcomePage) {
            window.location.href = '/public/html/dashboard.html';
            return; // Stop execution so it redirects cleanly
        }
        
        // Show protected links for logged-in users
        document.querySelectorAll('.protected-link').forEach(link => {
            link.style.display = 'inline-block';
        });

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
    
    // USER IS LOGGED OUT: 
    
    // 1. Hide protected links from guests
    document.querySelectorAll('.protected-link').forEach(link => {
        link.style.display = 'none';
    });

    // 2. Guard Protected Pages: Redirect guests trying to access tutorials, forum, etc.
    if (isProtectedPage) {
        // Redirect to home if they hit a protected page while logged out
        if (currentPath.includes('/html/') || currentPath.includes('/public/html/')) {
            window.location.href = '../../index.html';
        } else {
            window.location.href = 'index.html';
        }
        return;
    }

    // Ensure Auth buttons are visible
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
            if (currentPath.includes('/html/') || currentPath.includes('/public/html/')) {
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
