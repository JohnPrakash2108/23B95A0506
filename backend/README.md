# AffordMed URL Shortener Microservice

## Overview
A robust HTTP URL Shortener microservice built with Spring Boot and PostgreSQL. It provides core URL shortening functionality along with analytics for each shortened link, including click tracking and expiry. Designed for scalability, maintainability, and production-readiness.

## Features
- Create short URLs with optional custom shortcodes
- Set expiry for short URLs (default: 30 minutes)
- Redirect to original URL and log each click
- Retrieve analytics: total clicks, click details (timestamp, referrer, location)
- Robust error handling with descriptive JSON responses
- Logging integrated throughout the service

## Technology Stack
- **Java 17**
- **Spring Boot 3.x**
- **PostgreSQL**
- **Spring Data JPA**
- **Lombok** (for DTOs/entities)

## API Endpoints

### 1. Create Short URL
- **POST** `/shorturls`
- **Request Body:**
  ```json
  {
    "url": "https://example.com/very/long/url",
    "validity": 30,           // optional, in minutes
    "shortcode": "custom1"   // optional
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "https://localhost:8081/custom1",
    "expiry": "2025-01-01T00:30:00Z"
  }
  ```

### 2. Redirect to Original URL (Logs Click)
- **GET** `/{shortcode}`
- **Behavior:** Redirects to the original URL and logs the click.

### 3. Retrieve Short URL Statistics
- **GET** `/shorturls/{shortcode}`
- **Response:**
  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "shortcode": "custom1",
    "createdAt": "2025-01-01T00:00:00Z",
    "expiry": "2025-01-01T00:30:00Z",
    "totalClicks": 2,
    "clicks": [
      {
        "timestamp": "2025-01-01T00:10:00Z",
        "referrer": null,
        "location": "unknown"
      }
    ]
  }
  ```

## Setup Instructions
1. **Clone the repository**
2. **Configure PostgreSQL** in `src/main/resources/application.properties`:
   - Set DB URL, username, and password
3. **Build and run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```
4. **API is available at** `http://localhost:8081`

## Usage Examples
- Use Postman or curl to create, access, and analyze short URLs as shown above.

## Architecture & Design
- **Layered architecture:** Controller, Service, Repository, DTO, and Entity layers
- **Entities:**
  - `ShortUrl`: Stores original URL, shortcode, expiry, creation time
  - `ShortUrlClick`: Stores click timestamp, referrer, location, and link to `ShortUrl`
- **Error Handling:** Centralized via `GlobalExceptionHandler` for robust, user-friendly errors
- **Logging:** All major actions and errors are logged for traceability
- **Scalability:** Stateless service, can be scaled horizontally; DB schema supports analytics
- **Assumptions:** No authentication, location is placeholder, shortcodes are case-sensitive and unique

## License
This project is for evaluation/demo purposes only. 