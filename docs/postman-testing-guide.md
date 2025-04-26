# Postman Testing Guide for Second Opinion API

This guide provides step-by-step instructions for testing all routes in the Second Opinion API using Postman, with special attention to authentication and role-based access control.

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
     - "Patient User"
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

#### 1.1 Register Patient User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (JSON):
  ```json
  {
    "name": "Patient User",
    "email": "patient@example.com",
    "password": "password123",
    "role": "patient",
    "termsAccepted": true
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
      pm.environment.set("PATIENT_EMAIL", jsonData.data.email);
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
    "termsAccepted": true
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

#### 2.1 Resend Verification Email for Patient User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/resend-verification`
- **Body** (JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}"
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

**Note**: In a real testing scenario, you would need to extract the verification OTP from the email or database. For this guide, we'll assume you have access to the OTP.

#### 3.1 Verify Patient User Email

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/verify-email`
- **Body** (JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
    "otp": "123456"
  }
  ```
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
    pm.expect(jsonData.email).to.equal(pm.environment.get("PATIENT_EMAIL"));
  });
  ```

#### 3.2 Verify Doctor User Email

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/verify-email`
- **Body** (JSON):
  ```json
  {
    "email": "{{DOCTOR_EMAIL}}",
    "otp": "123456"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**: Same as above, but check against `DOCTOR_EMAIL`

### 4. User Login

#### 4.1 Login as Patient User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}",
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
    pm.expect(jsonData.data.user.role).to.equal("patient");
    
    // Save tokens
    if (jsonData.data && jsonData.data.tokens) {
      pm.environment.set("ACCESS_TOKEN", jsonData.data.tokens.accessToken);
      pm.environment.set("REFRESH_TOKEN", jsonData.data.tokens.refreshToken);
      pm.environment.set("PATIENT_ID", jsonData.data.user.id);
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
- **Test Script**: Similar to above, but check for doctor role and save doctor ID

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

#### 5.1 Get Patient User Profile

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
    pm.expect(jsonData.data.user.email).to.equal(pm.environment.get("PATIENT_EMAIL"));
  });
  ```

#### 5.2 Get Doctor Profile

- Same as above but with doctor's access token

#### 5.3 Get Admin Profile

- Same as above but with admin's access token

### 6. Refresh Token

#### 6.1 Refresh Patient User Token

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

#### 7.1 Request Password Reset for Patient User

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/request-password-reset`
- **Body** (JSON):
  ```json
  {
    "email": "{{PATIENT_EMAIL}}"
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
    pm.expect(jsonData.message).to.include("If your email is registered with us");
  });
  ```

#### 7.2 Reset Password (with token)

- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/reset-password/{{RESET_TOKEN}}`
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

### 8. Logout

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

## Test Cases for Patient Routes

### 1. Get Patient Details

- **Method**: GET
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Patient details retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.equal(pm.environment.get("PATIENT_ID"));
    pm.expect(jsonData.email).to.equal(pm.environment.get("PATIENT_EMAIL"));
  });
  ```

### 2. Update Patient Details

- **Method**: PUT
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Body** (JSON):
  ```json
  {
    "name": "Updated Patient Name"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Patient details updated successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.equal("Updated Patient Name");
  });
  ```

### 3. Submit Form for Second Opinion

- **Method**: POST
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Body** (JSON):
  ```json
  {
    "doctorId": "{{DOCTOR_ID}}",
    "age": 35,
    "gender": "Male",
    "phone": "1234567890",
    "emergencyContact": "0987654321",
    "problem": "I've been experiencing chest pain and would like a second opinion on my diagnosis."
  }
  ```
- **Expected Response**: 201 Created
- **Test Script**:
  ```javascript
  pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
  });
  
  pm.test("Form submitted successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("Form submitted successfully");
    
    // Save form ID for later use
    if (jsonData.data && jsonData.data.formSubmission) {
      pm.environment.set("FORM_ID", jsonData.data.formSubmission._id);
    }
  });
  ```

### 4. Upload Medical File

- **Method**: POST
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms/{{FORM_ID}}/files`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Body** (form-data):
  - Key: `file`, Value: [select a PDF or image file], Type: File
- **Expected Response**: 201 Created
- **Test Script**:
  ```javascript
  pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
  });
  
  pm.test("File uploaded successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.equal("File uploaded successfully");
    
    // Save file ID for later use
    if (jsonData.data && jsonData.data.file) {
      pm.environment.set("FILE_ID", jsonData.data.file._id);
    }
  });
  ```

### 5. Get Form Submissions

- **Method**: GET
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Form submissions retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.formSubmissions).to.be.an('array');
  });
  ```

### 6. Get Specific Form Submission

- **Method**: GET
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms/{{FORM_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Form submission retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.formSubmission._id).to.equal(pm.environment.get("FORM_ID"));
  });
  ```

### 7. Download Medical File

- **Method**: GET
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms/{{FORM_ID}}/files/{{FILE_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK (file download)

### 8. Delete Medical File

- **Method**: DELETE
- **URL**: `{{BASE_URL}}/patients/{{PATIENT_ID}}/forms/{{FORM_ID}}/files/{{FILE_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}`
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("File deleted successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include("deleted successfully");
  });
  ```

## Test Cases for Doctor Routes

### 1. Get All Doctors (as Patient)

- **Method**: GET
- **URL**: `{{BASE_URL}}/doctors`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use patient token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Doctors list retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
  });
  ```

### 2. Get Doctor Details (as Doctor)

- **Method**: GET
- **URL**: `{{BASE_URL}}/doctors/{{DOCTOR_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use doctor token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Doctor details retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.equal(pm.environment.get("DOCTOR_ID"));
  });
  ```

### 3. Update Doctor Details (as Doctor)

- **Method**: PUT
- **URL**: `{{BASE_URL}}/doctors/{{DOCTOR_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use doctor token)
- **Body** (JSON):
  ```json
  {
    "specialization": "Cardiology and Internal Medicine",
    "qualification": "MD, FACC"
  }
  ```
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Doctor details updated successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.specialization).to.equal("Cardiology and Internal Medicine");
    pm.expect(jsonData.qualification).to.equal("MD, FACC");
  });
  ```

## Test Cases for Admin Routes

### 1. Get Admin Details

- **Method**: GET
- **URL**: `{{BASE_URL}}/admins/{{ADMIN_ID}}`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use admin token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("Admin details retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.equal(pm.environment.get("ADMIN_ID"));
  });
  ```

### 2. Get All Patients (as Admin)

- **Method**: GET
- **URL**: `{{BASE_URL}}/admins/patients/all`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use admin token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("All patients retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
  });
  ```

### 3. Get All Doctors (as Admin)

- **Method**: GET
- **URL**: `{{BASE_URL}}/admins/doctors/all`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use admin token)
- **Expected Response**: 200 OK
- **Test Script**:
  ```javascript
  pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
  });
  
  pm.test("All doctors retrieved successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
  });
  ```

### 4. Create New Admin (as Admin)

- **Method**: POST
- **URL**: `{{BASE_URL}}/admins/create`
- **Headers**: 
  - Authorization: `Bearer {{ACCESS_TOKEN}}` (use admin token)
- **Body** (JSON):
  ```json
  {
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "adminPassword123"
  }
  ```
- **Expected Response**: 201 Created
- **Test Script**:
  ```javascript
  pm.test("Status code is 201", function() {
    pm.response.to.have.status(201);
  });
  
  pm.test("New admin created successfully", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.email).to.equal("newadmin@example.com");
  });
  ```