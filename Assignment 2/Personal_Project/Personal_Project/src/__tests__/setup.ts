// Test setup file
import { config } from '../config';
import { database } from '../database';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_FILENAME = ':memory:'; // Use in-memory database for tests

// Wait for database initialization
beforeAll(async () => {
  await database.waitForInitialization();
}); 