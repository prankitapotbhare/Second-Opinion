"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaStar, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import { submitFeedback, requestSecondOpinion } from '@/api/patient.api';
import { usePatient } from '@/contexts/PatientContext';

export default function ResponsePage() {
  const { doctorResponse, loading, error } = usePatient();
  const [activeTab, setActiveTab] = useState('response');
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [appointmentRequested, setAppointmentRequested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!doctorResponse) {
        throw new Error('No response data available');
      }
      
      // Submit the feedback
      await submitFeedback(doctorResponse.id, rating, comment);
      setFeedbackSubmitted(true);
      
      // Reset form
      setComment('');
      setRating(4);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAppointment = async () => {
    if (!doctorResponse) return;
    
    setSubmitting(true);
    
    try {
      // Request a second opinion appointment
      await requestSecondOpinion(doctorResponse.id);
      setAppointmentRequested(true);
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
        <div className="text-center">
          <FaSpinner className="animate-spin text-teal-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor's response...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/user/doctors">
            <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors">
              Find a Doctor
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!doctorResponse) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">Your document has been successfully submitted, wait for response</p>
          <Link href="/user/doctors">
            <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors">
              Back to Doctors
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-between border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('response')}
          >
            Response (1)
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
            {/* Required Field Section */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Required(Yes or No)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
                <div className={`w-full text-gray-800 ${doctorResponse.requiredSecondOpinion ? 'text-teal-600' : ''}`}>
                  {doctorResponse.requiredSecondOpinion 
                    ? 'Yes, Second opinion needed. Please choose a date and time.' 
                    : 'No second opinion needed. Please follow the doctor\'s advice.'}
                </div>
                
                {doctorResponse.requiredSecondOpinion && !appointmentRequested && (
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={handleRequestAppointment}
                      disabled={submitting}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCalendarAlt className="mr-2" />
                          Choose Date & Time
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {appointmentRequested && (
                  <div className="mt-4 text-green-600 text-sm">
                    Your appointment request has been submitted. We'll contact you shortly.
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
              <p className="text-gray-800 leading-relaxed">
                {doctorResponse.responseText}
              </p>
            </div>

            <h2 className="text-2xl font-medium mb-6">Documents</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {doctorResponse.documents.map((doc) => (
                  <div key={doc.id} className="bg-purple-50 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                    <div className="bg-teal-600 text-white p-4 rounded-lg mb-3">
                      <FaFileAlt className="text-2xl" />
                    </div>
                    <span className="text-gray-800 font-medium">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments & Ratings Section */}
        {activeTab === 'comments' && (
          <div>
            <h2 className="text-xl font-medium mb-6">Comments & Ratings</h2>
            
            {feedbackSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 shadow-sm text-center">
                <p className="text-green-700 mb-4">Thank you for your feedback!</p>
                <button 
                  onClick={() => setFeedbackSubmitted(false)}
                  className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Submit Another Comment
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Comments</h3>
                    <textarea 
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Great experience and smooth experience"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Ratings</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <label key={index} className="cursor-pointer">
                            <input 
                              type="radio" 
                              name="rating" 
                              className="hidden" 
                              value={ratingValue}
                              onClick={() => setRating(ratingValue)}
                            />
                            <FaStar 
                              className="w-8 h-8 mr-1"
                              color={ratingValue <= (hover || rating) ? "#FFB800" : "#e4e5e9"}
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(null)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className={`bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin inline mr-2" />
                          Sending...
                        </>
                      ) : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}