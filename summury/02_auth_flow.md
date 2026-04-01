# User Data Flow: The Login Process

## Step-by-Step Logic
1. **User Interaction:** The user enters their email and password into `auth.html`.
2. **Frontend Trigger (auth.js):** The `login()` function intercepts the form submission. It uses `fetch()` to send a `POST` request to `http://localhost:5000/api/auth/login`.
3. **Backend Routing (authroutes.js):** The request lands on the `/login` route, which first runs validation middleware to ensure the email is valid.
4. **Controller Logic (authcontroller.js):**
   - The `login` function finds the user in MongoDB.
   - It compares the entered password with the hashed password stored in the database.
   - If they match, it generates a **JWT (JSON Web Token)** using a secret key.
5. **Success Response:** The backend returns the user's data and the JWT to the browser.
6. **Frontend Persistence:** `auth.js` receives the token and saves it to `localStorage` under the key `ide_user`. This allows the user to stay logged in across all pages.
7. **The Auth Bridge:** When the user clicks "Open IDE", the main site passes the token to the React IDE via the URL (`?auth=...`). The IDE reads this, validates it, and logs the user in automatically.

## Security Features
- **Passwords are never stored in plain text:** We use `bcrypt` to hash them.
- **Protected Routes:** Only users with a valid JWT in their `Authorization` header can access the dashboard or save code.
