"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumbers = exports.validateSumRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const sumRequestSchema = joi_1.default.object({
    numbers: joi_1.default.array().items(joi_1.default.number()).min(1).max(1000).required()
        .messages({
        'array.min': 'At least one number is required',
        'array.max': 'Maximum 1000 numbers allowed',
        'any.required': 'Numbers array is required',
    }),
});
const validateSumRequest = (data) => {
    const { error, value } = sumRequestSchema.validate(data, { abortEarly: false });
    if (error) {
        const validationErrors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
        return { error: validationErrors };
    }
    return { value };
};
exports.validateSumRequest = validateSumRequest;
const validateNumbers = (numbers) => {
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
exports.validateNumbers = validateNumbers;
//# sourceMappingURL=validation.js.map