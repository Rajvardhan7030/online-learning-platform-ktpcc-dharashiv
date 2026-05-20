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
    resendOTP,
    forgotPassword,
    resetPassword,
    updateProgress,
    getProgress
} = require('../controllers/authcontroller.js');

// Import the middleware to protect our settings routes
const { protect } = require('../middleware/authmiddleware.js');

const router = express.Router();

// ==========================================
// Public Routes (Do NOT require JWT Token for access)
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

const resendOTPValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
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

const verifyEmailValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
];

const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Reset code must be 6 digits'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

const updateProgressValidation = [
    body('course')
        .isIn(['htmlcss', 'javascript', 'python'])
        .withMessage('Invalid course name'),
    body('topic')
        .trim()
        .notEmpty()
        .withMessage('Topic is required')
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/resend-otp', resendOTPValidation, resendOTP);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// ==========================================
// Private Routes (Requires JWT Token)
// ==========================================
router.put('/update-username', protect, updateUsernameValidation, updateUsername);
router.put('/update-password', protect, updatePasswordValidation, updatePassword);
router.delete('/delete-account', protect, deleteAccountValidation, deleteAccount);
router.post('/update-progress', protect, updateProgressValidation, updateProgress);
router.post('/reset-progress', protect, (async (req, res) => {
    try {
        const User = require('../model/user.js');
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.progress = { htmlcss: [], javascript: [], python: [] };
        user.badges = [];
        user.examStats = {
            examsTaken: 0,
            highestScore: 0,
            upcomingExam: {
                title: 'Frontend Fundamentals Assessment',
                description: 'Timed practice exam covering HTML, CSS, and JavaScript basics.',
                status: 'planned'
            }
        };
        await user.save();
        res.status(200).json({ message: 'Progress reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}));
router.get('/progress', protect, getProgress);

module.exports = router;
