import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};

export const calculateSum = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

export const sortNumbers = (numbers: number[]): number[] => {
  return [...numbers].sort((a, b) => a - b);
};

export const createNumbersKey = (numbers: number[]): string => {
  const sortedNumbers = sortNumbers(numbers);
  return JSON.stringify(sortedNumbers);
};

export const formatTimestamp = (date: Date = new Date()): string => {
  return date.toISOString();
};

export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
}; 