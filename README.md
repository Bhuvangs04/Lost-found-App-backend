# Lost-found-App-backend
## Project Overview

This is the backend for the Lost-found App. It provides APIs and handles data storage for lost and found items.

## Project Structure

```
Backend/
├── controllers/      # Handles request logic
├── models/           # Database models
├── routes/           # API route definitions
├── middleware/       # Custom middleware (e.g., authentication)
├── config/           # Configuration files
├── .env              # Environment variables
├── app.js            # Main application entry point
└── package.json      # Project dependencies and scripts
```

## .env File

The `.env` file contains sensitive configuration variables such as database connection strings, API keys, and secret tokens. Example variables:

```
MONGO_URI= ******
JWT_SECRET= ******
CLOUD_NAME= *******
CLOUD_API_KEY=******
CLOUD_API_SECRET=******
PORT=5000
EMAIL_USER = *****
EMAIL_PASS = *****

```

**Note:** Never share your `.env` file publicly.

## Getting Started

1. **Clone the repository:**
    ```
    git clone https://github.com/Bhuvangs04/Lost-found-App-backend.git
    cd Backend
    ```

2. **Install dependencies:**
    ```
    npm install
    ```

3. **Create a `.env` file:**
    - Copy `.env.example` (if available) or create a new `.env` file in the root directory.
    - Add the required variables as shown above.

4. **Start the server:**
    ```
    npm start
    ```

5. **API Usage:**
    - The backend will run on the port specified in your `.env` file (default: 5000).
    - Use tools like Postman to test API endpoints.

## Basic Knowledge

- **Node.js** and **Express** are used for the backend server.
- **MongoDB** is used for data storage.
- Environment variables are managed using the `.env` file.
- All source code is organized into logical folders for maintainability.

