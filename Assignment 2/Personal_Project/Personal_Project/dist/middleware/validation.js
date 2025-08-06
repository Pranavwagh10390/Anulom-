"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSumRequestMiddleware = void 0;
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
const validateSumRequestMiddleware = (req, res, next) => {
    const validation = (0, validation_1.validateSumRequest)(req.body);
    if (validation.error) {
        logger_1.logger.warn('Validation failed:', validation.error);
        res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid request data',
            statusCode: 400,
            timestamp: new Date().toISOString(),
            details: validation.error,
        });
        return;
    }
    req.body = validation.value;
    next();
};
exports.validateSumRequestMiddleware = validateSumRequestMiddleware;
//# sourceMappingURL=validation.js.map