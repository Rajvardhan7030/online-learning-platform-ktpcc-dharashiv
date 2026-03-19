const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Not authorized, token is missing or invalid' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded.id) {
                return res.status(401).json({ message: 'Not authorized, invalid token payload' });
            }
              req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };