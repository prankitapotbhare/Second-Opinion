"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaStar, FaSpinner, FaCalendarAlt, FaCheckCircle, FaHome } from 'react-icons/fa';
import { usePatient } from '@/contexts/PatientContext';
import DateTimePicker from '@/components/common/DateTimePicker';

export default function ResponsePage() {
  const { 
    doctorResponse, 
    loading, 
    error, 
    feedbackSubmitted, 
    setFeedbackSubmitted,
    appointmentRequested,
    appointmentDetails,
    submitFeedbackToDoctor,
    requestAppointment
  } = usePatient();
  
  const [activeTab, setActiveTab] = useState('response');
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

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
        <Link href="/user/doctors" className="text-teal-600 hover:underline">
          Go back to doctors
        </Link>
      </div>
    );
  }

  if (!doctorResponse) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-gray-700 text-xl mb-4">No response available yet. Please check back later.</div>
        <Link href="/user/doctors" className="text-teal-600 hover:underline">
          Go back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Second Opinion</h1>
            <Link href="/user/doctors" className="text-teal-600 hover:underline flex items-center">
              <FaHome className="mr-1" /> Home
            </Link>
          </div>
        </div>
      </header>

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
            {/* Appointment Confirmation Section (if appointment requested) */}
            {appointmentRequested && (
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">Confirmed! <span className="text-teal-600">✓</span></h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                  <p className="text-teal-600">
                    Your appointment request for {appointmentDetails?.time} has been Approved
                  </p>
                </div>
              </div>
            )}
            
            {/* Required Field Section */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Required(Yes or No)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <div className={`w-full text-gray-800 ${doctorResponse.requiredSecondOpinion ? 'text-teal-600' : ''}`}>
                  {doctorResponse.requiredSecondOpinion ? (
                    <div>
                      <p>Yes, Second opinion needed. Please choose a date and time.</p>
                      {!appointmentRequested && (
                        <button 
                          onClick={handleRequestAppointment}
                          className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaCalendarAlt className="mr-2" />
                          )}
                          Choose Date & Time
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>No, a second opinion is not required at this time.</p>
                  )}
                </div>
              </div>
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
              <div className="grid grid-cols-3 gap-6">
                {doctorResponse.documents.map((doc) => (
                  <div key={doc.id} className="bg-purple-50 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                    <div className="bg-teal-600 text-white p-3 rounded-lg mb-2">
                      <FaFileAlt className="text-xl" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm text-center">{doc.name}</span>
                  </div>
                ))}
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
                    Comments :-
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Great service and smooth experience. Will book again!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ratings :-
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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Date Time Picker Modal */}
      {showDateTimePicker && (
        <DateTimePicker 
          onSelect={handleDateTimeSelect} 
          onClose={() => setShowDateTimePicker(false)} 
        />
      )}
    </div>
  );
}