# AffordMed URL Shortener Frontend

A responsive React + Material UI frontend for the AffordMed URL Shortener microservice. This app allows users to create, view, and analyze shortened URLs with a clean, modern UI.

## Features
- **Shorten up to 5 URLs at once** with optional validity and custom shortcode
- **View all shortened URLs** in a responsive table
- **Click on shortcodes** to open the redirect link
- **View detailed statistics** for each shortcode, including click analytics
- **Fully responsive** and user-friendly design

## Tech Stack
- React (with hooks)
- Material UI
- Native Fetch API (no axios, no polyfills needed)

## Setup & Run
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. The app runs at [http://localhost:3000](http://localhost:3000)

> **Note:** The backend Spring Boot service must be running at `http://localhost:8081`.

## API Endpoints Used

### 1. Create Short URL
- **POST** `http://localhost:8081/shorturls`
- **Request Body:**
  ```json
  {
    "url": "https://google.com",
    "validity": 30,         // optional, in minutes
    "shortcode": "google"  // optional
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "http://localhost:8081/shorturls/google",
    "expiry": "2025-01-01T00:30:00Z"
  }
  ```

### 2. List All Shortened URLs
- **GET** `http://localhost:8081/shorturls`
- **Response:**
  ```json
  [
    {
      "shortcode": "google",
      "originalUrl": "https://google.com",
      "createdAt": "2025-06-27T05:16:43.999280Z",
      "expiry": "2025-06-27T05:46:43.999280Z",
      "totalClicks": 2
    },
    ...
  ]
  ```

### 3. Get Statistics for a Shortcode
- **GET** `http://localhost:8081/shorturls/{shortcode}`
- **Response:**
  ```json
  {
    "originalUrl": "https://google.com",
    "shortcode": "google",
    "createdAt": "2025-06-27T05:16:43.999280Z",
    "expiry": "2025-06-27T05:46:43.999280Z",
    "totalClicks": 2,
    "clicks": [
      {
        "timestamp": "2025-06-27T05:20:00.000Z",
        "referrer": null,
        "location": "unknown"
      }
    ]
  }
  ```

## Usage Notes
- All API errors are shown as user-friendly messages.
- Dates are displayed in your local, human-readable format.
- The UI is fully responsive and works on all devices.

## License
This project is for evaluation/demo purposes only.
