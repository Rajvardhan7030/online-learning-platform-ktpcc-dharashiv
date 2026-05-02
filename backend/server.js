const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const codeRoutes = require('./routes/coderoutes');
const forumRoutes = require('./routes/forumroutes');
const app = express();


// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            "worker-src": ["'self'", "blob:"],
            "img-src": ["'self'", "data:", "https:"],
        },
    },
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://localhost:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        } else {
            console.error(`CORS Blocked: The origin ${origin} is not allowed.`);
            return callback(new Error('CORS Policy violation'), false);
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// trust proxy of free deploy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// MongoDB Connection with retry logic
const connectWithRetry = () => {
    console.log('🔄 Attempting MongoDB connection...');
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully to elearning-ide'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Handle MongoDB events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});

const errorHandler = require('./middleware/errorMiddleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/forum', forumRoutes);

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

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Professional Touch: Auto-install runtimes if running in Docker/Development
    if (process.env.NODE_ENV !== 'test') {
        try {
            const { installRuntimes } = require('./install_runtimes');
            // We'll run this in the background so it doesn't block server start
            installRuntimes().catch(err => console.error('Runtime auto-install failed:', err.message));
        } catch (err) {
            console.log('💡 Note: install_runtimes.js not found or failed to load. Skipping auto-provisioning.');
        }
    }
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
