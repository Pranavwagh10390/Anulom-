"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const sumRoutes_1 = __importDefault(require("./routes/sumRoutes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests',
        message: 'Rate limit exceeded',
        statusCode: 429,
        timestamp: new Date().toISOString(),
    },
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cached Sum API',
            version: '1.0.0',
            description: 'A RESTful API that computes sums and caches results in a database',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${config_1.config.port}`,
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                SumRequest: {
                    type: 'object',
                    required: ['numbers'],
                    properties: {
                        numbers: {
                            type: 'array',
                            items: {
                                type: 'number',
                            },
                            minItems: 1,
                            maxItems: 1000,
                            example: [1, 2, 3, 4, 5],
                        },
                    },
                },
                SumResponse: {
                    type: 'object',
                    properties: {
                        sum: {
                            type: 'number',
                            example: 15,
                        },
                        cached: {
                            type: 'boolean',
                            example: false,
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                        requestId: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                        statusCode: {
                            type: 'number',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
app.use('/api/sum', sumRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const PORT = config_1.config.port;
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server is running on port ${PORT}`);
    logger_1.logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    logger_1.logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map