"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        this.db = new sqlite3_1.default.Database(config_1.config.database.filename, (err) => {
            if (err) {
                logger_1.logger.error('Error opening database:', err);
                throw err;
            }
            logger_1.logger.info('Connected to SQLite database');
            this.initializeTables();
        });
    }
    initializeTables() {
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
                logger_1.logger.error('Error creating table:', err);
                throw err;
            }
            logger_1.logger.info('Database tables initialized');
        });
    }
    async findCachedSum(numbersKey) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cached_sums WHERE numbers = ?';
            this.db.get(sql, [numbersKey], (err, row) => {
                if (err) {
                    logger_1.logger.error('Error finding cached sum:', err);
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
    async saveCachedSum(id, numbersKey, sum) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            const sql = `
        INSERT INTO cached_sums (id, numbers, sum, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `;
            this.db.run(sql, [id, numbersKey, sum, now, now], (err) => {
                if (err) {
                    logger_1.logger.error('Error saving cached sum:', err);
                    reject(err);
                }
                else {
                    logger_1.logger.info(`Cached sum saved with ID: ${id}`);
                    resolve();
                }
            });
        });
    }
    async updateCachedSum(id) {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            const sql = 'UPDATE cached_sums SET updated_at = ? WHERE id = ?';
            this.db.run(sql, [now, id], (err) => {
                if (err) {
                    logger_1.logger.error('Error updating cached sum:', err);
                    reject(err);
                }
                else {
                    logger_1.logger.info(`Cached sum updated with ID: ${id}`);
                    resolve();
                }
            });
        });
    }
    async getAllCachedSums() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM cached_sums ORDER BY updated_at DESC';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    logger_1.logger.error('Error getting all cached sums:', err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    async deleteCachedSum(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM cached_sums WHERE id = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    logger_1.logger.error('Error deleting cached sum:', err);
                    reject(err);
                }
                else {
                    logger_1.logger.info(`Cached sum deleted with ID: ${id}`);
                    resolve();
                }
            });
        });
    }
    async clearAllCachedSums() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM cached_sums';
            this.db.run(sql, [], (err) => {
                if (err) {
                    logger_1.logger.error('Error clearing all cached sums:', err);
                    reject(err);
                }
                else {
                    logger_1.logger.info('All cached sums cleared');
                    resolve();
                }
            });
        });
    }
    close() {
        this.db.close((err) => {
            if (err) {
                logger_1.logger.error('Error closing database:', err);
            }
            else {
                logger_1.logger.info('Database connection closed');
            }
        });
    }
}
exports.Database = Database;
exports.database = new Database();
//# sourceMappingURL=index.js.map