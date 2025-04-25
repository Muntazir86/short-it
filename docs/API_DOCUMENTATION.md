# Short-It API Services Documentation

This document outlines the API endpoints required for the backend development of the Short-It URL shortening application. The frontend is designed to interact with these endpoints to provide a complete user experience.

## Base URL

All API endpoints should be prefixed with:
```
https://api.short-it.com/v1
```

## Authentication Endpoints

### Register User
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Description**: Creates a new user account
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2025-04-22T13:48:20Z"
    },
    "token": "jwt_token"
  }
  ```
- **Status Codes**:
  - `201`: User created successfully
  - `400`: Invalid request data
  - `409`: Email already exists

### Login User
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
  ```
- **Status Codes**:
  - `200`: Login successful
  - `400`: Invalid request data
  - `401`: Invalid credentials

### Logout User
- **Endpoint**: `/auth/logout`
- **Method**: `POST`
- **Description**: Invalidates the user's token
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- **Status Codes**:
  - `200`: Logout successful
  - `401`: Unauthorized

### Get Current User
- **Endpoint**: `/auth/me`
- **Method**: `GET`
- **Description**: Returns the current authenticated user's information
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "createdAt": "2025-04-22T13:48:20Z"
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized

## URL Endpoints

### Create Short URL
- **Endpoint**: `/urls`
- **Method**: `POST`
- **Description**: Creates a new shortened URL
- **Headers**:
  - `Authorization`: `Bearer jwt_token` (optional - authenticated users only)
- **Request Body**:
  ```json
  {
    "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
    "customCode": "custom" // Optional - for premium users
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "url_id",
      "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
      "shortCode": "abc123",
      "shortUrl": "https://short-it.com/abc123",
      "createdAt": "2025-04-22T13:48:20Z",
      "expiresAt": "2026-04-22T13:48:20Z", // Optional - for premium users
      "userId": "user_id", // Only if created by authenticated user
      "clicks": 0
    }
  }
  ```
- **Status Codes**:
  - `201`: URL created successfully
  - `400`: Invalid URL or request data
  - `409`: Custom code already exists

### Get All URLs (for authenticated users)
- **Endpoint**: `/urls`
- **Method**: `GET`
- **Description**: Returns all URLs created by the authenticated user
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sortBy`: Field to sort by (default: createdAt)
  - `order`: Sort order (asc/desc, default: desc)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "urls": [
        {
          "id": "url_id",
          "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
          "shortCode": "abc123",
          "shortUrl": "https://short-it.com/abc123",
          "createdAt": "2025-04-22T13:48:20Z",
          "clicks": 42
        }
      ],
      "pagination": {
        "total": 100,
        "pages": 10,
        "page": 1,
        "limit": 10
      }
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized

### Get URL Details
- **Endpoint**: `/urls/:shortCode`
- **Method**: `GET`
- **Description**: Returns details for a specific shortened URL
- **Headers**:
  - `Authorization`: `Bearer jwt_token` (required for private URLs)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "url_id",
      "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
      "shortCode": "abc123",
      "shortUrl": "https://short-it.com/abc123",
      "createdAt": "2025-04-22T13:48:20Z",
      "expiresAt": "2026-04-22T13:48:20Z",
      "userId": "user_id",
      "clicks": 42,
      "isPrivate": false
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized (for private URLs)
  - `404`: URL not found

### Update URL
- **Endpoint**: `/urls/:id`
- **Method**: `PATCH`
- **Description**: Updates a shortened URL (premium users only)
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Request Body**:
  ```json
  {
    "customCode": "newcode",
    "isPrivate": true,
    "expiresAt": "2026-04-22T13:48:20Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "url_id",
      "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
      "shortCode": "newcode",
      "shortUrl": "https://short-it.com/newcode",
      "createdAt": "2025-04-22T13:48:20Z",
      "updatedAt": "2025-04-22T14:00:00Z",
      "expiresAt": "2026-04-22T13:48:20Z",
      "userId": "user_id",
      "clicks": 42,
      "isPrivate": true
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Invalid request data
  - `401`: Unauthorized
  - `403`: Forbidden (not premium user)
  - `404`: URL not found
  - `409`: Custom code already exists

### Delete URL
- **Endpoint**: `/urls/:id`
- **Method**: `DELETE`
- **Description**: Deletes a shortened URL
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Response**:
  ```json
  {
    "success": true,
    "message": "URL deleted successfully"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `404`: URL not found

## Analytics Endpoints

### Get URL Analytics
- **Endpoint**: `/analytics/urls/:id`
- **Method**: `GET`
- **Description**: Returns detailed analytics for a specific URL
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Query Parameters**:
  - `period`: Time period (day, week, month, year, all - default: month)
  - `startDate`: Start date for custom period (ISO format)
  - `endDate`: End date for custom period (ISO format)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalClicks": 42,
      "clicksByDate": [
        { "date": "2025-04-21", "clicks": 5 },
        { "date": "2025-04-22", "clicks": 37 }
      ],
      "referrers": [
        { "source": "google.com", "clicks": 20 },
        { "source": "facebook.com", "clicks": 15 },
        { "source": "direct", "clicks": 7 }
      ],
      "locations": [
        { "country": "United States", "clicks": 25 },
        { "country": "Canada", "clicks": 10 },
        { "country": "United Kingdom", "clicks": 7 }
      ],
      "devices": [
        { "type": "desktop", "clicks": 30 },
        { "type": "mobile", "clicks": 10 },
        { "type": "tablet", "clicks": 2 }
      ],
      "browsers": [
        { "name": "Chrome", "clicks": 25 },
        { "name": "Firefox", "clicks": 10 },
        { "name": "Safari", "clicks": 7 }
      ]
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized
  - `404`: URL not found

### Get User Analytics Dashboard
- **Endpoint**: `/analytics/dashboard`
- **Method**: `GET`
- **Description**: Returns analytics dashboard for the authenticated user
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalUrls": 42,
      "totalClicks": 1337,
      "topUrls": [
        {
          "id": "url_id",
          "shortCode": "abc123",
          "shortUrl": "https://short-it.com/abc123",
          "clicks": 500
        }
      ],
      "clicksOverTime": [
        { "date": "2025-04-15", "clicks": 100 },
        { "date": "2025-04-16", "clicks": 150 },
        { "date": "2025-04-17", "clicks": 120 }
      ],
      "topReferrers": [
        { "source": "google.com", "clicks": 400 },
        { "source": "facebook.com", "clicks": 300 }
      ],
      "topLocations": [
        { "country": "United States", "clicks": 600 },
        { "country": "Canada", "clicks": 200 }
      ]
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `401`: Unauthorized

## Redirect Endpoint

### Redirect to Original URL
- **Endpoint**: `/:shortCode` (Note: This would typically be handled by a separate service)
- **Method**: `GET`
- **Description**: Redirects to the original URL and records the click
- **Response**: HTTP 302 redirect to the original URL
- **Status Codes**:
  - `302`: Redirect
  - `404`: Short code not found
  - `410`: URL expired or deleted

## Error Responses

All API errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional error details
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Anonymous users: 60 requests per hour
- Authenticated users: 1000 requests per hour
- Premium users: 5000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1619083200
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after 24 hours and must be refreshed using the login endpoint.
