# Authentication Routes Testing Guide

This document provides comprehensive testing scenarios for all authentication routes in the Second Opinion application.

## Table of Contents
- [Registration Routes](#registration-routes)
- [Email Verification Routes](#email-verification-routes)
- [Login Routes](#login-routes)
- [Token Management Routes](#token-management-routes)
- [Password Reset Routes](#password-reset-routes)
- [Google OAuth Routes](#google-oauth-routes)
- [Protected Routes](#protected-routes)

## Registration Routes

### 1. Patient Registration (Success)

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Test Patient",
    "email": "patient@example.com",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 201 Created
- **Test Assertions**:
  - Status code is 201
  - Response contains success message about email verification
  - Response includes userId, email, and role

### 2. Doctor Registration (Success)

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Test Doctor",
    "email": "doctor@example.com",
    "password": "Password123!",
    "role": "doctor",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 201 Created
- **Test Assertions**:
  - Status code is 201
  - Response contains success message about email verification
  - Response includes userId, email, and role

### 3. Admin Registration (Should Fail)

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Test Admin",
    "email": "admin@example.com",
    "password": "Password123!",
    "role": "admin",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 403 Forbidden
- **Test Assertions**:
  - Status code is 403
  - Response message indicates admin registration is not allowed

### 4. Registration with Invalid Email

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Invalid Email User",
    "email": "invalid-email",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about invalid email format

### 5. Registration with Weak Password

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Weak Password User",
    "email": "weak@example.com",
    "password": "123",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about password strength

### 6. Registration without Terms Acceptance

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "No Terms User",
    "email": "noterms@example.com",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": false
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about terms acceptance

### 7. Registration with Existing Email

- **Method**: POST
- **URL**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "Duplicate User",
    "email": "patient@example.com", // Use an email that already exists
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 409 Conflict
- **Test Assertions**:
  - Status code is 409
  - Response contains error about email already in use

## Email Verification Routes

### 1. Verify Email with Valid OTP

- **Method**: POST
- **URL**: `/api/auth/verify-email`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "otp": "123456" // Use actual OTP received
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response indicates successful verification
  - User can now log in

### 2. Verify Email with Invalid OTP

- **Method**: POST
- **URL**: `/api/auth/verify-email`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "otp": "000000" // Incorrect OTP
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about invalid OTP

### 3. Verify Email with Expired OTP

- **Method**: POST
- **URL**: `/api/auth/verify-email`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "otp": "123456" // Expired OTP
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about expired OTP

### 4. Resend Verification Email (Valid User)

- **Method**: POST
- **URL**: `/api/auth/resend-verification`
- **Body**:
  ```json
  {
    "email": "patient@example.com"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response indicates verification email sent

### 5. Resend Verification Email (Already Verified)

- **Method**: POST
- **URL**: `/api/auth/resend-verification`
- **Body**:
  ```json
  {
    "email": "verified@example.com" // Email that's already verified
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Generic response for security (doesn't reveal if email is verified)

### 6. Resend Verification Email (Non-existent User)

- **Method**: POST
- **URL**: `/api/auth/resend-verification`
- **Body**:
  ```json
  {
    "email": "nonexistent@example.com"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Generic response for security (doesn't reveal if email exists)

## Login Routes

### 1. Patient Login (Success)

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens
  - User role is "patient"

### 2. Doctor Login (Success)

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "doctor@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens
  - User role is "doctor"

### 3. Admin Login (Success)

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens
  - User role is "admin"

### 4. Login with Expected Role (Success)

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "password": "Password123!",
    "expectedRole": "patient"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens

### 5. Login with Wrong Expected Role (Failure)

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "password": "Password123!",
    "expectedRole": "doctor"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about role mismatch

### 6. Login with Unverified Email

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "unverified@example.com", // Email that's not verified
    "password": "Password123!"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains needsVerification flag
  - Response includes email for verification

### 7. Login with Invalid Credentials

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "patient@example.com",
    "password": "WrongPassword123!"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about invalid credentials

### 8. Login with Non-existent User

- **Method**: POST
- **URL**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "nonexistent@example.com",
    "password": "Password123!"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about invalid credentials

## Token Management Routes

### 1. Refresh Token (Valid)

- **Method**: POST
- **URL**: `/api/auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "valid-refresh-token" // Use actual refresh token
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains new access and refresh tokens

### 2. Refresh Token (Invalid)

- **Method**: POST
- **URL**: `/api/auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "invalid-refresh-token"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about invalid token

### 3. Refresh Token (Expired)

- **Method**: POST
- **URL**: `/api/auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "expired-refresh-token" // Use expired token
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about expired token

### 4. Logout (Success)

- **Method**: POST
- **URL**: `/api/auth/logout`
- **Body**:
  ```json
  {
    "refreshToken": "valid-refresh-token" // Use actual refresh token
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response indicates successful logout
  - Refresh token is invalidated (test by trying to use it)

### 5. Logout (Invalid Token)

- **Method**: POST
- **URL**: `/api/auth/logout`
- **Body**:
  ```json
  {
    "refreshToken": "invalid-refresh-token"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response indicates successful logout (for security, doesn't reveal token validity)

## Password Reset Routes

### 1. Request Password Reset (Valid Email)

- **Method**: POST
- **URL**: `/api/auth/request-password-reset`
- **Body**:
  ```json
  {
    "email": "patient@example.com"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Generic response for security (doesn't reveal if email exists)

### 2. Request Password Reset (Non-existent Email)

- **Method**: POST
- **URL**: `/api/auth/request-password-reset`
- **Body**:
  ```json
  {
    "email": "nonexistent@example.com"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Generic response for security (doesn't reveal if email exists)

### 3. Reset Password (Valid Token)

- **Method**: POST
- **URL**: `/api/auth/reset-password/{token}` // Use actual reset token
- **Body**:
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response indicates successful password reset
  - User can log in with new password

### 4. Reset Password (Invalid Token)

- **Method**: POST
- **URL**: `/api/auth/reset-password/invalid-token`
- **Body**:
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about invalid token

### 5. Reset Password (Expired Token)

- **Method**: POST
- **URL**: `/api/auth/reset-password/{expired-token}` // Use expired token
- **Body**:
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about expired token

### 6. Reset Password (Weak Password)

- **Method**: POST
- **URL**: `/api/auth/reset-password/{token}` // Use valid token
- **Body**:
  ```json
  {
    "password": "123"
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about password strength

## Google OAuth Routes

### 1. Google Authentication (New User)

- **Method**: POST
- **URL**: `/api/auth/google`
- **Body**:
  ```json
  {
    "idToken": "valid-google-id-token", // Use actual Google ID token
    "userType": "patient"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens
  - Response indicates new user creation

### 2. Google Authentication (Existing User)

- **Method**: POST
- **URL**: `/api/auth/google`
- **Body**:
  ```json
  {
    "idToken": "valid-google-id-token", // Use token for existing user
    "userType": "patient"
  }
  ```
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data and tokens
  - Response indicates login (not new user)

### 3. Google Authentication (Invalid Token)

- **Method**: POST
- **URL**: `/api/auth/google`
- **Body**:
  ```json
  {
    "idToken": "invalid-google-id-token",
    "userType": "patient"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about invalid token

### 4. Google Authentication (Invalid User Type)

- **Method**: POST
- **URL**: `/api/auth/google`
- **Body**:
  ```json
  {
    "idToken": "valid-google-id-token", // Use actual Google ID token
    "userType": "admin" // Invalid user type
  }
  ```
- **Expected Response**: 400 Bad Request
- **Test Assertions**:
  - Status code is 400
  - Response contains error about invalid user type

## Protected Routes

### 1. Get Current User (Valid Token)

- **Method**: GET
- **URL**: `/api/auth/me`
- **Headers**:
  - Authorization: `Bearer {valid-access-token}` // Use actual access token
- **Expected Response**: 200 OK
- **Test Assertions**:
  - Status code is 200
  - Response contains user data
  - User data matches authenticated user

### 2. Get Current User (Invalid Token)

- **Method**: GET
- **URL**: `/api/auth/me`
- **Headers**:
  - Authorization: `Bearer invalid-token`
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about invalid token

### 3. Get Current User (Expired Token)

- **Method**: GET
- **URL**: `/api/auth/me`
- **Headers**:
  - Authorization: `Bearer {expired-token}` // Use expired token
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about token expiration
  - Response includes tokenExpired flag

### 4. Get Current User (No Token)

- **Method**: GET
- **URL**: `/api/auth/me`
- **Headers**: None
- **Expected Response**: 401 Unauthorized
- **Test Assertions**:
  - Status code is 401
  - Response contains error about missing token

## Admin Restriction Tests

### 1. Admin Accessing Allowed Routes

Test that admin users can access the following routes:
- `/api/auth/login`
- `/api/auth/refresh-token`
- `/api/auth/logout`
- `/api/auth/request-password-reset`
- `/api/auth/reset-password/{token}`

### 2. Admin Accessing Restricted Routes

Test that admin users cannot access the following routes:
- `/api/auth/register` (as admin)
- `/api/auth/verify-email` (for admin email)
- `/api/auth/resend-verification` (for admin email)