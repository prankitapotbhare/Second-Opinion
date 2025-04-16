# Second Opinion API Documentation

This document provides details about all available API endpoints for the Second Opinion application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

---

## Auth Routes

### Register User

Creates a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // "user", "doctor", or "admin"
}
```

For doctor registration, include specialization:

```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "doctor",
  "specialization": "Cardiology"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "60d21b4667d0d8992e610c85",
    "email": "john@example.com",
    "verificationToken": "a1b2c3d4e5f6..." // In production, this would be sent via email
  }
}
```

### Login

Authenticates a user and returns tokens.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://ui-avatars.com/api/?name=John%20Doe&background=3b82f6&color=fff",
      "emailVerified": true,
      "specialization": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Verify Email

Verifies a user's email address using the token sent during registration.

- **URL**: `/auth/verify-email/:token`
- **Method**: `GET`
- **Auth Required**: No

**URL Parameters**:
- `token`: The verification token sent to the user's email

**Success Response**:

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Refresh Token

Generates a new access token using a refresh token.

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### Logout

Invalidates a refresh token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Request Password Reset

Sends a password reset link to the user's email.

- **URL**: `/auth/request-password-reset`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "john@example.com"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Password reset link sent to email",
  "data": {
    "resetToken": "a1b2c3d4e5f6..." // In production, this would be sent via email
  }
}
```

### Reset Password

Resets a user's password using a token.

- **URL**: `/auth/reset-password/:token`
- **Method**: `POST`
- **Auth Required**: No

**URL Parameters**:
- `token`: The reset token sent to the user's email

**Request Body**:

```json
{
  "password": "newPassword123"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Resend Verification Email

Resends the email verification link.

- **URL**: `/auth/resend-verification`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "john@example.com"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Verification email sent",
  "data": {
    "verificationToken": "a1b2c3d4e5f6..." // In production, this would be sent via email
  }
}
```

### Get Current User

Retrieves the currently authenticated user's information.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://ui-avatars.com/api/?name=John%20Doe&background=3b82f6&color=fff",
      "emailVerified": true,
      "specialization": null,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  }
}
```

---

## User Routes

All user routes require authentication.

### Get User Profile

Retrieves the authenticated user's profile.

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://ui-avatars.com/api/?name=John%20Doe&background=3b82f6&color=fff",
      "emailVerified": true,
      "specialization": null,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  }
}
```

### Update User Profile

Updates the authenticated user's profile.

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "name": "John Smith",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Smith",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://example.com/photo.jpg",
      "emailVerified": true,
      "specialization": null,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T11:00:00.000Z"
    }
  }
}
```

---

## Admin Routes

All admin routes require authentication with an admin role.

### Get All Users

Retrieves a list of all users.

- **URL**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin only)

**Success Response**:

```json
{
  "success": true,
  "count": 2,
  "data": {
    "users": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "photoURL": "https://ui-avatars.com/api/?name=John%20Doe&background=3b82f6&color=fff",
        "emailVerified": true,
        "specialization": null,
        "createdAt": "2023-06-22T10:00:00.000Z",
        "updatedAt": "2023-06-22T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Dr. Jane Smith",
        "email": "jane@example.com",
        "role": "doctor",
        "photoURL": "https://ui-avatars.com/api/?name=Jane%20Smith&background=3b82f6&color=fff",
        "emailVerified": true,
        "specialization": "Cardiology",
        "createdAt": "2023-06-22T10:00:00.000Z",
        "updatedAt": "2023-06-22T10:00:00.000Z"
      }
    ]
  }
}
```

### Get User by ID

Retrieves a specific user by ID.

- **URL**: `/users/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Admin only)

**URL Parameters**:
- `id`: The ID of the user to retrieve

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://ui-avatars.com/api/?name=John%20Doe&background=3b82f6&color=fff",
      "emailVerified": true,
      "specialization": null,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    }
  }
}
```

### Update User

Updates a specific user by ID.

- **URL**: `/users/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Admin only)

**URL Parameters**:
- `id`: The ID of the user to update

**Request Body**:

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "user",
  "emailVerified": true,
  "photoURL": "https://example.com/photo.jpg",
  "specialization": null
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "user",
      "photoURL": "https://example.com/photo.jpg",
      "emailVerified": true,
      "specialization": null,
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T11:00:00.000Z"
    }
  }
}
```

### Delete User

Deletes a specific user by ID.

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin only)

**URL Parameters**:
- `id`: The ID of the user to delete

**Success Response**:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Setting Up Postman

1. Create a new Postman collection named "Second Opinion API"
2. Set up environment variables:
   - `BASE_URL`: http://localhost:5000/api
   - `ACCESS_TOKEN`: (to be filled after login)
   - `REFRESH_TOKEN`: (to be filled after login)

3. For authenticated requests, add this to the Authorization tab:
   - Type: Bearer Token
   - Token: {{ACCESS_TOKEN}}

4. Create a login request and add this script to the "Tests" tab to automatically save tokens:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.tokens) {
        pm.environment.set("ACCESS_TOKEN", jsonData.data.tokens.accessToken);
        pm.environment.set("REFRESH_TOKEN", jsonData.data.tokens.refreshToken);
    }
}
```