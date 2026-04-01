# Backend Architecture: The API Brain

## Core Technologies
- **Node.js:** The runtime environment.
- **Express.js:** The web framework for routing and middleware.
- **Mongoose:** The Object Data Modeling (ODM) library for MongoDB.

## File Structure & Responsibilities
- **server.js:** The application's entry point. It sets up middleware (cors, express.json), establishes the MongoDB connection, and defines the API routes.
- **models/ (user.js, snippet.js):** Defines the "shape" of our data. For example, the `User` model defines fields like `username`, `email`, and `password`.
- **routes/ (authroutes.js, coderoutes.js):** These are the URL entry points (e.g., `/api/auth/register`). They connect a URL to a specific controller function.
- **controllers/ (authcontroller.js, codeController.js):** This is where the actual business logic lives—like database queries, sending emails, or checking passwords.
- **middleware/ (authmiddleware.js):** The "security guard." It checks if the user's JWT is valid before allowing access to a route.
- **utils/ (errorResponse.js, asyncHandler.js):** Helper tools that keep our code clean and handle errors gracefully.

## Database Integration
The backend uses **Mongoose** to communicate with MongoDB. We use `async/await` for all database operations to ensure the server remains responsive while waiting for data.
