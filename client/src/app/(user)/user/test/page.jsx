"use client";

import React, { useState } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function TestPage() {
  const { 
    setSubmission, 
    clearSubmission, 
    doctorResponse,
    appointmentStatus
  } = usePatient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Helper to create a mock submission with specific conditions
  const createMockSubmission = async (options = {}) => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Clear any existing data first
      clearSubmission();
      
      // Create a unique submission ID
      const submissionId = 'sub_test_' + Math.random().toString(36).substr(2, 9);
      
      // Create a mock response with the specified options
      const mockResponse = {
        id: 'resp_test_' + Math.random().toString(36).substr(2, 9),
        submissionId: submissionId,
        requiredSecondOpinion: options.requiresSecondOpinion ?? false,
        responseText: options.requiresSecondOpinion 
          ? "Based on your symptoms and the provided documents, I recommend a second opinion. Please schedule an appointment at your earliest convenience."
          : "After reviewing your medical records and symptoms, I don't believe a second opinion is necessary at this time.",
        documents: [
          { id: 1, name: "Test_Document.pdf", url: "/mock-files/test.pdf" }
        ],
        createdAt: new Date().toISOString(),
        // Add appointment data if specified
        ...(options.appointmentRequested && {
          appointmentRequested: true,
          appointmentDetails: options.appointmentDetails || { 
            date: '2023-12-25', 
            time: '10:00 AM' 
          },
          appointmentStatus: options.appointmentStatus || 'pending'
        })
      };
      
      // Store the mock response in localStorage
      localStorage.setItem(`response_${submissionId}`, JSON.stringify(mockResponse));
      
      // If appointment is requested, set up the appointment data
      if (options.appointmentRequested) {
        const appointmentId = 'appt_test_' + Math.random().toString(36).substr(2, 9);
        
        const appointmentData = {
          id: appointmentId,
          responseId: mockResponse.id,
          appointmentDetails: options.appointmentDetails || { 
            date: '2023-12-25', 
            time: '10:00 AM' 
          },
          requestedAt: new Date().toISOString(),
          status: options.appointmentStatus || 'pending',
          updatedAt: new Date().toISOString()
        };
        
        // Add additional data based on status
        if (options.appointmentStatus === 'approved') {
          appointmentData.doctorNotes = options.doctorNotes || "Looking forward to our appointment. Please bring any new test results.";
        } else if (options.appointmentStatus === 'rejected') {
          appointmentData.rejectionReason = options.rejectionReason || "Unable to accommodate at the requested time. Please select a different time.";
        }
        
        localStorage.setItem(`appointment_${appointmentId}`, JSON.stringify(appointmentData));
        localStorage.setItem(`appointment_for_response_${mockResponse.id}`, appointmentId);
      }
      
      // If feedback is submitted, create mock feedback
      if (options.feedbackSubmitted) {
        const feedbackId = 'feed_test_' + Math.random().toString(36).substr(2, 9);
        
        const feedbackData = {
          id: feedbackId,
          responseId: mockResponse.id,
          rating: options.rating || 5,
          comment: options.comment || "Great response, thank you!",
          submittedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`feedback_${feedbackId}`, JSON.stringify(feedbackData));
        localStorage.setItem('feedbackSubmitted', 'true');
      }
      
      // Set the submission in context
      setSubmission({ id: submissionId });
      
      setTestResult({
        success: true,
        message: `Test scenario created successfully: ${options.name || 'Unnamed scenario'}`
      });
      
      // Navigate to response page after a short delay
      setTimeout(() => {
        router.push('/user/response');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating test scenario:', error);
      setTestResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const testScenarios = [
    {
      name: "No Second Opinion Required",
      description: "Doctor has reviewed and determined no second opinion is needed",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: false,
        name: "No Second Opinion Required"
      })
    },
    {
      name: "Second Opinion Required",
      description: "Doctor recommends getting a second opinion",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: true,
        name: "Second Opinion Required"
      })
    },
    {
      name: "Appointment Pending",
      description: "Patient has requested an appointment that is pending approval",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: true,
        appointmentRequested: true,
        appointmentStatus: 'pending',
        name: "Appointment Pending"
      })
    },
    {
      name: "Appointment Approved",
      description: "Doctor has approved the appointment request",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: true,
        appointmentRequested: true,
        appointmentStatus: 'approved',
        doctorNotes: "Please bring your recent lab results to the appointment.",
        name: "Appointment Approved"
      })
    },
    {
      name: "Appointment Rejected",
      description: "Doctor has rejected the appointment request",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: true,
        appointmentRequested: true,
        appointmentStatus: 'rejected',
        rejectionReason: "I'm not available at this time. Please select another date.",
        name: "Appointment Rejected"
      })
    },
    {
      name: "Feedback Submitted",
      description: "Patient has submitted feedback for the doctor's response",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: false,
        feedbackSubmitted: true,
        rating: 4,
        comment: "Thank you for your thorough review of my case.",
        name: "Feedback Submitted"
      })
    },
    {
      name: "Complete Flow",
      description: "Second opinion required, appointment approved, and feedback submitted",
      action: () => createMockSubmission({ 
        requiresSecondOpinion: true,
        appointmentRequested: true,
        appointmentStatus: 'approved',
        doctorNotes: "Looking forward to our appointment.",
        feedbackSubmitted: true,
        rating: 5,
        comment: "Excellent service and quick response!",
        name: "Complete Flow"
      })
    },
    {
      name: "Clear Session",
      description: "Clear all patient data and return to doctors page",
      action: () => {
        clearSubmission();
        setTestResult({
          success: true,
          message: "Session cleared successfully"
        });
        setTimeout(() => {
          router.push('/user/doctors');
        }, 1000);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Test Scenarios</h1>
          <p className="text-gray-600 mb-6">
            Select a scenario to test different parts of the patient response workflow
          </p>
          
          {/* Test Result Message */}
          {testResult && (
            <div className={`mb-6 p-4 rounded-md ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult.success ? (
                <div className="flex items-center">
                  <FaCheckCircle className="mr-2" />
                  {testResult.message}
                </div>
              ) : (
                <div>
                  {testResult.message}
                </div>
              )}
            </div>
          )}
          
          {/* Current State Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Current State:</h3>
            <div className="text-sm text-gray-600">
              <p>Doctor Response: {doctorResponse ? 'Loaded' : 'None'}</p>
              <p>Appointment Status: {appointmentStatus || 'None'}</p>
            </div>
          </div>
          
          {/* Scenario Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testScenarios.map((scenario, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </div>
                <div className="p-4">
                  <button
                    onClick={scenario.action}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      `Test ${scenario.name}`
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}