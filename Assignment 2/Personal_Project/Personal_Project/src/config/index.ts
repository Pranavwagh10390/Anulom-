import { AppConfig } from '../types';

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  database: {
    filename: process.env.DB_FILENAME || './data/cached_sums.db',
  },
}; 