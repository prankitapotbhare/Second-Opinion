"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaStar, FaSpinner, FaCalendarAlt, FaCheckCircle, FaHome } from 'react-icons/fa';
import { usePatient } from '@/contexts/PatientContext';
import DateTimePicker from './components/DateTimePicker';

export default function ResponsePage() {
  const { 
    doctorResponse, 
    loading, 
    error, 
    feedbackSubmitted, 
    setFeedbackSubmitted,
    appointmentRequested,
    appointmentDetails,
    appointmentStatus,
    submitFeedbackToDoctor,
    requestAppointment,
    checkAppointmentStatusUpdate
  } = usePatient();
  
  const [activeTab, setActiveTab] = useState('response');
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  
  // Use a ref to track if the status check has been initialized
  const statusCheckInitialized = useRef(false);
  // Store the interval ID in a ref to avoid it being a dependency
  const intervalIdRef = useRef(null);

  // Fetch response data on mount if needed
  useEffect(() => {
    // You could add additional logic here if needed
  }, []);

  // Fix the infinite loop by using a ref to track initialization
  useEffect(() => {
    // Only set up the interval if:
    // 1. It hasn't been initialized yet
    // 2. We have a pending appointment
    // 3. We're not already checking (no existing interval)
    if (
      !statusCheckInitialized.current && 
      appointmentRequested && 
      appointmentStatus === 'pending' &&
      !intervalIdRef.current
    ) {
      // Mark as initialized
      statusCheckInitialized.current = true;
      
      // Check status immediately
      checkAppointmentStatusUpdate();
      
      // Set up interval to check every 10 seconds
      intervalIdRef.current = setInterval(() => {
        checkAppointmentStatusUpdate();
      }, 10000);
    }
    
    // If appointment is no longer pending, clear the interval
    if (appointmentStatus !== 'pending' && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    // Clean up on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [appointmentRequested, appointmentStatus, checkAppointmentStatusUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!doctorResponse) {
        throw new Error('No response data available');
      }
      
      // Submit the feedback
      await submitFeedbackToDoctor(doctorResponse.id, rating, comment);
      
      // Reset form
      setComment('');
      setRating(3);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAppointment = () => {
    setShowDateTimePicker(true);
  };

  const handleDateTimeSelect = async (dateTime) => {
    if (!doctorResponse) return;
    
    setSubmitting(true);
    setShowDateTimePicker(false);
    
    try {
      // Request a second opinion appointment with date/time
      await requestAppointment(doctorResponse.id, dateTime);
      
      // Reset the initialization flag to allow setting up a new interval
      statusCheckInitialized.current = false;
    } catch (err) {
      console.error('Error requesting appointment:', err);
      alert('Failed to request appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-teal-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link href="/patient/doctors" className="text-teal-600 hover:underline">
          Go back to doctors
        </Link>
      </div>
    );
  }

  if (!doctorResponse) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-gray-700 text-xl mb-4">No response available yet. Please check back later.</div>
        <Link href="/patient/doctors" className="text-teal-600 hover:underline">
          Go back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Date Time Picker Modal */}
      {showDateTimePicker && (
        <DateTimePicker
          onSelect={handleDateTimeSelect}
          onClose={() => setShowDateTimePicker(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-between border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('response')}
          >
            Response({doctorResponse ? '1' : '0'})
          </button>
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'comments' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('comments')}
          >
            Comments & Ratings
          </button>
        </div>

        {/* Response Section */}
        {activeTab === 'response' && (
          <div>
            {/* Appointment Status Section */}
            {appointmentRequested && (
              <div className="mb-6">
                {appointmentStatus === 'approved' ? (
                  <>
                    <h3 className="text-xl font-medium mb-2">Confirmed! <span className="text-teal-600">✓</span></h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                      <p className="text-teal-600">
                        Your appointment request for {appointmentDetails?.date} at {appointmentDetails?.time} has been approved.
                      </p>
                      {appointmentDetails?.doctorNotes && (
                        <p className="mt-2 text-gray-700">
                          <strong>Doctor's note:</strong> {appointmentDetails.doctorNotes}
                        </p>
                      )}
                    </div>
                  </>
                ) : appointmentStatus === 'rejected' ? (
                  <>
                    <h3 className="text-xl font-medium mb-2">Appointment Rejected</h3>
                    <div className="bg-white border border-red-200 rounded-lg p-6 mb-8 shadow-sm">
                      <p className="text-red-600">
                        Your appointment request for {appointmentDetails?.date} at {appointmentDetails?.time} was not approved.
                      </p>
                      {appointmentDetails?.rejectionReason && (
                        <p className="mt-2 text-gray-700">
                          <strong>Reason:</strong> {appointmentDetails.rejectionReason}
                        </p>
                      )}
                      <button 
                        onClick={handleRequestAppointment}
                        className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                      >
                        <FaCalendarAlt className="mr-2" />
                        Choose Another Time
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium mb-2">Appointment Pending</h3>
                    <div className="bg-white border border-yellow-200 rounded-lg p-6 mb-8 shadow-sm">
                      <div className="flex items-center">
                        <FaSpinner className="animate-spin text-yellow-500 mr-2" />
                        <p className="text-yellow-700">
                          Your appointment request for {appointmentDetails?.date} at {appointmentDetails?.time} is pending approval.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Required Field Section */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Required(Yes or No)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <div className={`w-full text-gray-800 ${doctorResponse.requiredSecondOpinion ? 'text-teal-600' : ''}`}>
                  <div className="flex justify-between items-center">
                    {doctorResponse.requiredSecondOpinion ? (
                      <p>Yes, Second opinion needed. Please choose a date and time.</p>
                    ) : (
                      <p>No, a second opinion is not required at this time.</p>
                    )}
                  </div>
                </div>
              </div>
              {doctorResponse.requiredSecondOpinion && !appointmentRequested && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleRequestAppointment}
                    className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCalendarAlt className="mr-2" />
                    )}
                    Choose Date & Time
                  </button>
                </div>
              )}
            </div>

            {/* Message Section */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Message</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <p className="text-gray-800 whitespace-pre-line">{doctorResponse.responseText}</p>
              </div>
            </div>

            {/* Documents Section */}
            <h3 className="text-xl font-medium mb-2">Documents</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {doctorResponse.documents && doctorResponse.documents.length > 0 ? (
                  doctorResponse.documents.map((doc) => (
                    <div key={doc.id} className="bg-purple-50 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                      <div className="bg-teal-600 text-white p-3 rounded-lg mb-2">
                        <FaFileAlt className="text-xl" />
                      </div>
                      <span className="text-gray-800 font-medium text-sm text-center">{doc.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-3 text-center py-4">No documents available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments & Ratings Section */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-medium mb-6">Comments & Ratings</h3>
            
            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                <p className="text-lg text-gray-700">Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Share your experience with the doctor's response..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <button
                          type="button"
                          key={ratingValue}
                          className={`text-2xl ${
                            (hover || rating) >= ratingValue ? 'text-yellow-400' : 'text-gray-300'
                          } focus:outline-none mr-1`}
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                          disabled={submitting}
                        >
                          <FaStar />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-gray-600">
                      {rating} out of 5
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}