// Authentication Middleware

/**
 * Authenticates requests from the mobile app using API key
 */
function authenticateApp(req, res, next) {
    try {
        const apiKey = req.headers['x-app-api-key'];

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API key is required',
                errorCode: 'MISSING_API_KEY',
            });
        }

        if (apiKey !== process.env.APP_API_KEY) {
            return res.status(403).json({
                success: false,
                message: 'Invalid API key',
                errorCode: 'INVALID_API_KEY',
            });
        }

        // API key is valid, proceed
        next();
    } catch (error) {
        console.error('[Auth Middleware] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            errorCode: 'AUTH_ERROR',
        });
    }
}

module.exports = {
    authenticateApp,
};

