# URL Shortener Backend Development Guidelines

## Project Overview

Develop a robust, scalable backend API for the "Short-It" URL shortening service that can handle millions of shortened URLs with persistent state. The backend should implement all endpoints defined in the API documentation while ensuring high performance, security, and reliability.

## Technology Stack Requirements

### Core Technologies
- **Language**: Node.js with TypeScript for type safety and improved maintainability
- **Framework**: Express.js or NestJS for RESTful API implementation
- **Database**: PostgreSQL for primary data storage with proper indexing
- **Caching**: Redis for high-performance URL caching and rate limiting
- **Authentication**: JWT-based authentication system with proper token management

### Additional Technologies
- **ORM**: Prisma or TypeORM for database interactions
- **Validation**: Joi or class-validator for request validation
- **Documentation**: Swagger/OpenAPI for API documentation
- **Testing**: Jest for unit and integration tests
- **Logging**: Winston or Pino for structured logging

## API Endpoint Implementation

Implement all endpoints as specified in the API documentation, ensuring:

1. **Authentication Endpoints**
   - Secure user registration with email validation
   - JWT token generation and validation
   - Session management (login/logout functionality)
   - Password hashing with bcrypt

2. **URL Management Endpoints**
   - Creation of shortened URLs with collision detection
   - Support for custom short codes (for premium users)
   - URL validation and sanitization
   - Efficient URL retrieval and listing with pagination
   - URL update and deletion with proper authorization

3. **Analytics Endpoints**
   - Collection of click data with geolocation, referrer, and device information
   - Aggregation of analytics data for dashboard display
   - Time-series data for charts and visualizations
   - Performance-optimized queries for analytics retrieval

4. **Redirect Service**
   - High-performance URL redirection with minimal latency
   - Click tracking and analytics recording
   - Handling of expired or deleted URLs

## Database Schema Design

Design and implement the following database schema:

1. **Users Table**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     is_premium BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **URLs Table**
   ```sql
   CREATE TABLE urls (
     id UUID PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE SET NULL,
     original_url TEXT NOT NULL,
     short_code VARCHAR(20) UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     expires_at TIMESTAMP WITH TIME ZONE,
     is_private BOOLEAN DEFAULT FALSE,
     clicks INTEGER DEFAULT 0
   );
   ```

3. **Clicks Table**
   ```sql
   CREATE TABLE clicks (
     id UUID PRIMARY KEY,
     url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
     clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     ip_address VARCHAR(45),
     country VARCHAR(2),
     city VARCHAR(100),
     referrer TEXT,
     browser VARCHAR(50),
     device_type VARCHAR(20),
     os VARCHAR(50)
   );
   ```

4. **Necessary Indexes**
   - `urls(short_code)` - For quick lookups during redirection
   - `urls(user_id, created_at)` - For efficient user URL queries
   - `clicks(url_id, clicked_at)` - For analytics queries
   - `users(email)` - For login lookups

## Core Service Implementation

### URL Shortening Service
- Implement a reliable short code generation algorithm (base62 encoding recommended)
- Handle collision detection and resolution
- Validate incoming URLs (format, safety checks)
- Support custom short codes with validation

### Authentication Service
- Implement secure password hashing and validation
- Generate and validate JWT tokens
- Handle user sessions and permissions
- Implement role-based access control (regular vs premium users)

### Analytics Service
- Track and store click events
- Extract and store metadata (location, device, referrer)
- Implement aggregation functions for dashboard metrics
- Optimize for write-heavy workloads

### Caching Strategy
- Implement URL caching to reduce database load
- Cache most frequently accessed URLs
- Use proper invalidation strategies
- Implement tiered caching if necessary

## Security Requirements

1. **Input Validation and Sanitization**
   - Validate and sanitize all user inputs
   - Prevent SQL injection, XSS, and CSRF attacks
   - Implement proper error handling to avoid information leakage

2. **Authentication and Authorization**
   - Secure JWT implementation with proper secret management
   - URL ownership validation
   - Rate limiting for both authenticated and anonymous users
   - Prevention of brute force attacks

3. **Data Protection**
   - Secure storage of user credentials
   - HTTPS-only API access
   - Proper handling of sensitive data

## Performance Optimization

1. **Database Optimization**
   - Efficient indexing strategy
   - Query optimization for common operations
   - Connection pooling
   - Consider read replicas for analytics queries

2. **Caching Strategy**
   - Multi-level caching (memory, Redis)
   - Implement LRU eviction policy
   - Cache warm-up strategies for popular URLs

3. **Scaling Considerations**
   - Horizontal scaling support (stateless API design)
   - Database sharding strategy for future growth
   - Microservices approach for redirect service

## Rate Limiting Implementation

Implement the specified rate limiting requirements:
- Anonymous users: 60 requests per hour
- Authenticated users: 1000 requests per hour
- Premium users: 5000 requests per hour

Use Redis for tracking request counts and implement proper rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Handling and Logging

1. **Standardized Error Responses**
   - Implement the specified error response format
   - Include appropriate HTTP status codes
   - Provide meaningful error messages

2. **Logging System**
   - Request/response logging
   - Error logging with stack traces
   - Performance monitoring
   - Structured logs for easier analysis

## Testing Requirements

1. **Unit Tests**
   - Test individual services and components
   - Mock external dependencies

2. **Integration Tests**
   - Test API endpoints with database integration
   - Verify authentication and authorization flows

3. **Load Tests**
   - Simulate high traffic scenarios
   - Identify performance bottlenecks

## Documentation Requirements

1. **API Documentation**
   - Implement Swagger/OpenAPI documentation
   - Document all endpoints, parameters, and responses
   - Include authentication requirements

2. **Code Documentation**
   - Document complex algorithms and business logic
   - Follow JSDoc or similar documentation standards

## Deployment Considerations

1. **Containerization**
   - Docker containerization for all services
   - Docker Compose for local development

2. **CI/CD Pipeline**
   - Automated testing
   - Linting and code quality checks
   - Deployment automation

3. **Environment Configuration**
   - Environment-specific configuration
   - Secret management
   - Feature flags for gradual rollout

## Monitoring and Maintenance

1. **Health Checks**
   - Implement /health endpoint
   - Monitor database connectivity
   - Track cache hit/miss rates

2. **Performance Monitoring**
   - Track response times
   - Monitor database query performance
   - Alert on anomalies

3. **Scalability Planning**
   - Identify potential bottlenecks
   - Plan for database scaling (sharding, replication)
   - Consider microservices architecture for specific components

## Development Process

1. **Code Organization**
   - Follow a modular architecture (e.g., MVC or clean architecture)
   - Separate business logic from infrastructure concerns
   - Use dependency injection for better testability

2. **Version Control**
   - Use Git with feature branching workflow
   - Follow semantic versioning for API
   - Maintain a comprehensive changelog

3. **Code Quality**
   - Implement linting (ESLint)
   - Use Prettier for code formatting
   - Follow consistent naming conventions
