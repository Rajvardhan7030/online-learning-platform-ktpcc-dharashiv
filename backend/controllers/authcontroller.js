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

// @desc Register a new user
// @route POST /api/auth/register
exports.registerUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email or username', 400));
  }

  const user = await User.create({ username, email, password });

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationToken = crypto.createHash('sha256').update(verificationCode).digest('hex');
  await user.save({ validateBeforeSave: false });

  const message = `
    <h2>Welcome to E-Learn!</h2>
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
    await User.findByIdAndDelete(user._id);
    return next(new ErrorResponse('Email could not be sent. Please try registering again.', 500));
  }
});

// @desc Authenticate a user & get token
// @route POST /api/auth/login
exports.loginUser = asyncHandler(async (req, res, next) => {
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

// @desc Update username
// @route PUT /api/auth/update-username
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

// @desc Update password
// @route PUT /api/auth/update-password
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

// @desc Delete account
// @route DELETE /api/auth/delete-account
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

// @desc Verify Email
// @route POST /api/auth/verify-email
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { email, code } = req.body;

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

  res.status(200).json({ 
    status: 'success', 
    message: 'Email verified successfully. You can now log in.' 
  });
});

// @desc Update user progress
// @route POST /api/auth/update-progress
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { course, topic } = req.body;
  
  const allowedCourses = ['htmlcss', 'javascript', 'python'];
  if (!allowedCourses.includes(course)) {
    return next(new ErrorResponse('Invalid course name', 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.progress[course]) {
    user.progress[course] = [];
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

// @desc Get user progress
// @route GET /api/auth/progress
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

// @desc Forgot Password
// @route POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found with this email', 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordToken = crypto.createHash('sha256').update(resetCode).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  const message = `
    <h2>Password Reset</h2>
    <p>Your password reset code is: <strong>${resetCode}</strong></p>
    <p>This code will expire in 30 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      html: message
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Reset code sent to your email' 
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc Reset Password
// @route POST /api/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { code, password } = req.body;

  if (!code) {
    return next(new ErrorResponse('Please provide the reset code', 400));
  }

  if (!password || password.length < 6) {
    return next(new ErrorResponse('Password must be at least 6 characters long', 400));
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

  res.status(200).json({ 
    status: 'success', 
    message: 'Password reset successful. You can now log in.' 
  });
});