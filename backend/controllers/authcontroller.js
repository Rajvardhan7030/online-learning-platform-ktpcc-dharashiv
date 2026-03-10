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
            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
            await user.save({ validateBeforeSave: false });

            // Create verification URL
            const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/html/verify.html?token=${verificationToken}`;

            const message = `
                <h1>You have requested to register an account.</h1>
                <p>Please click on the following link to verify your email:</p>
                <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
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
                user.verificationToken = undefined;
                await user.save({ validateBeforeSave: false });

                res.status(500).json({ message: 'Email could not be sent', error: err.message });
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
// @route   GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/html/reset-password.html?token=${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please make a post request to: \n\n <a href="${resetUrl}" clicktracking=off>${resetUrl}</a></p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                html: message
            });

            res.status(200).json({ message: 'Email sent' });
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
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if (!req.body.password || req.body.password.length < 6) {
             return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};