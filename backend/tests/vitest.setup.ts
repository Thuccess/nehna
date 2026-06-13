process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-min';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/adulis-test';
