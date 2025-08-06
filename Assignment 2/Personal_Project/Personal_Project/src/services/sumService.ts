import { SumRequest, SumResponse, CachedSum } from '../types';
import { database } from '../database';
import { calculateSum, createNumbersKey, generateId, formatTimestamp } from '../utils/helpers';
import { logger } from '../utils/logger';

export class SumService {
  async computeSum(request: SumRequest): Promise<SumResponse> {
    const { numbers } = request;
    const numbersKey = createNumbersKey(numbers);
    
    logger.info(`Processing sum request for ${numbers.length} numbers`);

    // Check if result is already cached
    const cachedResult = await database.findCachedSum(numbersKey);
    
    if (cachedResult) {
      logger.info('Returning cached result');
      await database.updateCachedSum(cachedResult.id);
      
      return {
        sum: cachedResult.sum,
        cached: true,
        timestamp: formatTimestamp(),
        requestId: cachedResult.id,
      };
    }

    // Compute new sum
    logger.info('Computing new sum');
    const sum = calculateSum(numbers);
    const requestId = generateId();
    
    // Cache the result
    await database.saveCachedSum(requestId, numbersKey, sum);
    
    return {
      sum,
      cached: false,
      timestamp: formatTimestamp(),
      requestId,
    };
  }

  async getAllCachedSums(): Promise<CachedSum[]> {
    logger.info('Retrieving all cached sums');
    return await database.getAllCachedSums();
  }

  async deleteCachedSum(id: string): Promise<void> {
    logger.info(`Deleting cached sum with ID: ${id}`);
    await database.deleteCachedSum(id);
  }

  async clearAllCachedSums(): Promise<void> {
    logger.info('Clearing all cached sums');
    await database.clearAllCachedSums();
  }

  async getCachedSumById(id: string): Promise<CachedSum | null> {
    logger.info(`Retrieving cached sum with ID: ${id}`);
    const allSums = await database.getAllCachedSums();
    return allSums.find(sum => sum.id === id) || null;
  }
}

export const sumService = new SumService(); 