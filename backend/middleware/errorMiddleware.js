const ErrorResponse = require('../utils/errorResponse');

/**
 * Global Express Error Handler.
 * Centralizes error formatting for the entire application.
 */
const errorHandler = (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;

    // Log the full error stack in development for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    } else {
        console.error(`ERROR: ${err.message}`);
    }

    // Handle Mongoose Bad Object ID (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with ID: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose Duplicate Key Error (11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `This ${field} is already taken. Please choose another.`;
        error = new ErrorResponse(message, 400);
    }

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new ErrorResponse('Not authorized, token is invalid.', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new ErrorResponse('Not authorized, token has expired.', 401);
    }

    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';

    res.status(statusCode).json({
        status,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
