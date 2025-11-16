// Global Error Handler Middleware

function errorHandler(err, req, res, next) {
    console.error('[Error Handler]', err);

    // Default error
    let status = err.status || 500;
    let message = err.message || 'Internal server error';
    let errorCode = err.errorCode || 'INTERNAL_ERROR';

    // Specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation failed';
        errorCode = 'VALIDATION_ERROR';
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
        errorCode = 'UNAUTHORIZED';
    }

    res.status(status).json({
        success: false,
        message,
        errorCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

module.exports = {
    errorHandler,
};

