# Postman Testing Guide for Second Opinion API

This guide provides step-by-step instructions for testing all authentication routes in the Second Opinion API using Postman, with special attention to admin restrictions.

## Setup

1. **Create a Postman Collection**
   - Create a new collection named "Second Opinion API"
   - Right-click the collection and select "Edit" to add variables

2. **Set Collection Variables**
   - Add the following variables:
     - `BASE_URL`: `http://localhost:5000/api`
     - `ACCESS_TOKEN`: (leave empty initially)
     - `REFRESH_TOKEN`: (leave empty initially)
     - `REDIRECT_PATH`: `/dashboard` (for testing email verification redirects)

3. **Create Environment**
   - Create environments for different user roles:
     - "Regular User"
     - "Doctor User"
     - "Admin User"

## Creating Test Users

Before testing, you'll need to create users with different roles:

### Create Admin User (Backend Only)

Run the following command in your terminal:

```bash
npm run create-admin
```

When prompted, enter:
- Name: "Admin User"
- Email: "admin@example.com"
- Password: "adminPassword123"

### Create Regular User and Doctor (via API)

Use the registration endpoint to create these users.

## Test Cases for Auth Routes

### 1. User Registration

#### 1.1 Register Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Regular User",
    "email": "user@example.com",
    "password": "password123",
    "role": "user",
    "termsAccepted": true,
    "redirectPath": "{{REDIRECT_PATH}}"
  }
  ```
- **Expected Response**: 201 Created
- **Test Script**:
  ```javascript
  pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
  });
  
  pm.test("Registration successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include("User registered successfully");
    
    // Save user email for later use
    if (jsonData.data && jsonData.data.email) {
      pm.environment.set("USER_EMAIL", jsonData.data.email);
    }
  });
  ```

#### 1.2 Register Doctor User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Doctor User",
    "email": "doctor@example.com",
    "password": "password123",
    "role": "doctor",
    "specialization": "Cardiology",
    "termsAccepted": true,
    "redirectPath": "{{REDIRECT_PATH}}"
  }
  ```
- **Expected Response**: 201 Created
- **Test Script**: Same as above, but save email as `DOCTOR_EMAIL`

#### 1.3 Attempt Admin Registration (Should Fail)

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Attempted Admin",
    "email": "attempted.admin@example.com",
    "password": "password123",
    "role": "admin",
    "termsAccepted": true
  }
  ```
- **Expected Response**: 403 Forbidden
- **Test Script**:
  ```javascript
  pm.test("Status code is 403", function() {
    pm.response.to.have.status(403);
  });
  
  pm.test("Admin registration is blocked", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
    pm.expect(jsonData.message).to.equal("Admin registration is not allowed through the API");
  });
  ```

### 2. Resend Verification Email

#### 2.1 Resend Verification Email for Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/resend-verification`
- **Body** (JSON):
  ```json
  {
    "email": "{{USER_EMAIL}}",
    "redirectPath": "{{REDIRECT_PATH}}"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Verification email resent successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include("If your email is unverified, a new verification email has been sent");
  });
  ```

### 3. Email Verification

**Note**: In a real testing scenario, you would need to extract the verification token from the email or database. For this guide, we'll assume you have access to the token.

#### 3.1 Verify Regular User Email

- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/verify-email/{{USER_VERIFICATION_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Email verification successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Email verified successfully");
    pm.expect(jsonData.email).to.equal(pm.environment.get("USER_EMAIL"));
  });
  ```

#### 3.2 Verify Doctor User Email

- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/verify-email/{{DOCTOR_VERIFICATION_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**: Same as above, but check against `DOCTOR_EMAIL`

### 4. User Login

#### 4.1 Login as Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "{{USER_EMAIL}}",
    "password": "password123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Login successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Login successful");
    pm.expect(jsonData.data.user.role).to.equal("user");
    
    // Save tokens
    if (jsonData.data && jsonData.data.tokens) {
      pm.environment.set("ACCESS_TOKEN", jsonData.data.tokens.accessToken);
      pm.environment.set("REFRESH_TOKEN", jsonData.data.tokens.refreshToken);
    }
  });
  ```

#### 4.2 Login as Doctor

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "{{DOCTOR_EMAIL}}",
    "password": "password123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Similar to above, but check for doctor role

#### 4.3 Login as Admin

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "admin@example.com",
    "password": "adminPassword123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Similar to above, but check for admin role

#### 4.4 Login with Unverified Email (Should Fail)

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "unverified@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 401 Unauthorized
- **Test Script**:
  ```javascript
  pm.test("Status code is 401", function() {
    pm.response.to.have.status(401);
  });
  
  pm.test("Login fails due to unverified email", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
    pm.expect(jsonData.message).to.include("Please verify your email");
    pm.expect(jsonData.needsVerification).to.be.true;
    pm.expect(jsonData.email).to.exist;
  });
  ```

### 5. Get Current User

#### 5.1 Get Regular User Profile

- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/me`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("User profile retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.user.email).to.equal(pm.environment.get("USER_EMAIL"));
  });
  ```

#### 5.2 Get Doctor Profile

- Same as above but with doctor's access token

#### 5.3 Get Admin Profile

- Same as above but with admin's access token

### 6. Refresh Token

#### 6.1 Refresh Regular User Token

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/refresh-token`
- **Body** (JSON):
  ```json
  {
    "refreshToken": "{{REFRESH_TOKEN}}"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Token refreshed successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Token refreshed successfully");
    
    // Update tokens
    if (jsonData.data && jsonData.data.tokens) {
      pm.environment.set("ACCESS_TOKEN", jsonData.data.tokens.accessToken);
      pm.environment.set("REFRESH_TOKEN", jsonData.data.tokens.refreshToken);
    }
  });
  ```

#### 6.2 Refresh Doctor Token

- Same as above but with doctor's refresh token

#### 6.3 Refresh Admin Token

- Same as above but with admin's refresh token

### 7. Password Reset Flow

#### 7.1 Request Password Reset for Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/request-password-reset`
- **Body** (JSON):
  ```json
  {
    "email": "{{USER_EMAIL}}"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Password reset requested successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include("If your email is registered with us, you will receive a password reset link shortly");
  });
  ```

#### 7.2 Reset Password for Regular User

**Note**: In a real testing scenario, you would need to extract the reset token from the email or database. For this guide, we'll assume you have access to the token.

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/reset-password/{{USER_RESET_TOKEN}}`
- **Body** (JSON):
  ```json
  {
    "password": "newPassword123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Password reset successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Password reset successfully");
  });
  ```

#### 7.3 Login with New Password

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "{{USER_EMAIL}}",
    "password": "newPassword123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Same as regular login test

### 8. Logout

#### 8.1 Logout Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/logout`
- **Body** (JSON):
  ```json
  {
    "refreshToken": "{{REFRESH_TOKEN}}"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Logout successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Logged out successfully");
    
    // Clear tokens
    pm.environment.set("ACCESS_TOKEN", "");
    pm.environment.set("REFRESH_TOKEN", "");
  });
  ```

#### 8.2 Logout Admin

- Same as above but with admin's refresh token

### 9. Google Authentication

#### 9.1 Google Auth for Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/google`
- **Body** (JSON):
  ```json
  {
    "idToken": "{{GOOGLE_ID_TOKEN}}",
    "userType": "user",
    "redirectPath": "{{REDIRECT_PATH}}"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Google authentication successful", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    
    // Save tokens if available
    if (jsonData.data && jsonData.data.tokens) {
      pm.environment.set("ACCESS_TOKEN", jsonData.data.tokens.accessToken);
      pm.environment.set("REFRESH_TOKEN", jsonData.data.tokens.refreshToken);
    }
  });
  ```

## Testing Admin Restrictions

### 1. Admin-Only Routes

Test that admin-only routes are properly restricted:

#### 1.1 Get All Users (Admin Only)

- **Method**: GET
- **URL**: `{{BASE_URL}}/users`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use regular user token)
- **Expected Response**: 403 Forbidden
- **Test Script**:
  ```javascript
  pm.test("Status code is 403", function() {
    pm.response.to.have.status(403);
  });
  
  pm.test("Access denied for non-admin user", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
  });
  ```

#### 1.2 Get All Users (With Admin Token)

- **Method**: GET
- **URL**: `{{BASE_URL}}/users`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use admin token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Admin can access user list", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.users).to.be.an('array');
  });
  ```

## Email Verification and Password Reset URLs

When testing with a real frontend, note that the verification and password reset emails will contain URLs with the following formats:

### Email Verification URL
```
http://localhost:3000/verify-email?token=<verification_token>&email=<user_email>&redirectPath=<redirect_path>&type=<user_type>
```

### Password Reset URL
```
http://localhost:3000/reset-password?token=<reset_token>&email=<user_email>&type=<user_type>
```

To test these URLs in Postman:

1. For email verification, extract the token from the URL and use it in the `/auth/verify-email/:token` endpoint
2. For password reset, extract the token from the URL and use it in the `/auth/reset-password/:token` endpoint

## Postman Collection Setup Tips

### Using Environment Variables

1. Create separate environments for each user role
2. Store tokens in the appropriate environment
3. Switch environments when testing different user roles

### Test Automation

1. Create a folder structure in Postman that follows the test flow
2. Use the "Collection Runner" to run all tests in sequence
3. Set up pre-request scripts to handle dependencies between requests

### Handling Token Expiry

Add this pre-request script to requests that require authentication:

```javascript
// Check if access token is expired and refresh if needed
const tokenExpiry = pm.environment.get("TOKEN_EXPIRY");
const currentTime = new Date().getTime();

if (tokenExpiry && currentTime > tokenExpiry) {
    // Token is expired, need to refresh
    console.log("Token expired, refreshing...");
    
    pm.sendRequest({
        url: pm.environment.get("BASE_URL") + '/auth/refresh-token',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                refreshToken: pm.environment.get("REFRESH_TOKEN")
            })
        }
    }, function (err, res) {
        if (!err && res.code === 200) {
            const responseJson = res.json();
            if (responseJson.success && responseJson.data && responseJson.data.tokens) {
                pm.environment.set("ACCESS_TOKEN", responseJson.data.tokens.accessToken);
                pm.environment.set("REFRESH_TOKEN", responseJson.data.tokens.refreshToken);
                
                // Set expiry time (assuming 1 hour token life)
                const newExpiry = new Date().getTime() + (60 * 60 * 1000);
                pm.environment.set("TOKEN_EXPIRY", newExpiry);
                
                console.log("Token refreshed successfully");
            }
        } else {
            console.error("Failed to refresh token");
        }
    });
}
```

## Troubleshooting Common Issues

### 401 Unauthorized Errors

- Check that your access token is valid and not expired
- Ensure you're including the "Bearer " prefix in the Authorization header
- Verify that the user has the correct permissions

### 403 Forbidden Errors

- Verify that you're using the correct user role for the endpoint
- Check that admin restrictions are properly implemented
- Ensure the user has the necessary permissions

### Token Handling Issues

- Make sure to save tokens after login and refresh operations
- Check that you're using the correct environment variables
- Verify that tokens are properly formatted in requests

### Email Verification Issues

- The verification URL now includes both the token and email parameters
- Make sure to include the redirectPath parameter when testing registration and resend verification
- The URL also includes the user type (user, doctor, admin)

### Password Reset Issues

- The reset password URL now includes the token, email, and user type parameters
- Make sure to test the complete flow from request to reset
- Verify that the new password works by logging in after reset