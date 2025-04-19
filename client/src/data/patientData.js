// Mock patient submissions and responses

export const patientSubmissions = [
  {
    id: 'sub_123456789',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientEmail: 'john.doe@example.com',
    patientPhone: '+91 9876543210',
    emergencyContact: '+91 9876543211',
    relation: 'Self',
    problem: 'Persistent headache and dizziness for the past two weeks',
    documents: [
      { name: 'MRI_Report.pdf', url: '/mock-files/mri_report.pdf' },
      { name: 'Blood_Test.pdf', url: '/mock-files/blood_test.pdf' }
    ],
    doctorId: '1',
    createdAt: '2023-06-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: 'sub_987654321',
    patientName: 'Jane Smith',
    patientAge: 32,
    patientGender: 'Female',
    patientEmail: 'jane.smith@example.com',
    patientPhone: '+91 9876543212',
    emergencyContact: '+91 9876543213',
    relation: 'Self',
    problem: 'Lower back pain that radiates down the left leg',
    documents: [
      { name: 'X-Ray_Report.pdf', url: '/mock-files/xray_report.pdf' },
      { name: 'Previous_Treatment.pdf', url: '/mock-files/previous_treatment.pdf' }
    ],
    doctorId: '2',
    createdAt: '2023-06-18T14:45:00Z',
    status: 'pending'
  }
];

export const doctorResponses = [
  {
    id: 'resp_123456789',
    submissionId: 'sub_123456789',
    requiredSecondOpinion: false,
    responseText: "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort.",
    documents: [
      { id: 1, name: "File.pdf", url: "/mock-files/file1.pdf" },
      { id: 2, name: "Report.pdf", url: "/mock-files/report1.pdf" },
      { id: 3, name: "File.pdf", url: "/mock-files/file2.pdf" },
      { id: 4, name: "Report.pdf", url: "/mock-files/report2.pdf" }
    ],
    doctorId: "1",
    createdAt: '2023-06-16T09:15:00Z'
  },
  {
    id: 'resp_987654321',
    submissionId: 'sub_987654321',
    requiredSecondOpinion: true,
    responseText: "Based on your symptoms and the provided documents, I recommend a second opinion. The pain radiating down your leg suggests potential nerve involvement. I'd like to schedule a more detailed examination to rule out any serious conditions. In the meantime, try gentle stretching exercises and avoid activities that exacerbate the pain.",
    documents: [
      { id: 1, name: "Recommendation.pdf", url: "/mock-files/recommendation.pdf" },
      { id: 2, name: "Exercise_Guide.pdf", url: "/mock-files/exercise_guide.pdf" }
    ],
    doctorId: "2",
    createdAt: '2023-06-19T11:30:00Z'
  }
];

export const patientFeedback = [
  {
    id: 'feed_123456789',
    responseId: 'resp_123456789',
    rating: 5,
    comment: 'Great experience and smooth process. The doctor was very thorough and provided clear instructions.',
    createdAt: '2023-06-17T14:20:00Z'
  },
  {
    id: 'feed_987654321',
    responseId: 'resp_987654321',
    rating: 4,
    comment: 'Good advice and quick response. Would have appreciated more detailed information about potential causes.',
    createdAt: '2023-06-20T10:45:00Z'
  }
];

// Helper functions to work with the mock data
export const getSubmissionById = (id) => {
  return patientSubmissions.find(submission => submission.id === id) || null;
};

export const getResponseBySubmissionId = (submissionId) => {
  return doctorResponses.find(response => response.submissionId === submissionId) || null;
};

export const getFeedbackByResponseId = (responseId) => {
  return patientFeedback.find(feedback => feedback.responseId === responseId) || null;
};