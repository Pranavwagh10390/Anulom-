import { 
  generateId, 
  calculateSum, 
  sortNumbers, 
  createNumbersKey, 
  formatTimestamp,
  isValidNumber 
} from '../utils/helpers';

describe('Helpers', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });

  describe('calculateSum', () => {
    it('should calculate sum of positive numbers', () => {
      const numbers = [1, 2, 3, 4, 5];
      const sum = calculateSum(numbers);
      
      expect(sum).toBe(15);
    });

    it('should calculate sum of negative numbers', () => {
      const numbers = [-1, -2, -3, -4, -5];
      const sum = calculateSum(numbers);
      
      expect(sum).toBe(-15);
    });

    it('should calculate sum of mixed numbers', () => {
      const numbers = [-1, 2, -3, 4, -5];
      const sum = calculateSum(numbers);
      
      expect(sum).toBe(-3);
    });

    it('should return 0 for empty array', () => {
      const numbers: number[] = [];
      const sum = calculateSum(numbers);
      
      expect(sum).toBe(0);
    });

    it('should handle decimal numbers', () => {
      const numbers = [1.5, 2.5, 3.0];
      const sum = calculateSum(numbers);
      
      expect(sum).toBe(7);
    });
  });

  describe('sortNumbers', () => {
    it('should sort numbers in ascending order', () => {
      const numbers = [5, 2, 8, 1, 9];
      const sorted = sortNumbers(numbers);
      
      expect(sorted).toEqual([1, 2, 5, 8, 9]);
    });

    it('should not modify original array', () => {
      const numbers = [5, 2, 8, 1, 9];
      const original = [...numbers];
      sortNumbers(numbers);
      
      expect(numbers).toEqual(original);
    });

    it('should handle negative numbers', () => {
      const numbers = [-5, 2, -8, 1, -9];
      const sorted = sortNumbers(numbers);
      
      expect(sorted).toEqual([-9, -8, -5, 1, 2]);
    });

    it('should handle duplicate numbers', () => {
      const numbers = [5, 2, 5, 1, 2];
      const sorted = sortNumbers(numbers);
      
      expect(sorted).toEqual([1, 2, 2, 5, 5]);
    });
  });

  describe('createNumbersKey', () => {
    it('should create consistent key for same numbers in different order', () => {
      const numbers1 = [1, 2, 3, 4, 5];
      const numbers2 = [5, 4, 3, 2, 1];
      
      const key1 = createNumbersKey(numbers1);
      const key2 = createNumbersKey(numbers2);
      
      expect(key1).toBe(key2);
    });

    it('should create different keys for different numbers', () => {
      const numbers1 = [1, 2, 3];
      const numbers2 = [1, 2, 4];
      
      const key1 = createNumbersKey(numbers1);
      const key2 = createNumbersKey(numbers2);
      
      expect(key1).not.toBe(key2);
    });

    it('should return valid JSON string', () => {
      const numbers = [1, 2, 3, 4, 5];
      const key = createNumbersKey(numbers);
      
      expect(() => JSON.parse(key)).not.toThrow();
      expect(JSON.parse(key)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('formatTimestamp', () => {
    it('should return ISO string', () => {
      const timestamp = formatTimestamp();
      
      expect(typeof timestamp).toBe('string');
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it('should accept custom date', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      const timestamp = formatTimestamp(date);
      
      expect(timestamp).toBe('2023-01-01T00:00:00.000Z');
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(-42)).toBe(true);
      expect(isValidNumber(3.14)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber('42')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber({})).toBe(false);
      expect(isValidNumber([])).toBe(false);
    });
  });
}); 