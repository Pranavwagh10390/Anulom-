import request from 'supertest';
import app from '../index';
import { database } from '../database';

describe('API Integration Tests', () => {
  beforeEach(async () => {
    // Clear database before each test
    await database.clearAllCachedSums();
  });

  afterAll(async () => {
    // Close database connection
    database.close();
  });

  describe('POST /api/sum', () => {
    it('should compute sum for new numbers', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3, 4, 5] })
        .expect(200);

      expect(response.body.sum).toBe(15);
      expect(response.body.cached).toBe(false);
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.requestId).toBeDefined();
    });

    it('should return cached result for same numbers', async () => {
      // First request
      const firstResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3, 4, 5] })
        .expect(200);

      // Second request with same numbers
      const secondResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3, 4, 5] })
        .expect(200);

      expect(firstResponse.body.cached).toBe(false);
      expect(secondResponse.body.cached).toBe(true);
      expect(secondResponse.body.requestId).toBe(firstResponse.body.requestId);
    });

    it('should handle different order of numbers as same request', async () => {
      // First request
      const firstResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3, 4, 5] })
        .expect(200);

      // Second request with different order
      const secondResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [5, 4, 3, 2, 1] })
        .expect(200);

      expect(firstResponse.body.cached).toBe(false);
      expect(secondResponse.body.cached).toBe(true);
    });

    it('should reject empty numbers array', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers: [] })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toBe('Invalid request data');
    });

    it('should reject missing numbers field', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject non-array numbers', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers: 'not an array' })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject too many numbers', async () => {
      const numbers = Array.from({ length: 1001 }, (_, i) => i);
      
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should handle negative numbers', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers: [-1, -2, -3, 4, 5] })
        .expect(200);

      expect(response.body.sum).toBe(3);
      expect(response.body.cached).toBe(false);
    });

    it('should handle decimal numbers', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({ numbers: [1.5, 2.5, 3.0] })
        .expect(200);

      expect(response.body.sum).toBe(7);
      expect(response.body.cached).toBe(false);
    });
  });

  describe('GET /api/sum/cache', () => {
    it('should return empty array when no cached sums exist', async () => {
      const response = await request(app)
        .get('/api/sum/cache')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all cached sums', async () => {
      // Clear any existing cache first
      await database.clearAllCachedSums();
      
      // Create some cached sums
      await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3] });

      await request(app)
        .post('/api/sum')
        .send({ numbers: [4, 5, 6] });

      const response = await request(app)
        .get('/api/sum/cache')
        .expect(200);

      expect(response.body).toHaveLength(2);
      // Check that both sums exist but don't assume order
      const sums = response.body.map((item: any) => item.sum).sort();
      expect(sums).toEqual([6, 15]);
    });
  });

  describe('GET /api/sum/cache/:id', () => {
    it('should return cached sum by ID', async () => {
      // Create a cached sum
      const createResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3] });

      const response = await request(app)
        .get(`/api/sum/cache/${createResponse.body.requestId}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.requestId);
      expect(response.body.sum).toBe(6);
    });

    it('should return 404 for non-existent ID', async () => {
      const response = await request(app)
        .get('/api/sum/cache/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('Cached sum not found');
    });
  });

  describe('DELETE /api/sum/cache/:id', () => {
    it('should delete specific cached sum', async () => {
      // Create a cached sum
      const createResponse = await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3] });

      const response = await request(app)
        .delete(`/api/sum/cache/${createResponse.body.requestId}`)
        .expect(200);

      expect(response.body.message).toBe('Cached sum deleted successfully');
      expect(response.body.id).toBe(createResponse.body.requestId);

      // Verify it's deleted
      await request(app)
        .get(`/api/sum/cache/${createResponse.body.requestId}`)
        .expect(404);
    });
  });

  describe('DELETE /api/sum/cache', () => {
    it('should clear all cached sums', async () => {
      // Create some cached sums
      await request(app)
        .post('/api/sum')
        .send({ numbers: [1, 2, 3] });

      await request(app)
        .post('/api/sum')
        .send({ numbers: [4, 5, 6] });

      const response = await request(app)
        .delete('/api/sum/cache')
        .expect(200);

      expect(response.body.message).toBe('All cached sums cleared successfully');

      // Verify all are deleted
      const cacheResponse = await request(app)
        .get('/api/sum/cache')
        .expect(200);

      expect(cacheResponse.body).toEqual([]);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('Route GET /non-existent-route not found');
    });
  });
}); 