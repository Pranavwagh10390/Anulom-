import { SumRequest, ValidationError } from '../types';
export declare const validateSumRequest: (data: unknown) => {
    error?: ValidationError[];
    value?: SumRequest;
};
export declare const validateNumbers: (numbers: number[]) => string | null;
//# sourceMappingURL=validation.d.ts.map