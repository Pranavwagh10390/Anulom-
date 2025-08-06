"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Error occurred:', err);
    const error = {
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
        statusCode: 500,
        timestamp: new Date().toISOString(),
    };
    if (err.name === 'ValidationError') {
        error.error = 'Validation Error';
        error.statusCode = 400;
    }
    else if (err.name === 'NotFoundError') {
        error.error = 'Not Found';
        error.statusCode = 404;
    }
    else if (err.name === 'DatabaseError') {
        error.error = 'Database Error';
        error.statusCode = 500;
    }
    res.status(error.statusCode).json(error);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const error = {
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
    };
    res.status(404).json(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map