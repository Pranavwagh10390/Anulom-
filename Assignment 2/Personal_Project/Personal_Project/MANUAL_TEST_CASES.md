# Manual Test Cases for Cached Sum API

This document provides comprehensive manual test cases for the Cached Sum Web API. Each test case includes step-by-step instructions, expected results, and validation criteria.

## Prerequisites

1. **Start the API Server**

   ```bash
   npm run dev
   ```

   Server should start on `http://localhost:3000`

2. **Verify Health Check**

   - Open browser or Postman
   - GET `http://localhost:3000/health`
   - Expected: `{"status":"OK","timestamp":"...","version":"1.0.0"}`

3. **Access Swagger Documentation**
   - Open browser: `http://localhost:3000/api-docs`
   - Verify all endpoints are documented

## Test Case Categories

### 1. Positive Test Cases

#### TC-001: Basic Sum Computation

**Objective**: Verify basic sum computation functionality

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [1, 2, 3, 4, 5]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 15, "cached": false, "timestamp": "...", "requestId": "..."}`
- Verify `sum` is correct (15)
- Verify `cached` is false (first request)
- Verify `requestId` is a valid UUID

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-002: Cached Result Retrieval

**Objective**: Verify caching functionality

**Prerequisites**: Complete TC-001 first

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [1, 2, 3, 4, 5]}` (same as TC-001)
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 15, "cached": true, "timestamp": "...", "requestId": "..."}`
- Verify `cached` is true
- Verify `requestId` matches TC-001
- Verify response time is faster than TC-001

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-003: Order-Independent Caching

**Objective**: Verify that same numbers in different order return cached result

**Prerequisites**: Complete TC-001 first

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [5, 4, 3, 2, 1]}` (different order)
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 15, "cached": true, "timestamp": "...", "requestId": "..."}`
- Verify `cached` is true
- Verify `requestId` matches TC-001

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-004: Single Number

**Objective**: Verify handling of single number

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [42]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 42, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-005: Negative Numbers

**Objective**: Verify handling of negative numbers

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [-1, -2, -3, 4, 5]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 3, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-006: Decimal Numbers

**Objective**: Verify handling of decimal numbers

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [1.5, 2.5, 3.0]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 7, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-007: Large Array (1000 numbers)

**Objective**: Verify handling of maximum allowed array size

**Steps**:

1. Create array with 1000 numbers: `[1, 2, 3, ..., 1000]`
2. Send POST request to `http://localhost:3000/api/sum`
3. Body: `{"numbers": [1, 2, 3, ..., 1000]}`
4. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 500500, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

### 2. Negative Test Cases

#### TC-008: Empty Array

**Objective**: Verify validation for empty array

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": []}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: `{"error": "Validation Error", "message": "Invalid request data", "details": [...]}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-009: Missing Numbers Field

**Objective**: Verify validation for missing required field

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"otherField": [1, 2, 3]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: `{"error": "Validation Error", "message": "Invalid request data", "details": [...]}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-010: Non-Array Numbers

**Objective**: Verify validation for non-array input

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": "not an array"}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: `{"error": "Validation Error", "message": "Invalid request data", "details": [...]}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-011: Array with Non-Numbers

**Objective**: Verify validation for array containing non-numbers

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [1, 2, "three", 4]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: `{"error": "Validation Error", "message": "Invalid request data", "details": [...]}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-012: Too Many Numbers (1001)

**Objective**: Verify validation for exceeding maximum array size

**Steps**:

1. Create array with 1001 numbers: `[1, 2, 3, ..., 1001]`
2. Send POST request to `http://localhost:3000/api/sum`
3. Body: `{"numbers": [1, 2, 3, ..., 1001]}`
4. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: `{"error": "Validation Error", "message": "Invalid request data", "details": [...]}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-013: Invalid JSON

**Objective**: Verify handling of malformed JSON

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [1, 2, 3,` (incomplete JSON)
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 400 Bad Request
- Response: Error about invalid JSON

**Validation**: ✅ Pass / ❌ Fail

---

### 3. Cache Management Test Cases

#### TC-014: Get All Cached Sums

**Objective**: Verify retrieval of all cached sums

**Prerequisites**: Complete TC-001 and TC-004

**Steps**:

1. Send GET request to `http://localhost:3000/api/sum/cache`
2. No body required

**Expected Result**:

- Status: 200 OK
- Response: Array of cached sums
- Verify at least 2 entries exist (from TC-001 and TC-004)
- Verify each entry has: `id`, `numbers`, `sum`, `created_at`, `updated_at`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-015: Get Cached Sum by ID

**Objective**: Verify retrieval of specific cached sum

**Prerequisites**: Complete TC-001 and note the `requestId`

**Steps**:

1. Send GET request to `http://localhost:3000/api/sum/cache/{requestId}`
2. Replace `{requestId}` with actual ID from TC-001

**Expected Result**:

- Status: 200 OK
- Response: Single cached sum object
- Verify `id` matches the requested ID
- Verify `sum` is 15

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-016: Get Non-Existent Cached Sum

**Objective**: Verify handling of non-existent ID

**Steps**:

1. Send GET request to `http://localhost:3000/api/sum/cache/non-existent-id`

**Expected Result**:

- Status: 404 Not Found
- Response: `{"error": "Not Found", "message": "Cached sum not found", "statusCode": 404, "timestamp": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-017: Delete Cached Sum by ID

**Objective**: Verify deletion of specific cached sum

**Prerequisites**: Complete TC-001 and note the `requestId`

**Steps**:

1. Send DELETE request to `http://localhost:3000/api/sum/cache/{requestId}`
2. Replace `{requestId}` with actual ID from TC-001

**Expected Result**:

- Status: 200 OK
- Response: `{"message": "Cached sum deleted successfully", "id": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-018: Verify Deletion

**Objective**: Verify that deleted sum is no longer accessible

**Prerequisites**: Complete TC-017

**Steps**:

1. Send GET request to `http://localhost:3000/api/sum/cache/{requestId}`
2. Use the same ID from TC-017

**Expected Result**:

- Status: 404 Not Found
- Response: `{"error": "Not Found", "message": "Cached sum not found", "statusCode": 404, "timestamp": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-019: Clear All Cached Sums

**Objective**: Verify clearing of all cached sums

**Prerequisites**: Complete TC-001, TC-004, TC-005, TC-006

**Steps**:

1. Send DELETE request to `http://localhost:3000/api/sum/cache`
2. No body required

**Expected Result**:

- Status: 200 OK
- Response: `{"message": "All cached sums cleared successfully"}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-020: Verify All Cleared

**Objective**: Verify that all cached sums are cleared

**Prerequisites**: Complete TC-019

**Steps**:

1. Send GET request to `http://localhost:3000/api/sum/cache`

**Expected Result**:

- Status: 200 OK
- Response: `[]` (empty array)

**Validation**: ✅ Pass / ❌ Fail

---

### 4. Performance Test Cases

#### TC-021: Rate Limiting

**Objective**: Verify rate limiting functionality

**Steps**:

1. Send 101 POST requests to `http://localhost:3000/api/sum` with body `{"numbers": [1, 2, 3]}`
2. Send requests rapidly (within 15 minutes)

**Expected Result**:

- First 100 requests: 200 OK
- 101st request: 429 Too Many Requests
- Response: `{"error": "Too many requests", "message": "Rate limit exceeded", "statusCode": 429, "timestamp": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-022: Response Time Comparison

**Objective**: Compare response times for cached vs non-cached requests

**Prerequisites**: Complete TC-001

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum` with body `{"numbers": [1, 2, 3, 4, 5]}`
2. Note response time
3. Send same request again
4. Note response time

**Expected Result**:

- First request: Longer response time (computation + caching)
- Second request: Shorter response time (cached result)
- Verify second request is significantly faster

**Validation**: ✅ Pass / ❌ Fail

---

### 5. Edge Case Test Cases

#### TC-023: Zero Values

**Objective**: Verify handling of zero values

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [0, 0, 0, 0, 0]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 0, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-024: Mixed Zero and Non-Zero

**Objective**: Verify handling of mixed zero and non-zero values

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [0, 1, 0, 2, 0, 3]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 6, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

#### TC-025: Large Numbers

**Objective**: Verify handling of very large numbers

**Steps**:

1. Send POST request to `http://localhost:3000/api/sum`
2. Body: `{"numbers": [999999999, 999999999, 999999999]}`
3. Headers: `Content-Type: application/json`

**Expected Result**:

- Status: 200 OK
- Response: `{"sum": 2999999997, "cached": false, "timestamp": "...", "requestId": "..."}`

**Validation**: ✅ Pass / ❌ Fail

---

## Test Execution Summary

### Test Results Tracking

| Test Case | Description                 | Status | Notes |
| --------- | --------------------------- | ------ | ----- |
| TC-001    | Basic Sum Computation       | ⬜     |       |
| TC-002    | Cached Result Retrieval     | ⬜     |       |
| TC-003    | Order-Independent Caching   | ⬜     |       |
| TC-004    | Single Number               | ⬜     |       |
| TC-005    | Negative Numbers            | ⬜     |       |
| TC-006    | Decimal Numbers             | ⬜     |       |
| TC-007    | Large Array (1000 numbers)  | ⬜     |       |
| TC-008    | Empty Array                 | ⬜     |       |
| TC-009    | Missing Numbers Field       | ⬜     |       |
| TC-010    | Non-Array Numbers           | ⬜     |       |
| TC-011    | Array with Non-Numbers      | ⬜     |       |
| TC-012    | Too Many Numbers (1001)     | ⬜     |       |
| TC-013    | Invalid JSON                | ⬜     |       |
| TC-014    | Get All Cached Sums         | ⬜     |       |
| TC-015    | Get Cached Sum by ID        | ⬜     |       |
| TC-016    | Get Non-Existent Cached Sum | ⬜     |       |
| TC-017    | Delete Cached Sum by ID     | ⬜     |       |
| TC-018    | Verify Deletion             | ⬜     |       |
| TC-019    | Clear All Cached Sums       | ⬜     |       |
| TC-020    | Verify All Cleared          | ⬜     |       |
| TC-021    | Rate Limiting               | ⬜     |       |
| TC-022    | Response Time Comparison    | ⬜     |       |
| TC-023    | Zero Values                 | ⬜     |       |
| TC-024    | Mixed Zero and Non-Zero     | ⬜     |       |
| TC-025    | Large Numbers               | ⬜     |       |

### Legend

- ⬜ Not Tested
- ✅ Pass
- ❌ Fail
- ⚠️ Partial Pass (with notes)

### Test Environment

- **API Version**: 1.0.0
- **Test Date**: **\*\***\_\_\_**\*\***
- **Tester**: **\*\***\_\_\_**\*\***
- **Environment**: Development/Production
- **Browser/Client**: **\*\***\_\_\_**\*\***

### Notes and Observations

- Add any additional observations, bugs found, or performance issues here
- Document any deviations from expected behavior
- Note any environment-specific issues

---

## Postman Collection Usage

1. **Import Collection**: Import `Cached_Sum_API.postman_collection.json` into Postman
2. **Set Environment Variable**: Set `baseUrl` to `http://localhost:3000`
3. **Run Tests**: Execute requests in the order specified in test cases
4. **Validate Responses**: Compare actual responses with expected results
5. **Document Results**: Update the test results tracking table above

## Automated Testing

For automated testing, run:

```bash
npm test
```

This will execute all unit tests and integration tests automatically.
