# Authentication Routes Testing Guide for Postman

This document provides comprehensive testing scenarios for all authentication routes in the Second Opinion application using Postman.

## Setting Up Postman

1. **Create a new collection** named "Second Opinion API Tests"
2. **Set up environment variables**:
   - `BASE_URL`: Your API base URL (e.g., `http://localhost:5000/api`)
   - `ACCESS_TOKEN`: Will store the JWT access token
   - `REFRESH_TOKEN`: Will store the JWT refresh token
   - `RESET_TOKEN`: Will store password reset token
   - `PATIENT_EMAIL`: Email for test patient
   - `DOCTOR_EMAIL`: Email for test doctor
   - `ADMIN_EMAIL`: Email for test admin

3. **Create folders** for each route category:
   - Registration Routes
   - Email Verification Routes
   - Login Routes
   - Token Management Routes
   - Password Reset Routes
   - Google OAuth Routes
   - Protected Routes
   - Admin Restriction Tests

## Test Scripts

Add the following test scripts to automatically save tokens and validate responses:

### Save Tokens Script
```javascript
// Save tokens from login or refresh responses
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    if (responseJson.accessToken) {
        pm.environment.set("ACCESS_TOKEN", responseJson.accessToken);
    }
    if (responseJson.refreshToken) {
        pm.environment.set("REFRESH_TOKEN", responseJson.refreshToken);
    }
    if (responseJson.user && responseJson.user.email) {
        if (responseJson.user.role === "patient") {
            pm.environment.set("PATIENT_EMAIL", responseJson.user.email);
        } else if (responseJson.user.role === "doctor") {
            pm.environment.set("DOCTOR_EMAIL", responseJson.user.email);
        } else if (responseJson.user.role === "admin") {
            pm.environment.set("ADMIN_EMAIL", responseJson.user.email);
        }
    }
}
```

### Basic Response Validation Script
```javascript
// Basic response validation
pm.test("Status code is " + pm.expect.response.code, function () {
    pm.response.to.have.status(pm.expect.response.code);
});

pm.test("Response has the correct format", function () {
    pm.response.to.be.json;
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.be.an('object');
    pm.expect(responseJson).to.have.property('success');
});
```

## Registration Routes

### 1. Patient Registration (Success)

- **Request Name**: Patient Registration - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Test Patient",
    "email": "patient@example.com",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
  });
  
  pm.test("Response contains success message", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("verification");
  });
  
  pm.test("Response includes user data", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.have.property("userId");
    pm.expect(responseJson.data).to.have.property("email");
    pm.expect(responseJson.data).to.have.property("role");
    pm.expect(responseJson.data.role).to.equal("patient");
    
    // Save email for future tests
    pm.environment.set("PATIENT_EMAIL", responseJson.data.email);
  });
  ```

### 2. Doctor Registration (Success)

- **Request Name**: Doctor Registration - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Test Doctor",
    "email": "doctor@example.com",
    "password": "Password123!",
    "role": "doctor",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
  });
  
  pm.test("Response contains success message", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("verification");
  });
  
  pm.test("Response includes user data", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.have.property("userId");
    pm.expect(responseJson.data).to.have.property("email");
    pm.expect(responseJson.data).to.have.property("role");
    pm.expect(responseJson.data.role).to.equal("doctor");
    
    // Save email for future tests
    pm.environment.set("DOCTOR_EMAIL", responseJson.data.email);
  });
  ```

### 3. Admin Registration (Should Fail)

- **Request Name**: Admin Registration - Should Fail
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Test Admin",
    "email": "admin@example.com",
    "password": "Password123!",
    "role": "admin",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 403", function () {
    pm.response.to.have.status(403);
  });
  
  pm.test("Response contains error about admin registration", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("admin registration");
  });
  ```

### 4. Registration with Invalid Email

- **Request Name**: Registration - Invalid Email
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Invalid Email User",
    "email": "invalid-email",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
  });
  
  pm.test("Response contains error about invalid email", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("email");
  });
  ```

### 5. Registration with Weak Password

- **Request Name**: Registration - Weak Password
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Weak Password User",
    "email": "weak@example.com",
    "password": "123",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
  });
  
  pm.test("Response contains error about password strength", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("password");
  });
  ```

### 6. Registration without Terms Acceptance

- **Request Name**: Registration - No Terms Acceptance
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "No Terms User",
    "email": "noterms@example.com",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": false
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
  });
  
  pm.test("Response contains error about terms acceptance", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("terms");
  });
  ```

### 7. Registration with Existing Email

- **Request Name**: Registration - Existing Email
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Duplicate User",
    "email": "{{PATIENT_EMAIL}}",
    "password": "Password123!",
    "role": "patient",
    "termsAccepted": true
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 409", function () {
    pm.response.to.have.status(409);
  });
  
  pm.test("Response contains error about email already in use", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("email");
    pm.expect(responseJson.message).to.include("already");
  });
  ```

## Email Verification Routes

### 1. Verify Email with Valid OTP

- **Request Name**: Verify Email - Valid OTP
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/verify-email`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "otp": "123456"
  }
  ```
- **Pre-request Script**:
  ```javascript
  // Note: In a real test, you would need to get the actual OTP from the database or email service
  // This is a placeholder for demonstration purposes
  console.log("Get the actual OTP from the database or check the email service logs");
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response indicates successful verification", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("verified");
  });
  ```

### 2. Verify Email with Invalid OTP

- **Request Name**: Verify Email - Invalid OTP
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/verify-email`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "otp": "000000"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
  });
  
  pm.test("Response contains error about invalid OTP", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("invalid");
    pm.expect(responseJson.message).to.include("OTP");
  });
  ```

### 3. Resend Verification Email

- **Request Name**: Resend Verification Email
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/resend-verification`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response indicates verification email sent", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("sent");
  });
  ```

## Login Routes

### 1. Patient Login (Success)

- **Request Name**: Patient Login - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "password": "Password123!"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response contains user data and tokens", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.data).to.have.property("user");
    pm.expect(responseJson.data).to.have.property("accessToken");
    pm.expect(responseJson.data).to.have.property("refreshToken");
    pm.expect(responseJson.data.user.role).to.equal("patient");
    
    // Save tokens for future requests
    pm.environment.set("ACCESS_TOKEN", responseJson.data.accessToken);
    pm.environment.set("REFRESH_TOKEN", responseJson.data.refreshToken);
  });
  ```

### 2. Doctor Login (Success)

- **Request Name**: Doctor Login - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{DOCTOR_EMAIL}}",
    "password": "Password123!"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response contains user data and tokens", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.data).to.have.property("user");
    pm.expect(responseJson.data).to.have.property("accessToken");
    pm.expect(responseJson.data).to.have.property("refreshToken");
    pm.expect(responseJson.data.user.role).to.equal("doctor");
    
    // Save tokens for future requests if needed
    // pm.environment.set("DOCTOR_ACCESS_TOKEN", responseJson.data.accessToken);
    // pm.environment.set("DOCTOR_REFRESH_TOKEN", responseJson.data.refreshToken);
  });
  ```

### 3. Login with Expected Role (Success)

- **Request Name**: Login with Expected Role - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "password": "Password123!",
    "expectedRole": "patient"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response contains user data and tokens", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.data).to.have.property("user");
    pm.expect(responseJson.data.user.role).to.equal("patient");
  });
  ```

### 4. Login with Wrong Expected Role (Failure)

- **Request Name**: Login with Wrong Expected Role - Failure
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "password": "Password123!",
    "expectedRole": "doctor"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
  });
  
  pm.test("Response contains error about role mismatch", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("role");
  });
  ```

### 5. Login with Invalid Credentials

- **Request Name**: Login - Invalid Credentials
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "password": "WrongPassword123!"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
  });
  
  pm.test("Response contains error about invalid credentials", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("credentials");
  });
  ```

## Token Management Routes

### 1. Refresh Token (Valid)

- **Request Name**: Refresh Token - Valid
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/refresh-token`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "{{REFRESH_TOKEN}}"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response contains new tokens", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.data).to.have.property("accessToken");
    pm.expect(responseJson.data).to.have.property("refreshToken");
    
    // Save new tokens
    pm.environment.set("ACCESS_TOKEN", responseJson.data.accessToken);
    pm.environment.set("REFRESH_TOKEN", responseJson.data.refreshToken);
  });
  ```

### 2. Refresh Token (Invalid)

- **Request Name**: Refresh Token - Invalid
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/refresh-token`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "invalid-refresh-token"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
  });
  
  pm.test("Response contains error about invalid token", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("token");
  });
  ```

### 3. Logout (Success)

- **Request Name**: Logout - Success
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/logout`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "{{REFRESH_TOKEN}}"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response indicates successful logout", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("logged out");
    
    // Clear tokens
    pm.environment.unset("ACCESS_TOKEN");
    pm.environment.unset("REFRESH_TOKEN");
  });
  ```

## Password Reset Routes

### 1. Request Password Reset

- **Request Name**: Request Password Reset
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/request-password-reset`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response indicates reset instructions sent", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("reset");
  });
  ```

### 2. Reset Password (Valid Token)

- **Request Name**: Reset Password - Valid Token
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/reset-password/{{RESET_TOKEN}}`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Pre-request Script**:
  ```javascript
  // Note: In a real test, you would need to get the actual reset token from the database or email service
  // This is a placeholder for demonstration purposes
  console.log("Get the actual reset token from the database or check the email service logs");
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response indicates successful password reset", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.message).to.include("reset");
  });
  ```

### 3. Reset Password (Invalid Token)

- **Request Name**: Reset Password - Invalid Token
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/reset-password/invalid-token`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Tests**:
  ```javascript
  pm.test("Status code is 400", function () {
    pm.response.to.have.status(400);
  });
  
  pm.test("Response contains error about invalid token", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("token");
  });
  ```

## Google OAuth Routes

### 1. Google Authentication

- **Request Name**: Google Authentication
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/google`
- **Headers**:
  - Content-Type: `application/json`
- **Body** (raw JSON):
  ```json
  {
    "idToken": "valid-google-id-token",
    "userType": "patient"
  }
  ```
- **Pre-request Script**:
  ```javascript
  // Note: In a real test, you would need to get a valid Google ID token
  // This is a placeholder for demonstration purposes
  console.log("Get a valid Google ID token for testing");
  ```
- **Tests**:
  ```javascript
  // Note: This test may fail without a valid Google ID token
  pm.test("Status code is 200 or 401", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 401]);
  });
  
  if (pm.response.code === 200) {
    pm.test("Response contains user data and tokens", function () {
      const responseJson = pm.response.json();
      pm.expect(responseJson.success).to.be.true;
      pm.expect(responseJson.data).to.have.property("user");
      pm.expect(responseJson.data).to.have.property("accessToken");
      pm.expect(responseJson.data).to.have.property("refreshToken");
      
      // Save tokens
      pm.environment.set("ACCESS_TOKEN", responseJson.data.accessToken);
      pm.environment.set("REFRESH_TOKEN", responseJson.data.refreshToken);
    });
  }
  ```

## Protected Routes

### 1. Get Current User (Valid Token)

- **Request Name**: Get Current User - Valid Token
- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/me`
- **Headers**:
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Tests**:
  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });
  
  pm.test("Response contains user data", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.data).to.have.property("user");
    pm.expect(responseJson.data.user).to.have.property("email");
    pm.expect(responseJson.data.user).to.have.property("role");
  });
  ```

### 2. Get Current User (No Token)

- **Request Name**: Get Current User - No Token
- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/me`
- **Tests**:
  ```javascript
  pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
  });
  
  pm.test("Response contains error about missing token", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("token");
  });
  ```

### 3. Get Current User (Invalid Token)

- **Request Name**: Get Current User - Invalid Token
- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/me`
- **Headers**:
  - Authorization: `Bearer invalid-token`
- **Tests**:
  ```javascript
  pm.test("Status code is 401", function () {
    pm.response.to.have.status(401);
  });
  
  pm.test("Response contains error about invalid token", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.false;
    pm.expect(responseJson.message).to.include("token");
  });
  ```

## Admin Restriction Tests

### 1. Admin Accessing Allowed Routes

For these tests, you'll need to:
1. Create an admin user directly in the database
2. Log in as the admin user to get admin tokens
3. Test the following routes with admin tokens:
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

## Postman Collection Runner

To run all tests in sequence:

1. Open the Postman Collection Runner
2. Select the "Second Opinion API Tests" collection
3. Select the environment with your variables
4. Arrange the requests in the correct order:
   - Registration tests first
   - Email verification tests
   - Login tests
   - Protected route tests
   - Token management tests
   - Password reset tests
5. Click "Run" to execute all tests in sequence

## Troubleshooting

If tests fail, check:
1. API server is running
2. Environment variables are set correctly
3. Database has been properly seeded
4. For email verification and password reset tests, you may need to manually retrieve tokens from the database or logs