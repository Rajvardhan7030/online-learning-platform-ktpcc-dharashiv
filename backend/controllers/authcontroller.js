const User = require('../model/user.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        return next(new ErrorResponse('User already exists with this email or username', 400));
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = crypto.createHash('sha256').update(verificationCode).digest('hex');
    await user.save({ validateBeforeSave: false });

    const message = `
        <h1>Welcome to E-Learn!</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>Please enter this code on the verification page to complete your registration.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            html: message
        });

        res.status(201).json({
            status: 'success',
            message: 'Registration successful! Please check your email to verify your account.'
        });
    } catch (err) {
        // THE FIX: Delete the incomplete user record so they aren't permanently stuck 👇
        await User.findByIdAndDelete(user._id);
        return next(new ErrorResponse('Email could not be sent. Please try registering again.', 500));
    }
});

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
exports.loginUser = asyncHandler(async (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse('Invalid email or password', 401));
    }

    if (!user.isVerified) {
        return next(new ErrorResponse('Please verify your email to log in', 401));
    }

    res.json({
        status: 'success',
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
    });
});

// this setting controller logic

// @desc    Update username
// @route   PUT /api/auth/update-username
// @access  Private (Requires Token)
exports.updateUsername = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    user.username = req.body.username;
    await user.save();

    res.json({
        status: 'success',
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
    });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new ErrorResponse('Incorrect current password', 400));
    }

    user.password = req.body.newPassword;
    await user.save(); 

    res.json({ status: 'success', message: 'Password updated successfully' });
});

// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    const isMatch = await user.matchPassword(req.body.password);
    if (!isMatch) {
        return next(new ErrorResponse('Incorrect password. Deletion cancelled.', 400));
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ status: 'success', message: 'Account permanently deleted' });
});

// @desc    Verify Email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, code } = req.body;

        const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

        const user = await User.findOne({ 
            email,
            verificationToken: hashedToken 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

    const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.findOne({ 
        email,
        verificationToken: hashedToken 
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired verification code', 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', message: 'Email verified successfully. You can now log in.' });
});

// @desc    Update user progress
// @route   POST /api/auth/update-progress
exports.updateProgress = async (req, res) => {
    try {
        const { course, topic } = req.body;
        
        // BUG FIX: Validate that the course exists in our schema
        const allowedCourses = ['htmlcss', 'javascript', 'python'];
        if (!allowedCourses.includes(course)) {
            return res.status(400).json({ message: 'Invalid course name' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.progress[course]) {
            user.progress[course] = [];
        }

        if (!user.progress[course].includes(topic)) {
            user.progress[course].push(topic);
            await user.save();
        }

        res.status(200).json({ 
            message: 'Progress updated', 
            progress: user.progress 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

    const { course, topic } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Ensure course exists in progress object
    if (!user.progress[course]) {
        return next(new ErrorResponse('Invalid course name', 400));
    }

    if (!user.progress[course].includes(topic)) {
        user.progress[course].push(topic);
        await user.save();
    }

    res.status(200).json({ 
        status: 'success',
        message: 'Progress updated', 
        progress: user.progress 
    });
});

// @desc    Get user progress
// @route   GET /api/auth/progress
exports.getProgress = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({ 
        status: 'success',
        progress: user.progress || { htmlcss: [], javascript: [], python: [] }
    });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Code',
            html: message
        });

        res.status(200).json({ status: 'success', message: 'Reset code sent to your email' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { code, password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (!password || password.length < 6) {
             return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

    const { code, password } = req.body;

    if (!code) {
        return next(new ErrorResponse('Please provide the reset code', 400));
    }

    const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired reset code', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ status: 'success', message: 'Password reset successful. You can now log in.' });
});