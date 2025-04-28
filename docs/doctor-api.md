# Doctor API Documentation

This document provides details about the Doctor API endpoints available in the Second Opinion application.

## Base URL

All endpoints are relative to the base URL: `/api/doctor`

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

Updates the profile of the authenticated doctor. This endpoint now supports document uploads.

- **URL**: `/profile`
- **Method**: `PUT`
- **Authentication**: Required (doctor role)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `name` (string, optional): Doctor's name
  - `specialization` (string, optional): Doctor's specialization
  - `experience` (number, optional): Years of experience
  - `hospitalAffiliation` (string, optional): Hospital affiliation
  - `hospitalAddress` (string, optional): Hospital address
  - `licenseNumber` (string, optional): Medical license number
  - `issuingMedicalCouncil` (string, optional): Issuing medical council
  - `languages` (array, optional): Languages spoken
  - `phone` (string, optional): Contact phone number
  - `emergencyContact` (string, optional): Emergency contact
  - `education` (string, optional): Educational background
  - `registrationCertificate` (file, optional): Registration certificate document
  - `governmentId` (file, optional): Government ID document
  - `profilePhoto` (file, optional): Profile photo
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
        "specialization": "Updated Specialization",
        // Updated fields
        "updatedAt": "2023-01-02T00:00:00.000Z"
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Invalid file type. Allowed types: application/pdf, image/jpeg, image/png"
    }
    ```

### Complete Doctor Profile

Completes the doctor's profile with required information and documents.

- **URL**: `/profile/complete`
- **Method**: `POST`
- **Authentication**: Required (doctor role)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `specialization` (string, required): Doctor's specialization
  - `experience` (number, required): Years of experience
  - `licenseNumber` (string, required): Medical license number
  - `education` (string, required): Educational background
  - `hospitalAffiliation` (string, optional): Hospital affiliation
  - `hospitalAddress` (string, optional): Hospital address
  - `issuingMedicalCouncil` (string, optional): Issuing medical council
  - `languages` (array, optional): Languages spoken
  - `phone` (string, optional): Contact phone number
  - `emergencyContact` (string, optional): Emergency contact
  - `registrationCertificate` (file, optional): Registration certificate document
  - `governmentId` (file, optional): Government ID document
  - `profilePhoto` (file, optional): Profile photo
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

### Download Doctor Document

Downloads a specific document uploaded by the doctor.

- **URL**: `/profile/documents/:documentType`
- **Method**: `GET`
- **Authentication**: Required (doctor role)
- **URL Parameters**:
  - `documentType` (string, required): Type of document to download. Allowed values: `registrationCertificate`, `governmentId`
- **Response**:
  - **Success**: The document file is streamed to the client
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
  - `workingDays` (object, required): Working days configuration
    ```json
    {
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": true,
      "friday": true,
      "saturday": true,
      "sunday": false
    }
    ```
  - `startTime` (string, required): Start time in 24-hour format (e.g., "09:00")
  - `endTime` (string, required): End time in 24-hour format (e.g., "17:00")
  - `weeklyHoliday` (string, optional): Day of the week for weekly holiday
  - `timeSlots` (array, optional): Specific time slots configuration
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
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Missing required fields: workingDays, startTime, endTime"
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
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
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

### Delete Doctor Account

Deletes the doctor's account and all associated data.

- **URL**: `/account`
- **Method**: `DELETE`
- **Authentication**: Required (doctor role)
- **Response**:
  - **Success (200)**:
    ```json
    {
      "success": true,
      "message": "Account deleted successfully"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "success": false,
      "message": "Doctor not found"
    }
    ```

## Error Responses

All endpoints may return the following error responses:

- **Unauthorized (401)**:
  ```json
  {
    "success": false,
    "message": "Unauthorized - No token provided"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Unauthorized - Invalid token"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Unauthorized - Token expired",
    "tokenExpired": true
  }
  ```

- **Forbidden (403)**:
  ```json
  {
    "success": false,
    "message": "Forbidden - You do not have permission to access this resource"
  }
  ```

- **Server Error (500)**:
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```