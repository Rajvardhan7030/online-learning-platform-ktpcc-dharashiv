const User = require('../model/user.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

        // Create user
        const user = await User.create({ username, email, password });

        if (user) {
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
                    message: 'Registration successful! Please check your email to verify your account.'
                });
            } catch (err) {
                // THE FIX: Delete the incomplete user record so they aren't permanently stuck 👇
                await User.findByIdAndDelete(user._id);

                res.status(500).json({ message: 'Email could not be sent. Please try registering again.', error: err.message });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email to log in' });
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// this setting controller logic

// @desc    Update username
// @route   PUT /api/auth/update-username
// @access  Private (Requires Token)
exports.updateUsername = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // req.user is set by our 'protect' middleware
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.username = req.body.username;
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        // If the username already exists in the database, MongoDB throws code 11000
        if (error.code === 11000) {
             return res.status(400).json({ message: 'This username is already taken' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify the current password matches what is in the database
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Mongoose pre-save hook in user.js will automatically hash this new password!
        user.password = req.body.newPassword;
        await user.save(); 

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Force them to verify their password before permanent deletion
        const isMatch = await user.matchPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password. Deletion cancelled.' });
        }

        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
};

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
};

// @desc    Get user progress
// @route   GET /api/auth/progress
exports.getProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            progress: user.progress || { htmlcss: [], javascript: [], python: [] }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
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

            res.status(200).json({ message: 'Reset code sent to your email' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500).json({ message: 'Email could not be sent', error: err.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
};