import sqlite3 from 'sqlite3';
import { config } from '../config';
import { logger } from '../utils/logger';
import { CachedSum } from '../types';

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(config.database.filename, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        throw err;
      }
      logger.info('Connected to SQLite database');
      this.initializeTables();
    });
  }

  private initializeTables(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS cached_sums (
        id TEXT PRIMARY KEY,
        numbers TEXT NOT NULL,
        sum REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;

    this.db.run(createTableSQL, (err) => {
      if (err) {
        logger.error('Error creating table:', err);
        throw err;
      }
      logger.info('Database tables initialized');
    });
  }

  async waitForInitialization(): Promise<void> {
    return new Promise((resolve) => {
      const checkTable = () => {
        this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='cached_sums'", (err, row) => {
          if (err) {
            logger.error('Error checking table:', err);
            setTimeout(checkTable, 100);
          } else if (row) {
            resolve();
          } else {
            setTimeout(checkTable, 100);
          }
        });
      };
      checkTable();
    });
  }

  async findCachedSum(numbersKey: string): Promise<CachedSum | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cached_sums WHERE numbers = ?';
      this.db.get(sql, [numbersKey], (err, row) => {
        if (err) {
          logger.error('Error finding cached sum:', err);
          reject(err);
        } else {
          resolve(row as CachedSum | null);
        }
      });
    });
  }

  async saveCachedSum(id: string, numbersKey: string, sum: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const sql = `
        INSERT INTO cached_sums (id, numbers, sum, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      this.db.run(sql, [id, numbersKey, sum, now, now], (err) => {
        if (err) {
          logger.error('Error saving cached sum:', err);
          reject(err);
        } else {
          logger.info(`Cached sum saved with ID: ${id}`);
          resolve();
        }
      });
    });
  }

  async updateCachedSum(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const sql = 'UPDATE cached_sums SET updated_at = ? WHERE id = ?';
      this.db.run(sql, [now, id], (err) => {
        if (err) {
          logger.error('Error updating cached sum:', err);
          reject(err);
        } else {
          logger.info(`Cached sum updated with ID: ${id}`);
          resolve();
        }
      });
    });
  }

  async getAllCachedSums(): Promise<CachedSum[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cached_sums ORDER BY updated_at DESC';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          logger.error('Error getting all cached sums:', err);
          reject(err);
        } else {
          resolve(rows as CachedSum[]);
        }
      });
    });
  }

  async deleteCachedSum(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM cached_sums WHERE id = ?';
      this.db.run(sql, [id], (err) => {
        if (err) {
          logger.error('Error deleting cached sum:', err);
          reject(err);
        } else {
          logger.info(`Cached sum deleted with ID: ${id}`);
          resolve();
        }
      });
    });
  }

  async clearAllCachedSums(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM cached_sums';
      this.db.run(sql, [], (err) => {
        if (err) {
          logger.error('Error clearing all cached sums:', err);
          reject(err);
        } else {
          logger.info('All cached sums cleared');
          resolve();
        }
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        logger.error('Error closing database:', err);
      } else {
        logger.info('Database connection closed');
      }
    });
  }
}

export const database = new Database(); 