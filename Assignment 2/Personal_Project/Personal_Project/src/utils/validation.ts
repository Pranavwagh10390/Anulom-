import Joi from 'joi';
import { SumRequest, ValidationError } from '../types';

const sumRequestSchema = Joi.object({
  numbers: Joi.array().items(Joi.number()).min(1).max(1000).required()
    .messages({
      'array.min': 'At least one number is required',
      'array.max': 'Maximum 1000 numbers allowed',
      'any.required': 'Numbers array is required',
    }),
});

export const validateSumRequest = (data: unknown): { error?: ValidationError[]; value?: SumRequest } => {
  const { error, value } = sumRequestSchema.validate(data, { abortEarly: false });

  if (error) {
    const validationErrors: ValidationError[] = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return { error: validationErrors };
  }

  return { value };
};

export const validateNumbers = (numbers: number[]): string | null => {
  if (numbers.length === 0) {
    return 'At least one number is required';
  }

  if (numbers.length > 1000) {
    return 'Maximum 1000 numbers allowed';
  }

  for (const num of numbers) {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      return 'All values must be valid numbers';
    }
  }

  return null;
}; 