# Cached Sum Web API

A RESTful API that takes a list of numbers, computes their sum, caches the result in a database, and returns the cached result if the same request is made again.

## 🚀 Features

- **Sum Computation**: Compute the sum of a list of numbers
- **Intelligent Caching**: Automatically cache results and return cached values for repeated requests
- **Order-Independent Caching**: Same numbers in different orders are treated as the same request
- **RESTful API**: Clean, well-documented REST endpoints
- **Swagger Documentation**: Interactive API documentation
- **Comprehensive Testing**: Unit tests, integration tests, and manual test cases
- **TypeScript**: Full TypeScript support with strict type checking
- **SQLite Database**: Lightweight, file-based database for caching
- **Security**: Rate limiting, CORS, and security headers
- **Logging**: Comprehensive logging with Winston

## 📋 Requirements

- Node.js 18+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cached-sum-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create necessary directories**

   ```bash
   mkdir -p data logs
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api-docs`

## 🔧 API Endpoints

### 1. Compute Sum

**POST** `/api/sum`

Computes the sum of a list of numbers and caches the result.

**Request Body:**

```json
{
  "numbers": [1, 2, 3, 4, 5]
}
```

**Response:**

```json
{
  "sum": 15,
  "cached": false,
  "timestamp": "2023-12-01T10:30:00.000Z",
  "requestId": "uuid-string"
}
```

### 2. Get All Cached Sums

**GET** `/api/sum/cache`

Retrieves all cached sum results.

**Response:**

```json
[
  {
    "id": "uuid-string",
    "numbers": "[1,2,3,4,5]",
    "sum": 15,
    "created_at": "2023-12-01T10:30:00.000Z",
    "updated_at": "2023-12-01T10:30:00.000Z"
  }
]
```

### 3. Get Cached Sum by ID

**GET** `/api/sum/cache/:id`

Retrieves a specific cached sum by its ID.

### 4. Delete Cached Sum

**DELETE** `/api/sum/cache/:id`

Deletes a specific cached sum by its ID.

### 5. Clear All Cached Sums

**DELETE** `/api/sum/cache`

Clears all cached sums from the database.

### 6. Health Check

**GET** `/health`

Returns the health status of the API.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Manual Testing with Postman

1. **Import the Postman Collection**

   - Use the provided `Cached_Sum_API.postman_collection.json` file
   - Import it into Postman

2. **Test Scenarios**

   **Scenario 1: New Sum Request**

   - Method: POST
   - URL: `http://localhost:3000/api/sum`
   - Body: `{"numbers": [1, 2, 3, 4, 5]}`
   - Expected: `{"sum": 15, "cached": false, ...}`

   **Scenario 2: Cached Sum Request**

   - Method: POST
   - URL: `http://localhost:3000/api/sum`
   - Body: `{"numbers": [1, 2, 3, 4, 5]}`
   - Expected: `{"sum": 15, "cached": true, ...}`

   **Scenario 3: Different Order, Same Result**

   - Method: POST
   - URL: `http://localhost:3000/api/sum`
   - Body: `{"numbers": [5, 4, 3, 2, 1]}`
   - Expected: `{"sum": 15, "cached": true, ...}`

   **Scenario 4: Error Handling**

   - Method: POST
   - URL: `http://localhost:3000/api/sum`
   - Body: `{"numbers": []}`
   - Expected: 400 Bad Request

## 📁 Project Structure

```
src/
├── __tests__/           # Test files
│   ├── setup.ts         # Test setup
│   ├── sumService.test.ts
│   ├── validation.test.ts
│   ├── helpers.test.ts
│   └── integration.test.ts
├── config/              # Configuration
│   └── index.ts
├── database/            # Database layer
│   └── index.ts
├── middleware/          # Express middleware
│   ├── errorHandler.ts
│   └── validation.ts
├── routes/              # API routes
│   └── sumRoutes.ts
├── services/            # Business logic
│   └── sumService.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   ├── helpers.ts
│   ├── logger.ts
│   └── validation.ts
└── index.ts             # Application entry point
```

## 🔧 Configuration

The application can be configured using environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DB_FILENAME`: Database file path (default: ./data/cached_sums.db)

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries

## 📊 Database Schema

```sql
CREATE TABLE cached_sums (
  id TEXT PRIMARY KEY,
  numbers TEXT NOT NULL,
  sum REAL NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 🚀 Deployment

### Docker (Optional)

```bash
docker build -t cached-sum-api .
docker run -p 3000:3000 cached-sum-api
```

### Environment Variables

```bash
export PORT=3000
export NODE_ENV=production
export DB_FILENAME=/path/to/database.db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions, please open an issue in the repository.

## 📈 Performance Considerations

- **Caching Strategy**: Results are cached based on sorted number arrays for order-independent matching
- **Database**: SQLite provides fast read/write operations for caching
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: Early validation prevents unnecessary processing

## 🔍 Monitoring and Logging

- **Winston Logger**: Structured logging with different levels
- **Error Tracking**: Comprehensive error handling and logging
- **Health Checks**: Built-in health check endpoint
- **Request Logging**: All API requests are logged

## 🎯 Future Enhancements

- Redis caching for better performance
- Authentication and authorization
- API versioning
- Metrics and monitoring
- Load balancing support
- Database migrations
