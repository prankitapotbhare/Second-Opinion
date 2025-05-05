Here is an API documentation for the endpoint `GET /response` as defined in your code. This documentation covers all possible responses, including the structure and meaning of each field, based on your controller and model.

---

## GET `/response`

**Description:**  
Retrieve the latest response submission for the authenticated patient. Returns the submission's ID, status, doctor response (if available), and appointment details (if available).

**Authentication:**  
Required (Patient role)

---

### **Response: 200 OK**

#### **Success Response Body**
```json
{
  "success": true,
  "data": {
    "id": "string",                // Submission ObjectId
    "status": "string",            // Submission status (see below)
    "doctorResponse": {            // Doctor's response object or null
      "message": "string",
      "responseDate": "ISODate",
      "secondOpinionRequired": true,
      "responseFiles": [
        {
          "fileName": "string",
          "fileType": "string",
          "fileSize": 12345,
          "uploadDate": "ISODate",
          "filePath": "string"
        }
      ]
    },
    "appointmentDetails": {        // Appointment details object or null
      "date": "ISODate",
      "time": "string",
      "notes": "string",
      "isCompleted": true,
      "completedAt": "ISODate"
    }
  }
}
```

#### **Field Details**

- **id**: The unique identifier of the submission.
- **status**: The current status of the submission. Possible values:
  - `"pending"`
  - `"opinion-needed"`
  - `"opinion-not-needed"`
  - `"under-review"`
  - `"approved"`
  - `"rejected"`
  - `"completed"`
- **doctorResponse**: Object containing the doctor's response, or `null` if not available.
  - **message**: Doctor's message.
  - **responseDate**: Date and time of the doctor's response (ISO 8601 string).
  - **secondOpinionRequired**: Boolean indicating if a second opinion is required.
  - **responseFiles**: Array of files attached to the response.
    - **fileName**: Name of the file.
    - **fileType**: MIME type of the file.
    - **fileSize**: Size of the file in bytes.
    - **uploadDate**: Date and time the file was uploaded (ISO 8601 string).
    - **filePath**: Path to the file.
- **appointmentDetails**: Object containing appointment information, or `null` if not available.
  - **date**: Date of the appointment (ISO 8601 string).
  - **time**: Time of the appointment.
  - **notes**: Additional notes for the appointment.
  - **isCompleted**: Boolean indicating if the appointment is completed.
  - **completedAt**: Date and time when the appointment was completed (ISO 8601 string).

---

### **Response: 404 Not Found**

#### **Error Response Body**
```json
{
  "success": false,
  "message": "Submission not found",
  "data": {
    "status": "not_found"
  }
}
```
- This response is returned if the patient has no submissions.

---

### **Response: 500 Internal Server Error**

#### **Error Response Body**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
- This response is returned if an unexpected error occurs on the server.

---

**References:**  
- <mcfile name="patient.routes.js" path="c:\Users\manis\Projects\Second-Opinion\server\src\routes\patient.routes.js"></mcfile>  
- <mcsymbol name="getResponse" filename="patient.controller.js" path="c:\Users\manis\Projects\Second-Opinion\server\src\controllers\patient.controller.js" startline="232" type="function"></mcsymbol>  
- <mcfile name="patientDetails.model.js" path="c:\Users\manis\Projects\Second-Opinion\server\src\models\patientDetails.model.js"></mcfile>