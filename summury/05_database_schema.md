# Database Schema: The Storage Layer

## MongoDB & Mongoose
CodeLearn uses MongoDB, a NoSQL database. This is ideal for e-learning because it's flexible and allows us to store code snippets and user profiles as JSON-like documents.

## Mongoose Models
1. **User Model (user.js):**
   - `username`: A unique name for the student.
   - `email`: Used for login and account verification.
   - `password`: Stored as a hashed string for security.
   - `isVerified`: A boolean flag to track if the user has confirmed their email.
   - `resetPasswordToken`: A temporary token for the "Forgot Password" feature.

2. **Snippet Model (snippet.js):**
   - `title`: The name of the code project.
   - `code`: The actual code content (HTML, CSS, or JS).
   - `language`: The programming language used.
   - `user`: A reference (foreign key) to the User ID who created the snippet.
   - `createdAt`: An automatic timestamp.

## Relational Logic
Even though MongoDB is NoSQL, we use **Mongoose References** to link snippets to users. This allows us to query "Find all snippets created by User X."
