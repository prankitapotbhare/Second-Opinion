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
    "role": "user"
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
    pm.expect(jsonData.message).to.equal("User registered successfully");
    
    // Save verification token for later use
    if (jsonData.data && jsonData.data.verificationToken) {
      pm.environment.set("USER_VERIFICATION_TOKEN", jsonData.data.verificationToken);
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
    "specialization": "Cardiology"
  }
  ```
- **Expected Response**: 201 Created
- **Test Script**: Same as above, but save token as `DOCTOR_VERIFICATION_TOKEN`

#### 1.3 Attempt Admin Registration (Should Fail)

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Attempted Admin",
    "email": "attempted.admin@example.com",
    "password": "password123",
    "role": "admin"
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

### 2. Email Verification

#### 2.1 Verify Regular User Email

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
  });
  ```

#### 2.2 Verify Doctor User Email

- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/verify-email/{{DOCTOR_VERIFICATION_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**: Same as above

### 3. User Login

#### 3.1 Login as Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com",
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

#### 3.2 Login as Doctor

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "doctor@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Similar to above, but check for doctor role

#### 3.3 Login as Admin

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

### 4. Get Current User

#### 4.1 Get Regular User Profile

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
    pm.expect(jsonData.data.user.email).to.equal("user@example.com");
  });
  ```

#### 4.2 Get Doctor Profile

- Same as above but with doctor's access token

#### 4.3 Get Admin Profile

- Same as above but with admin's access token

### 5. Refresh Token

#### 5.1 Refresh Regular User Token

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

#### 5.2 Refresh Doctor Token

- Same as above but with doctor's refresh token

#### 5.3 Refresh Admin Token

- Same as above but with admin's refresh token

### 6. Password Reset Flow

#### 6.1 Request Password Reset for Regular User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/request-password-reset`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com"
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
    pm.expect(jsonData.message).to.equal("Password reset link sent to email");
    
    // Save reset token
    if (jsonData.data && jsonData.data.resetToken) {
      pm.environment.set("USER_RESET_TOKEN", jsonData.data.resetToken);
    }
  });
  ```

#### 6.2 Reset Password for Regular User

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

#### 6.3 Login with New Password

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "newPassword123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Same as regular login test

#### 6.4 Request Password Reset for Admin

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/request-password-reset`
- **Body** (JSON):
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Same as above, save token as `ADMIN_RESET_TOKEN`

#### 6.5 Reset Password for Admin

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/reset-password/{{ADMIN_RESET_TOKEN}}`
- **Body** (JSON):
  ```json
  {
    "password": "newAdminPassword123"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Same as above

### 7. Resend Verification Email

#### 7.1 Create Unverified User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Unverified User",
    "email": "unverified@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- **Expected Response**: 201 Created

#### 7.2 Resend Verification Email

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/resend-verification`
- **Body** (JSON):
  ```json
  {
    "email": "unverified@example.com"
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
    pm.expect(jsonData.message).to.equal("Verification email sent");
    
    // Save new verification token
    if (jsonData.data && jsonData.data.verificationToken) {
      pm.environment.set("NEW_VERIFICATION_TOKEN", jsonData.data.verificationToken);
    }
  });
  ```

#### 7.3 Attempt to Resend Verification for Admin (Should Fail)

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/resend-verification`
- **Body** (JSON):
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- **Expected Response**: 403 Forbidden
- **Test Script**:
  ```javascript
  pm.test("Status code is 403", function() {
    pm.response.to.have.status(403);
  });
  
  pm.test("Admin restricted from resend verification", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
    pm.expect(jsonData.message).to.equal("Admin users can only use specific authentication routes");
  });
  ```

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