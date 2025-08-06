"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumService = exports.SumService = void 0;
const database_1 = require("../database");
const helpers_1 = require("../utils/helpers");
const logger_1 = require("../utils/logger");
class SumService {
    async computeSum(request) {
        const { numbers } = request;
        const numbersKey = (0, helpers_1.createNumbersKey)(numbers);
        logger_1.logger.info(`Processing sum request for ${numbers.length} numbers`);
        const cachedResult = await database_1.database.findCachedSum(numbersKey);
        if (cachedResult) {
            logger_1.logger.info('Returning cached result');
            await database_1.database.updateCachedSum(cachedResult.id);
            return {
                sum: cachedResult.sum,
                cached: true,
                timestamp: (0, helpers_1.formatTimestamp)(),
                requestId: cachedResult.id,
            };
        }
        logger_1.logger.info('Computing new sum');
        const sum = (0, helpers_1.calculateSum)(numbers);
        const requestId = (0, helpers_1.generateId)();
        await database_1.database.saveCachedSum(requestId, numbersKey, sum);
        return {
            sum,
            cached: false,
            timestamp: (0, helpers_1.formatTimestamp)(),
            requestId,
        };
    }
    async getAllCachedSums() {
        logger_1.logger.info('Retrieving all cached sums');
        return await database_1.database.getAllCachedSums();
    }
    async deleteCachedSum(id) {
        logger_1.logger.info(`Deleting cached sum with ID: ${id}`);
        await database_1.database.deleteCachedSum(id);
    }
    async clearAllCachedSums() {
        logger_1.logger.info('Clearing all cached sums');
        await database_1.database.clearAllCachedSums();
    }
    async getCachedSumById(id) {
        logger_1.logger.info(`Retrieving cached sum with ID: ${id}`);
        const allSums = await database_1.database.getAllCachedSums();
        return allSums.find(sum => sum.id === id) || null;
    }
}
exports.SumService = SumService;
exports.sumService = new SumService();
//# sourceMappingURL=sumService.js.map