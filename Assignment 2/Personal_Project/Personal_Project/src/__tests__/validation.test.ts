import { validateSumRequest, validateNumbers } from '../utils/validation';
import { SumRequest } from '../types';

describe('Validation', () => {
  describe('validateSumRequest', () => {
    it('should validate correct request', () => {
      const request: SumRequest = { numbers: [1, 2, 3, 4, 5] };
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(request);
    });

    it('should reject empty numbers array', () => {
      const request = { numbers: [] };
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeDefined();
      expect(result.error![0].field).toBe('numbers');
      expect(result.error![0].message).toContain('At least one number is required');
    });

    it('should reject missing numbers field', () => {
      const request = {};
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeDefined();
      expect(result.error![0].field).toBe('numbers');
      expect(result.error![0].message).toContain('Numbers array is required');
    });

    it('should reject non-array numbers', () => {
      const request = { numbers: 'not an array' };
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeDefined();
      expect(result.error![0].field).toBe('numbers');
    });

    it('should reject array with non-numbers', () => {
      const request = { numbers: [1, 2, 'three', 4] };
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeDefined();
      expect(result.error![0].field).toBe('numbers');
    });

    it('should reject too many numbers', () => {
      const numbers = Array.from({ length: 1001 }, (_, i) => i);
      const request = { numbers };
      
      const result = validateSumRequest(request);
      
      expect(result.error).toBeDefined();
      expect(result.error![0].field).toBe('numbers');
      expect(result.error![0].message).toContain('Maximum 1000 numbers allowed');
    });
  });

  describe('validateNumbers', () => {
    it('should validate correct numbers array', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBeNull();
    });

    it('should reject empty array', () => {
      const numbers: number[] = [];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBe('At least one number is required');
    });

    it('should reject too many numbers', () => {
      const numbers = Array.from({ length: 1001 }, (_, i) => i);
      
      const result = validateNumbers(numbers);
      
      expect(result).toBe('Maximum 1000 numbers allowed');
    });

    it('should reject non-finite numbers', () => {
      const numbers = [1, 2, Infinity, 4];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBe('All values must be valid numbers');
    });

    it('should reject NaN', () => {
      const numbers = [1, 2, NaN, 4];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBe('All values must be valid numbers');
    });

    it('should accept negative numbers', () => {
      const numbers = [-1, -2, 3, -4];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBeNull();
    });

    it('should accept decimal numbers', () => {
      const numbers = [1.5, 2.7, 3.0];
      
      const result = validateNumbers(numbers);
      
      expect(result).toBeNull();
    });
  });
}); 