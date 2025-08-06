import { CachedSum } from '../types';
export declare class Database {
    private db;
    constructor();
    private initializeTables;
    findCachedSum(numbersKey: string): Promise<CachedSum | null>;
    saveCachedSum(id: string, numbersKey: string, sum: number): Promise<void>;
    updateCachedSum(id: string): Promise<void>;
    getAllCachedSums(): Promise<CachedSum[]>;
    deleteCachedSum(id: string): Promise<void>;
    clearAllCachedSums(): Promise<void>;
    close(): void;
}
export declare const database: Database;
//# sourceMappingURL=index.d.ts.map