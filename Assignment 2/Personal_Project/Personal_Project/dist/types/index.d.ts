export interface SumRequest {
    numbers: number[];
}
export interface SumResponse {
    sum: number;
    cached: boolean;
    timestamp: string;
    requestId: string;
}
export interface CachedSum {
    id: string;
    numbers: string;
    sum: number;
    created_at: string;
    updated_at: string;
}
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
    timestamp: string;
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface DatabaseConfig {
    filename: string;
}
export interface AppConfig {
    port: number;
    environment: string;
    database: DatabaseConfig;
}
//# sourceMappingURL=index.d.ts.map