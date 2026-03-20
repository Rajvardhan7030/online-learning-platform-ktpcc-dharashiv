const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const codeRoutes = require('./routes/coderoutes');
const app = express();


// Security middleware
app.use(helmet());

// Startup Validation
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables.');
    process.exit(1);
}

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5500',
    process.env.IDE_URL || 'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in our strict list OR if it is a Vercel deployment
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('vercel.app')) {
            return callback(null, true);
        } else {
            console.error(`CORS Blocked: The origin ${origin} is not allowed.`);
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true
};
app.use(cors(corsOptions));
// trust proxy of free deploy
app.set('trust proxy', 1);
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
  legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});
app.use( limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));

// MongoDB Connection with options
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully to elearning-ide'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// .env file should contain:
// PORT=

// MONGO_URI=

// JWT_SECRET=
// JWT_EXPIRE=
// FRONTEND_URL=
// NODE_ENV=
// EMAIL_USERNAME=
// EMAIL_PASSWORD=