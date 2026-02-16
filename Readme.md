# Video Sharing Platform API

A robust Node.js backend API for a video sharing platform built with Express.js and MongoDB. This application enables users to upload, share, and interact with video content through features like comments, likes, playlists, and subscriptions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [License](#license)

## Features

- **User Management**: User authentication, registration, and profile management
- **Video Management**: Upload, retrieve, update, and delete videos
- **Social Features**:
  - Comments on videos
  - Like/unlike videos
  - Create and manage playlists
  - Subscribe/unsubscribe to users
  - Tweet functionality
- **File Uploads**: Cloudinary integration for media storage
- **Authentication**: JWT-based authentication with secure password hashing
- **Pagination**: Mongoose aggregate pagination for efficient data retrieval

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose (v9.1.5)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **File Upload**: Multer (v2.0.2) & Cloudinary (v2.9.0)
- **Security**: Bcrypt (v6.0.0)
- **CORS**: Cross-Origin Resource Sharing enabled
- **Cookie Parser**: Express cookie-parser (v1.4.7)

## Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for media storage)
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Project2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start with nodemon for automatic reload on file changes.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database
MONGODB_URI=<your-mongodb-connection-string>

# JWT
JWT_SECRET=<your-jwt-secret-key>

# Cloudinary
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Usage

### Development Mode

```bash
npm run dev
```

Runs the server with nodemon, which automatically restarts on file changes.

### API Base URL

```
http://localhost:8000/api/v1
```

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── constants.js          # Application constants
├── controllers/          # Request handlers
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   └── tweet.controller.js
├── models/              # MongoDB schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
├── routes/              # API route definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   └── comment.routes.js
├── middlewares/         # Custom middleware
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── utils/               # Utility functions
│   ├── asyncHandler.js
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── cloudinary.js
│   └── uploadCloudinary.js
└── db/                  # Database configuration
    └── index.js
```

## API Endpoints

### Users (`/api/v1/users`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Videos (`/api/v1/videos`)

- `GET /` - Get all videos with pagination
- `POST /upload` - Upload a new video
- `GET /:id` - Get video details
- `PUT /:id` - Update video information
- `DELETE /:id` - Delete a video

### Comments (`/api/v1/comments`)

- `GET /video/:videoId` - Get comments for a video
- `POST /` - Add a comment
- `PUT /:id` - Update a comment
- `DELETE /:id` - Delete a comment

### Likes

- `POST /video/:videoId` - Like a video
- `DELETE /video/:videoId` - Unlike a video

### Playlists

- `POST /` - Create a playlist
- `GET /` - Get user playlists
- `PUT /:id` - Update playlist
- `DELETE /:id` - Delete playlist

### Subscriptions

- `POST /:userId` - Subscribe to a user
- `DELETE /:userId` - Unsubscribe from a user

## Configuration

### Middleware

- **CORS**: Configured to accept requests from the origin specified in `CORS_ORIGIN` env variable
- **JSON Parser**: Limits requests to 16kb
- **Authentication**: JWT tokens validated via auth middleware
- **File Upload**: Multer configured for video and thumbnail uploads

### Database

MongoDB connection is established in `src/db/index.js` using Mongoose with the connection string from `MONGODB_URI` environment variable.

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- CORS protection
- Cookie-based session management
- Input validation and error handling

## Future Enhancements

- Video streaming optimization
- Advanced search and filtering
- Recommendation system
- Real-time notifications
- Video transcoding support

## License

ISC

---

**Note**: Ensure all environment variables are properly configured before starting the server.
