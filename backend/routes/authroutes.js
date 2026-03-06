const express = require('express');
const { body } = require('express-validator');

// Import all our controller functions
const { 
    registerUser, 
    loginUser, 
    updateUsername, 
    updatePassword, 
    deleteAccount 
} = require('../controllers/authcontroller.js');

// Import the middleware to protect our settings routes
const { protect } = require('../middleware/authmiddleware.js');

const router = express.Router();

// ==========================================
// Public Routes (No Token Needed)
// ==========================================
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// ==========================================
// Private Routes (Requires JWT Token)
// ==========================================
router.put('/update-username', protect, updateUsername);
router.put('/update-password', protect, updatePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;