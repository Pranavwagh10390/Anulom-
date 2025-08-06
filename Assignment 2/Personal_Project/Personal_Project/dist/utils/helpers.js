"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNumber = exports.formatTimestamp = exports.createNumbersKey = exports.sortNumbers = exports.calculateSum = exports.generateId = void 0;
const uuid_1 = require("uuid");
const generateId = () => {
    return (0, uuid_1.v4)();
};
exports.generateId = generateId;
const calculateSum = (numbers) => {
    return numbers.reduce((sum, num) => sum + num, 0);
};
exports.calculateSum = calculateSum;
const sortNumbers = (numbers) => {
    return [...numbers].sort((a, b) => a - b);
};
exports.sortNumbers = sortNumbers;
const createNumbersKey = (numbers) => {
    const sortedNumbers = (0, exports.sortNumbers)(numbers);
    return JSON.stringify(sortedNumbers);
};
exports.createNumbersKey = createNumbersKey;
const formatTimestamp = (date = new Date()) => {
    return date.toISOString();
};
exports.formatTimestamp = formatTimestamp;
const isValidNumber = (value) => {
    return typeof value === 'number' && Number.isFinite(value);
};
exports.isValidNumber = isValidNumber;
//# sourceMappingURL=helpers.js.map