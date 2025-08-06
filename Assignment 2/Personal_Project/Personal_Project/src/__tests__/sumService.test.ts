import { sumService } from '../services/sumService';
import { database } from '../database';
import { SumRequest } from '../types';

describe('SumService', () => {
  beforeEach(async () => {
    // Clear database before each test
    await database.clearAllCachedSums();
  });

  afterAll(async () => {
    // Close database connection
    database.close();
  });

  describe('computeSum', () => {
    it('should compute sum for new numbers and cache the result', async () => {
      const request: SumRequest = { numbers: [1, 2, 3, 4, 5] };
      
      const result = await sumService.computeSum(request);
      
      expect(result.sum).toBe(15);
      expect(result.cached).toBe(false);
      expect(result.timestamp).toBeDefined();
      expect(result.requestId).toBeDefined();
    });

    it('should return cached result for same numbers', async () => {
      const request: SumRequest = { numbers: [1, 2, 3, 4, 5] };
      
      // First request
      const firstResult = await sumService.computeSum(request);
      
      // Second request with same numbers
      const secondResult = await sumService.computeSum(request);
      
      expect(firstResult.sum).toBe(15);
      expect(firstResult.cached).toBe(false);
      expect(secondResult.sum).toBe(15);
      expect(secondResult.cached).toBe(true);
      expect(secondResult.requestId).toBe(firstResult.requestId);
    });

    it('should handle different order of numbers as same request', async () => {
      const request1: SumRequest = { numbers: [1, 2, 3, 4, 5] };
      const request2: SumRequest = { numbers: [5, 4, 3, 2, 1] };
      
      const result1 = await sumService.computeSum(request1);
      const result2 = await sumService.computeSum(request2);
      
      expect(result1.sum).toBe(15);
      expect(result1.cached).toBe(false);
      expect(result2.sum).toBe(15);
      expect(result2.cached).toBe(true);
    });

    it('should handle single number', async () => {
      const request: SumRequest = { numbers: [42] };
      
      const result = await sumService.computeSum(request);
      
      expect(result.sum).toBe(42);
      expect(result.cached).toBe(false);
    });

    it('should handle negative numbers', async () => {
      const request: SumRequest = { numbers: [-1, -2, -3, 4, 5] };
      
      const result = await sumService.computeSum(request);
      
      expect(result.sum).toBe(3);
      expect(result.cached).toBe(false);
    });

    it('should handle decimal numbers', async () => {
      const request: SumRequest = { numbers: [1.5, 2.5, 3.0] };
      
      const result = await sumService.computeSum(request);
      
      expect(result.sum).toBe(7);
      expect(result.cached).toBe(false);
    });
  });

  describe('getAllCachedSums', () => {
    it('should return empty array when no cached sums exist', async () => {
      const cachedSums = await sumService.getAllCachedSums();
      
      expect(cachedSums).toEqual([]);
    });

    it('should return all cached sums', async () => {
      const request1: SumRequest = { numbers: [1, 2, 3] };
      const request2: SumRequest = { numbers: [4, 5, 6] };
      
      await sumService.computeSum(request1);
      await sumService.computeSum(request2);
      
      const cachedSums = await sumService.getAllCachedSums();
      
      expect(cachedSums).toHaveLength(2);
      // Check that both sums exist but don't assume order
      const sums = cachedSums.map(item => item.sum).sort();
      expect(sums).toEqual([6, 15]);
    });
  });

  describe('deleteCachedSum', () => {
    it('should delete specific cached sum', async () => {
      const request: SumRequest = { numbers: [1, 2, 3] };
      const result = await sumService.computeSum(request);
      
      await sumService.deleteCachedSum(result.requestId);
      
      const cachedSums = await sumService.getAllCachedSums();
      expect(cachedSums).toHaveLength(0);
    });
  });

  describe('clearAllCachedSums', () => {
    it('should clear all cached sums', async () => {
      const request1: SumRequest = { numbers: [1, 2, 3] };
      const request2: SumRequest = { numbers: [4, 5, 6] };
      
      await sumService.computeSum(request1);
      await sumService.computeSum(request2);
      
      await sumService.clearAllCachedSums();
      
      const cachedSums = await sumService.getAllCachedSums();
      expect(cachedSums).toHaveLength(0);
    });
  });

  describe('getCachedSumById', () => {
    it('should return cached sum by ID', async () => {
      const request: SumRequest = { numbers: [1, 2, 3] };
      const result = await sumService.computeSum(request);
      
      const cachedSum = await sumService.getCachedSumById(result.requestId);
      
      expect(cachedSum).toBeDefined();
      expect(cachedSum?.id).toBe(result.requestId);
      expect(cachedSum?.sum).toBe(6);
    });

    it('should return null for non-existent ID', async () => {
      const cachedSum = await sumService.getCachedSumById('non-existent-id');
      
      expect(cachedSum).toBeNull();
    });
  });
}); 