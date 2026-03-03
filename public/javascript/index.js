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
    
 // 1. Load User Data & Toggle UI State
    document.addEventListener("DOMContentLoaded", () => {
        const userDataString = localStorage.getItem('ide_user'); 
        const authButtons = document.getElementById('auth-buttons');
        const profileMenu = document.getElementById('profile-menu');
        
        if (userDataString) {
            // USER IS LOGGED IN: Hide buttons, show profile
            authButtons.style.display = 'none';
            profileMenu.style.display = 'inline-block';
            
            try {
                const userData = JSON.parse(userDataString);
                if (userData.username) {
                    document.getElementById('display-name').textContent = userData.username;
                }
                if (userData.email) {
                    document.getElementById('display-email').textContent = userData.email;
                }
            } catch (error) {
                console.error("Could not parse user data.");
            }
        } else {
            // USER IS LOGGED OUT: Show buttons, hide profile
            authButtons.style.display = 'block';
            profileMenu.style.display = 'none';
        }
    });

    // 2. The Logout Function
    function logout() {
        if(confirm("Are you sure you want to log out?")) {
            // Delete the authentication token from memory
            localStorage.removeItem('ide_user');
            
            // Redirect them back to the main homepage (adjust the path if needed)
            window.location.href = '/index.html'; 
        }
    }
    // ==========================================
    // IDE Bridge Logic (Global)
    // ==========================================
    function openIDE(event) {
        event.preventDefault(); 
        
        // Grab the MongoDB user token we saved during login/signup
        const userData = localStorage.getItem('ide_user');
        
        if (userData) {
            // If logged in, encode the data and send it to the React port
            const encodedData = encodeURIComponent(userData);
            window.open(`http://localhost:3000/?auth=${encodedData}`, '_blank');
        } else {
            // If logged out, just open the IDE normally
            window.open('http://localhost:3000', '_blank');
        }
    }