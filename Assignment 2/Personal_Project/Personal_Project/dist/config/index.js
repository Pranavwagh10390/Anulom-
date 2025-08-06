"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
    database: {
        filename: process.env.DB_FILENAME || './data/cached_sums.db',
    },
};
//# sourceMappingURL=index.js.map