// ==========================================
        // Form Submission & API Connection Logic
        // ==========================================
        const BACKEND_URL = 'http://localhost:5000'; // Change 5000 if your Node server uses a different port

   // 1. Handle Registration (Flip to Login on Success)
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // 1. Tell the user it worked!
                    alert('Registration Successful! Please sign in with your new account.');
                    
                    // 2. Clear out the fields they just typed in
                    e.target.reset(); 
                    
                    // 3. Trigger your awesome 3D flip animation to show the Login form
                    toggleFlip(); 
                } else {
                    alert('Registration failed: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Could not connect to the server.');
            }
        });

        // 2. Handle Login
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the page from reloading
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success! Save the user data to localStorage so the navbar recognizes them
                    localStorage.setItem('ide_user', JSON.stringify(result));
                    
                    // Redirect back to the homepage
                    window.location.href = '/index.html';
                } else {
                    alert('Login failed: ' + (result.message || 'Invalid credentials'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Could not connect to the server. Is your Node backend running?');
            }
        });
