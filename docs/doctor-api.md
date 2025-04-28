# Doctor API Documentation

This document provides details about the Doctor API endpoints available in the Second Opinion application.

## Base URL

All endpoints are relative to the base URL: `/api/doctors`

## Authentication

All doctor routes require authentication using a JWT token. The token must be included in the Authorization header:

```
Authorization: Bearer <token>
```

Additionally, all routes require the user to have the 'doctor' role.

## Endpoints

### Get Doctor Profile

Retrieves the profile of the authenticated doctor.

- **URL**: `/profile`
- **Method**: `GET`
- **Authentication**: Required (doctor role)
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Doctor profile retrieved successfully",
      "data": {
        "_id": "doctor_id",
        "name": "Doctor Name",
        "email": "doctor@example.com",
        "specialization": "Cardiology",
        "experience": 10,
        "hospitalAffiliation": "City Hospital",
        "licenseNumber": "MED12345",
        "languages": ["English", "Spanish"],
        "photoURL": "https://example.com/photo.jpg",
        "role": "doctor",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
        // Other doctor fields
      }
    }
    ```
  - **Error (401)**:
    ```json
    {
      "success": false,
      "message": "Unauthorized - No token provided"
    }
    ```
  - **Error (403)**:
    ```json
    {
      "success": false,
      "message": "Forbidden - You do not have permission to access this resource"
    }
    ```

### Update Doctor Profile

Updates the profile of the authenticated doctor.

- **URL**: `/profile`
- **Method**: `PUT`
- **Authentication**: Required (doctor role)
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "specialization": "Neurology",
    "experience": 12,
    "hospitalAffiliation": "Metro Hospital",
    "licenseNumber": "MED67890",
    "languages": ["English", "French"],
    "phone": "+1234567890",
    "bio": "Experienced doctor with focus on neurological disorders"
    // Other updatable fields
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Doctor profile updated successfully",
      "data": {
        "_id": "doctor_id",
        "name": "Updated Name",
        "email": "doctor@example.com",
        "specialization": "Neurology",
        "experience": 12,
        // Updated fields
        "updatedAt": "2023-01-02T00:00:00.000Z"
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Invalid input data",
      "errors": { /* Validation errors */ }
    }
    ```

### Complete Doctor Profile

Completes the doctor's profile with required documents and information.

- **URL**: `/profile/complete`
- **Method**: `POST`
- **Authentication**: Required (doctor role)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - Form fields:
    ```
    specialization: "Cardiology"
    experience: 10
    licenseNumber: "MED12345"
    education: "Medical University"
    hospitalAffiliation: "City Hospital"
    languages: ["English", "Spanish"]
    bio: "Experienced cardiologist"
    ```
  - Files:
    ```
    registrationCertificate: [file] (PDF/JPG/PNG)
    governmentId: [file] (PDF/JPG/PNG)
    profilePhoto: [file] (JPG/PNG)
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Profile completed successfully",
      "data": {
        "_id": "doctor_id",
        "name": "Doctor Name",
        "email": "doctor@example.com",
        "specialization": "Cardiology",
        "experience": 10,
        "licenseNumber": "MED12345",
        "education": "Medical University",
        "isProfileComplete": true,
        "profileCompletedAt": "2023-01-02T00:00:00.000Z",
        "registrationCertificate": {
          "fileName": "certificate.pdf",
          "fileType": "application/pdf",
          "fileSize": 1024000,
          "uploadDate": "2023-01-02T00:00:00.000Z",
          "filePath": "path/to/file"
        },
        "governmentId": {
          "fileName": "id.pdf",
          "fileType": "application/pdf",
          "fileSize": 512000,
          "uploadDate": "2023-01-02T00:00:00.000Z",
          "filePath": "path/to/file"
        },
        "photoURL": "path/to/photo"
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Missing required fields: specialization, experience, licenseNumber, education"
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Upload error: File too large"
    }
    ```

### Upload Doctor Documents

Uploads or updates specific documents for the doctor's profile.

- **URL**: `/profile/documents`
- **Method**: `POST`
- **Authentication**: Required (doctor role)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - Files:
    ```
    registrationCertificate: [file] (PDF/JPG/PNG)
    governmentId: [file] (PDF/JPG/PNG)
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Documents uploaded successfully",
      "data": {
        "_id": "doctor_id",
        "name": "Doctor Name",
        "email": "doctor@example.com",
        "registrationCertificate": {
          "fileName": "certificate.pdf",
          "fileType": "application/pdf",
          "fileSize": 1024000,
          "uploadDate": "2023-01-02T00:00:00.000Z",
          "filePath": "path/to/file"
        },
        "governmentId": {
          "fileName": "id.pdf",
          "fileType": "application/pdf",
          "fileSize": 512000,
          "uploadDate": "2023-01-02T00:00:00.000Z",
          "filePath": "path/to/file"
        }
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Upload error: Unsupported file type. Allowed types: application/pdf, image/jpeg, image/png"
    }
    ```

### Download Doctor Document

Downloads a specific document from the doctor's profile.

- **URL**: `/profile/documents/:documentType`
- **Method**: `GET`
- **Authentication**: Required (doctor role)
- **URL Parameters**:
  - `documentType`: Type of document to download (registrationCertificate or governmentId)
- **Response**:
  - **Success**: The file is streamed to the client with appropriate content type and disposition headers
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Invalid document type. Allowed values: registrationCertificate, governmentId"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "success": false,
      "message": "Document not found"
    }
    ```

### Set Doctor Availability

Sets the doctor's availability for appointments.

- **URL**: `/profile/availability`
- **Method**: `POST`
- **Authentication**: Required (doctor role)
- **Request Body**:
  ```json
  {
    "availableDays": {
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": true,
      "sunday": false
    },
    "availableTimeSlots": {
      "startTime": "09:00",
      "endTime": "17:00"
    },
    "weeklyHoliday": "sunday",
    "timeSlots": [
      {
        "day": "monday",
        "slots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "isAvailable": true
          },
          {
            "startTime": "10:00",
            "endTime": "11:00",
            "isAvailable": true
          }
        ]
      }
    ]
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Availability set successfully",
      "data": {
        "_id": "availability_id",
        "doctorId": "doctor_id",
        "workingDays": {
          "monday": true,
          "tuesday": true,
          "wednesday": true,
          "thursday": true,
          "friday": true,
          "saturday": true,
          "sunday": false
        },
        "startTime": "09:00",
        "endTime": "17:00",
        "weeklyHoliday": "sunday",
        "timeSlots": [
          {
            "day": "monday",
            "slots": [
              {
                "startTime": "09:00",
                "endTime": "10:00",
                "isAvailable": true
              },
              {
                "startTime": "10:00",
                "endTime": "11:00",
                "isAvailable": true
              }
            ]
          }
        ],
        "createdAt": "2023-01-02T00:00:00.000Z",
        "updatedAt": "2023-01-02T00:00:00.000Z"
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Missing required fields: availableDays, availableTimeSlots"
    }
    ```

### Get Doctor Availability

Retrieves the doctor's availability settings.

- **URL**: `/profile/availability`
- **Method**: `GET`
- **Authentication**: Required (doctor role)
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Availability retrieved successfully",
      "data": {
        "_id": "availability_id",
        "doctorId": "doctor_id",
        "workingDays": {
          "monday": true,
          "tuesday": true,
          "wednesday": true,
          "thursday": true,
          "friday": true,
          "saturday": true,
          "sunday": false
        },
        "startTime": "09:00",
        "endTime": "17:00",
        "weeklyHoliday": "sunday",
        "timeSlots": [
          {
            "day": "monday",
            "slots": [
              {
                "startTime": "09:00",
                "endTime": "10:00",
                "isAvailable": true
              },
              {
                "startTime": "10:00",
                "endTime": "11:00",
                "isAvailable": true
              }
            ]
          }
        ],
        "createdAt": "2023-01-02T00:00:00.000Z",
        "updatedAt": "2023-01-02T00:00:00.000Z"
      }
    }
    ```
  - **Error (404)**:
    ```json
    {
      "success": false,
      "message": "Availability not found for this doctor"
    }
    ```

## File Upload Specifications

### Allowed File Types

- **Documents** (registrationCertificate, governmentId):
  - PDF (application/pdf)
  - JPEG (image/jpeg)
  - PNG (image/png)

- **Profile Photo**:
  - JPEG (image/jpeg)
  - PNG (image/png)

### File Size Limits

- **Documents**: Maximum size defined in FILE_SIZE_LIMITS.DOCTOR_DOCUMENT (typically 5MB)
- **Profile Photo**: Maximum size defined in FILE_SIZE_LIMITS.DOCTOR_DOCUMENT (typically 2MB)

## Data Models

### Doctor Model

```javascript
{
  name: String,                  // Required
  email: String,                 // Required, unique
  password: String,              // Required (min 6 chars)
  googleId: String,              // Optional
  specialization: String,        // Optional
  experience: Number,            // Optional
  hospitalAffiliation: String,   // Optional
  hospitalAddress: String,       // Optional
  licenseNumber: String,         // Optional, unique
  issuingMedicalCouncil: String, // Optional
  languages: [String],           // Optional
  phone: String,                 // Optional
  emergencyContact: String,      // Optional
  consultationFee: Number,       // Optional
  consultationAddress: String,   // Optional
  location: String,              // Optional
  registrationCertificate: {     // Optional
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: Date,
    filePath: String
  },
  governmentId: {                // Optional
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: Date,
    filePath: String
  },
  bio: String,                   // Optional
  photoURL: String,              // Optional
  profileCompleted: Boolean,     // Default: false
  isEmailVerified: Boolean,      // Default: false
  emailVerifiedAt: Date,         // Default: null
  termsAccepted: Boolean,        // Required, default: false
  termsAcceptedAt: Date,         // Default: null
  role: String,                  // Default: 'doctor'
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

### Availability Model

```javascript
{
  doctorId: ObjectId,            // Required, reference to Doctor
  workingDays: {                 // Default values
    monday: Boolean,             // Default: true
    tuesday: Boolean,            // Default: true
    wednesday: Boolean,          // Default: true
    thursday: Boolean,           // Default: true
    friday: Boolean,             // Default: true
    saturday: Boolean,           // Default: true
    sunday: Boolean              // Default: false
  },
  startTime: String,             // Required, default: '09:00'
  endTime: String,               // Required, default: '17:00'
  weeklyHoliday: String,         // Default: 'sunday'
  timeSlots: [                   // Optional
    {
      day: String,               // One of: monday, tuesday, etc.
      slots: [
        {
          startTime: String,
          endTime: String,
          isAvailable: Boolean   // Default: true
        }
      ]
    }
  ],
  createdAt: Date,               // Auto-generated
  updatedAt: Date                // Auto-generated
}
```

## Error Handling

All endpoints use standardized error responses:

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Error response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* Optional detailed errors */ }
}
```