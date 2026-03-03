const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, token is empty' });
            }

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