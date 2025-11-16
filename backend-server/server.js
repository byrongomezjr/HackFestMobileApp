// Campus Wallet Backend Server
// Main server file with Fiserv payment integration

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

// Import routes
const paymentRoutes = require('./routes/payments');
const cardRoutes = require('./routes/cards');

// Import middleware
const { authenticateApp } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middleware Configuration
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-App-API-Key', 'Authorization'],
    credentials: true,
}));

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================================================
// Routes
// ============================================================================

// Health check endpoint (no authentication required)
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Campus Wallet API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
});

// API info
app.get('/api', (req, res) => {
    res.json({
        message: 'Campus Wallet API - Fiserv Payment Integration',
        version: '1.0.0',
        endpoints: {
            payments: '/api/payments',
            cards: '/api/cards',
            health: '/health',
        },
        documentation: 'See README.md for API documentation',
    });
});

// Protected routes (require authentication)
app.use('/api/payments', authenticateApp, paymentRoutes);
app.use('/api/cards', authenticateApp, cardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
    });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================

// Validate required environment variables
const requiredEnvVars = [
    'FISERV_API_KEY',
    'FISERV_API_SECRET',
    'FISERV_MERCHANT_ID',
    'FISERV_STORE_ID',
    'FISERV_TERMINAL_ID',
    'FISERV_BASE_URL',
    'APP_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ ERROR: Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease create a .env file based on .env.example and fill in all values.');
    process.exit(1);
}

// Start server
app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║        Campus Wallet Backend Server - RUNNING            ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log(`🚀 Server:      http://localhost:${PORT}`);
    console.log(`🏥 Health:      http://localhost:${PORT}/health`);
    console.log(`📡 API:         http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💳 Fiserv:      ${process.env.FISERV_BASE_URL}`);
    console.log('\n✅ Ready to accept requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app;

