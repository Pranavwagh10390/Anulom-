"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sumService_1 = require("../services/sumService");
const validation_1 = require("../middleware/validation");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.post('/', validation_1.validateSumRequestMiddleware, async (req, res) => {
    try {
        const result = await sumService_1.sumService.computeSum(req.body);
        logger_1.logger.info(`Sum computed successfully: ${result.sum}`);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Error computing sum:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to compute sum',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
router.get('/cache', async (req, res) => {
    try {
        const cachedSums = await sumService_1.sumService.getAllCachedSums();
        logger_1.logger.info(`Retrieved ${cachedSums.length} cached sums`);
        res.json(cachedSums);
    }
    catch (error) {
        logger_1.logger.error('Error retrieving cached sums:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve cached sums',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
router.get('/cache/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'ID parameter is required',
                statusCode: 400,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        const cachedSum = await sumService_1.sumService.getCachedSumById(id);
        if (!cachedSum) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Cached sum not found',
                statusCode: 404,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        res.json(cachedSum);
    }
    catch (error) {
        logger_1.logger.error('Error retrieving cached sum:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve cached sum',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
router.delete('/cache/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'ID parameter is required',
                statusCode: 400,
                timestamp: new Date().toISOString(),
            });
            return;
        }
        await sumService_1.sumService.deleteCachedSum(id);
        logger_1.logger.info(`Cached sum deleted: ${id}`);
        res.json({
            message: 'Cached sum deleted successfully',
            id,
        });
    }
    catch (error) {
        logger_1.logger.error('Error deleting cached sum:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete cached sum',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
router.delete('/cache', async (req, res) => {
    try {
        await sumService_1.sumService.clearAllCachedSums();
        logger_1.logger.info('All cached sums cleared');
        res.json({
            message: 'All cached sums cleared successfully',
        });
    }
    catch (error) {
        logger_1.logger.error('Error clearing cached sums:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to clear cached sums',
            statusCode: 500,
            timestamp: new Date().toISOString(),
        });
    }
});
exports.default = router;
//# sourceMappingURL=sumRoutes.js.map