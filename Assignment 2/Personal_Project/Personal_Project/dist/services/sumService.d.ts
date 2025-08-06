import { SumRequest, SumResponse, CachedSum } from '../types';
export declare class SumService {
    computeSum(request: SumRequest): Promise<SumResponse>;
    getAllCachedSums(): Promise<CachedSum[]>;
    deleteCachedSum(id: string): Promise<void>;
    clearAllCachedSums(): Promise<void>;
    getCachedSumById(id: string): Promise<CachedSum | null>;
}
export declare const sumService: SumService;
//# sourceMappingURL=sumService.d.ts.map