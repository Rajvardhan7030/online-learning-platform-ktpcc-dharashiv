const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined') {
            return next(new ErrorResponse('Not authorized, token is missing or invalid', 401));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return next(new ErrorResponse('Not authorized, invalid token payload', 401));
        }

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new ErrorResponse('Not authorized, user not found', 401));
        }

        next();
    } else {
        return next(new ErrorResponse('Not authorized, no token provided', 401));
    }
});

module.exports = { protect };