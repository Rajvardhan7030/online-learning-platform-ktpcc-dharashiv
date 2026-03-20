const express = require('express');
const { body } = require('express-validator');

// Import all our controller functions
const { 
    registerUser, 
    loginUser, 
    updateUsername, 
    updatePassword, 
    deleteAccount,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProgress,
    getProgress
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

const updateUsernameValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
];

const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

const deleteAccountValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required to delete account')
];

const updateProgressValidation = [
    body('course')
        .isIn(['htmlcss', 'javascript', 'python'])
        .withMessage('Invalid course name'),
    body('topic')
        .notEmpty()
        .withMessage('Topic is required')
];

const resetPasswordValidation = [
    body('code')
        .notEmpty()
        .withMessage('Reset code is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// ==========================================
// Private Routes (Requires JWT Token)
// ==========================================
router.put('/update-username', protect, updateUsernameValidation, updateUsername);
router.put('/update-password', protect, updatePasswordValidation, updatePassword);
router.delete('/delete-account', protect, deleteAccountValidation, deleteAccount);
router.post('/update-progress', protect, updateProgressValidation, updateProgress);
router.get('/progress', protect, getProgress);

module.exports = router;