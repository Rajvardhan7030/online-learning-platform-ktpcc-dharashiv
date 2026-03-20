/**
 * Simple wrapper for async express route handlers to avoid repetitive try-catch blocks.
 * Passes any caught errors to the next middleware (usually the global error handler).
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
