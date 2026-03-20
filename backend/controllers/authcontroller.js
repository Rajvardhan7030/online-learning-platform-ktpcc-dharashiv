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
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return next(new ErrorResponse('Email and verification code are required', 400));
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
exports.updateProgress = asyncHandler(async (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
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
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Generate 6-digit code instead of a long token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p>You have requested a password reset for your CodeLearn account.</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                ${resetCode}
            </div>
            <p>This code is valid for 15 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #777; text-align: center;">© 2024 CodeLearn. All rights reserved.</p>
        </div>
    `;

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
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
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