I'll update the api-documentation.md file to reflect the recent changes in the authentication flow, particularly regarding the verification URL structure, redirectPath parameter, and terms acceptance requirement.

Here are the necessary updates:

```markdown:c:\Users\manis\Projects\Second-Opinion\docs\api-documentation.md
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

## Important Notes

**Admin Authentication Restrictions:**
- Admin users can only use specific auth routes: `/auth/login`, `/auth/refresh-token`, `/auth/logout`, `/auth/request-password-reset`, and `/auth/reset-password/:token`
- Admin registration is not available through the API
- Admin accounts must be created directly in the database using the provided script:
  ```bash
  npm run create-admin
  ```

---

## Auth Routes

### Register User

Creates a new user account (not available for admin role).

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Restrictions**: Not available for admin role

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user", // Only "user" or "doctor" roles allowed
  "termsAccepted": true, // Required
  "redirectPath": "/dashboard" // Optional, path to redirect after email verification
}
```

For doctor registration, include specialization:

```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "doctor",
  "specialization": "Cardiology",
  "termsAccepted": true,
  "redirectPath": "/doctor-dashboard"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "userId": "60d21b4667d0d8992e610c85",
    "email": "john@example.com",
    "termsAccepted": true,
    "termsAcceptedAt": "2023-06-22T10:00:00.000Z"
  }
}
```

### Login

Authenticates a user and returns tokens.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Available for**: All roles (user, doctor, admin)

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
      "role": "user", // Can be "user", "doctor", or "admin"
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

**Error Response (Email Not Verified)**:

```json
{
  "success": false,
  "message": "Please verify your email before logging in",
  "needsVerification": true,
  "email": "john@example.com"
}
```

### Verify Email

Verifies a user's email address using the token sent during registration (not available for admin role).

- **URL**: `/auth/verify-email/:token`
- **Method**: `GET`
- **Auth Required**: No
- **Restrictions**: Not available for admin role

**URL Parameters**:
- `token`: The verification token sent to the user's email

**Success Response**:

```json
{
  "success": true,
  "message": "Email verified successfully",
  "email": "john@example.com"
}
```

**Note**: The verification link sent to users will be in the format:
```
http://localhost:3000/verify-email?token=<token>&email=<email>&redirectPath=<redirectPath>
```

### Refresh Token

Generates a new access token using a refresh token.

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Auth Required**: No
- **Available for**: All roles (user, doctor, admin)

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
- **Available for**: All roles (user, doctor, admin)

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
- **Available for**: All roles (user, doctor, admin)

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
  "message": "If your email is registered with us, you will receive a password reset link shortly."
}
```

### Reset Password

Resets a user's password using a token.

- **URL**: `/auth/reset-password/:token`
- **Method**: `POST`
- **Auth Required**: No
- **Available for**: All roles (user, doctor, admin)

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

Resends the email verification link (not available for admin role).

- **URL**: `/auth/resend-verification`
- **Method**: `POST`
- **Auth Required**: No
- **Restrictions**: Not available for admin role

**Request Body**:

```json
{
  "email": "john@example.com",
  "redirectPath": "/dashboard" // Optional, path to redirect after verification
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "If your email is unverified, a new verification email has been sent."
}
```

### Get Current User

Retrieves the currently authenticated user's information.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Available for**: All authenticated users (user, doctor, admin)

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

### Google Authentication

Authenticates or registers a user using Google OAuth.

- **URL**: `/auth/google`
- **Method**: `POST`
- **Auth Required**: No
- **Restrictions**: Not available for admin role

**Request Body**:

```json
{
  "idToken": "Google-provided-id-token",
  "userType": "user", // "user" or "doctor", defaults to "user" if not specified
  "redirectPath": "/dashboard" // Optional, path to redirect after email verification if needed
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "Google login successful", // or "Google signup successful" for new users
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "photoURL": "https://lh3.googleusercontent.com/a/photo",
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "isNewUser": false // true if this is the first time the user has logged in with Google
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
- **Available for**: All authenticated users (user, doctor, admin)

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
- **Available for**: All authenticated users (user, doctor, admin)

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