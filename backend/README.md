# Short-It Backend API

This is the backend implementation for the Short-It URL shortening service, built according to the specifications in the project documentation.

## Technology Stack

- **Language**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **Caching**: Redis (for rate limiting)
- **Logging**: Winston

## Features

- User authentication (register, login, logout)
- URL shortening with custom codes for premium users
- URL management (create, read, update, delete)
- Analytics tracking and reporting
- High-performance URL redirection
- Rate limiting based on user type

## Project Structure

```
backend/
├── prisma/              # Database schema and migrations
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.ts        # Main application entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- Redis (optional, for production rate limiting)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the PostgreSQL database and update the `DATABASE_URL` in `.env`
5. Generate Prisma client:
   ```
   npx prisma generate
   ```
6. Run database migrations:
   ```
   npx prisma migrate dev
   ```

### Running the Application

#### Development
```
npm run dev
```

#### Production
```
npm run build
npm start
```

## API Documentation

The API follows RESTful principles and returns JSON responses. All endpoints are prefixed with `/api/v1`.

For detailed API documentation, refer to the API Documentation file in the project docs.

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Anonymous users: 60 requests per hour
- Authenticated users: 1000 requests per hour
- Premium users: 5000 requests per hour

## Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after 24 hours and must be refreshed using the login endpoint.
