import { Router, Request, Response } from 'express';
import { sumService } from '../services/sumService';
import { validateSumRequestMiddleware } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/sum:
 *   post:
 *     summary: Compute sum of numbers and cache the result
 *     tags: [Sum]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numbers
 *             properties:
 *               numbers:
 *                 type: array
 *                 items:
 *                   type: number
 *                 minItems: 1
 *                 maxItems: 1000
 *                 example: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Sum computed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 *                   example: 15
 *                 cached:
 *                   type: boolean
 *                   example: false
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 requestId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', validateSumRequestMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await sumService.computeSum(req.body);
    logger.info(`Sum computed successfully: ${result.sum}`);
    res.json(result);
  } catch (error) {
    logger.error('Error computing sum:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to compute sum',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/sum/cache:
 *   get:
 *     summary: Get all cached sums
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: List of cached sums
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   numbers:
 *                     type: string
 *                   sum:
 *                     type: number
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/cache', async (req: Request, res: Response) => {
  try {
    const cachedSums = await sumService.getAllCachedSums();
    logger.info(`Retrieved ${cachedSums.length} cached sums`);
    res.json(cachedSums);
  } catch (error) {
    logger.error('Error retrieving cached sums:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve cached sums',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/sum/cache/{id}:
 *   get:
 *     summary: Get a specific cached sum by ID
 *     tags: [Cache]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cached sum found
 *       404:
 *         description: Cached sum not found
 */
router.get('/cache/:id', async (req: Request, res: Response) => {
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
    
    const cachedSum = await sumService.getCachedSumById(id);
    
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
  } catch (error) {
    logger.error('Error retrieving cached sum:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve cached sum',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/sum/cache/{id}:
 *   delete:
 *     summary: Delete a specific cached sum by ID
 *     tags: [Cache]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cached sum deleted successfully
 *       404:
 *         description: Cached sum not found
 */
router.delete('/cache/:id', async (req: Request, res: Response) => {
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
    
    await sumService.deleteCachedSum(id);
    logger.info(`Cached sum deleted: ${id}`);
    res.json({
      message: 'Cached sum deleted successfully',
      id,
    });
  } catch (error) {
    logger.error('Error deleting cached sum:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete cached sum',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/sum/cache:
 *   delete:
 *     summary: Clear all cached sums
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: All cached sums cleared successfully
 */
router.delete('/cache', async (req: Request, res: Response) => {
  try {
    await sumService.clearAllCachedSums();
    logger.info('All cached sums cleared');
    res.json({
      message: 'All cached sums cleared successfully',
    });
  } catch (error) {
    logger.error('Error clearing cached sums:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to clear cached sums',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 