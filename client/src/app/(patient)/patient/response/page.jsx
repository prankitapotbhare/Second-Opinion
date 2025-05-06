"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaStar, FaSpinner, FaCalendarAlt, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { usePatient } from '@/contexts/PatientContext';
import DateTimePicker from './components/DateTimePicker';

export default function ResponsePage() {
  const { 
    patientResponse, 
    responseLoading, 
    responseError, 
    fetchPatientResponse,
    requestDoctorAppointment,
    submitDoctorReview,
    reviewSubmitLoading,
    reviewSubmitSuccess
  } = usePatient();

  const [activeTab, setActiveTab] = useState('response');
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch patient response on component mount
  useEffect(() => {
    fetchPatientResponse();
  }, [fetchPatientResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientResponse || !patientResponse.id) {
      alert('No submission found');
      return;
    }
    
    try {
      await submitDoctorReview(patientResponse.id, {
        rating,
        comment
      });
      
      if (reviewSubmitSuccess) {
        setComment('');
        setRating(3);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review: ' + error.message);
    }
  };

  // Update the handleRequestAppointment function to log the doctorId
  const handleRequestAppointment = () => {
    if (!patientResponse || !patientResponse.doctorId) {
      console.error('No doctorId available in patientResponse:', patientResponse);
      alert('Doctor information is missing. Please try again later.');
      return;
    }
    console.log('Opening date picker with doctorId:', patientResponse.doctorId);
    setShowDateTimePicker(true);
  };

  const handleDateTimeSelect = async (dateTimeData) => {
    setSubmitting(true);
    
    try {
      if (patientResponse && patientResponse.id) {
        await requestDoctorAppointment(patientResponse.id, {
          date: dateTimeData.date,
          time: dateTimeData.time,
          notes: ''
        });
        
        // Refresh the response data
        await fetchPatientResponse();
        setShowDateTimePicker(false);
      } else {
        alert('No submission found');
      }
    } catch (error) {
      console.error('Error requesting appointment:', error);
      alert('Failed to request appointment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (responseLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-teal-600 text-4xl" />
      </div>
    );
  }

  if (responseError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-red-600 mb-4 text-xl">Error: {responseError}</div>
        <p className="text-gray-600 mb-6">
          {responseError === 'No submissions found' 
            ? 'You have not submitted any requests for a second opinion yet.' 
            : 'There was an error loading your response. Please try again later.'}
        </p>
        <Link 
          href="/patient/doctors" 
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          Find a Doctor
        </Link>
      </div>
    );
  }

  // If no response data is available
  if (!patientResponse) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-6 text-xl">No response available</div>
        <Link 
          href="/patient/doctors" 
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          Find a Doctor
        </Link>
      </div>
    );
  }

  // Determine if appointment is requested - check if date and time are set
  const appointmentRequested = patientResponse.status === 'approved' || 
                               patientResponse.status === 'rejected' || 
                               patientResponse.status === 'under-review';
  const appointmentStatus = patientResponse.status;
  const feedbackSubmitted = reviewSubmitSuccess;

  return (
    <div className="min-h-screen bg-white">
      {/* Replace the inline DateTimePicker with the component */}
      {showDateTimePicker && (
        <DateTimePicker 
          onSelect={handleDateTimeSelect}
          onClose={() => setShowDateTimePicker(false)}
          doctorId={patientResponse.doctorId}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('response')}
          >
            Response(1)
          </button>
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'comments' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('comments')}
          >
            Comments & Ratings
          </button>
        </div>

        {activeTab === 'response' && (
          <div>
            {appointmentRequested && (
              <div className="mb-6">
                {appointmentStatus === 'approved' ? (
                  <>
                    <h3 className="text-xl font-medium mb-2">Confirmed! <span className="text-teal-600">✓</span></h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                      <p className="text-teal-600">
                        Your appointment request for {patientResponse.formattedDate} at {patientResponse.formattedTime} has been approved.
                      </p>
                      {patientResponse.appointmentDetails?.notes && (
                        <p className="mt-2 text-gray-700">
                          <strong>Doctor's note:</strong> {patientResponse.appointmentDetails.notes}
                        </p>
                      )}
                    </div>
                  </>
                ) : appointmentStatus === 'rejected' ? (
                  <>
                    <h3 className="text-xl font-medium mb-2">Appointment Rejected</h3>
                    <div className="bg-white border border-red-200 rounded-lg p-6 mb-8 shadow-sm">
                      <p className="text-red-600">
                        Your appointment request for {patientResponse.formattedDate} at {patientResponse.formattedTime} was not approved.
                      </p>
                      <button 
                        onClick={handleRequestAppointment}
                        className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
                      >
                        <FaCalendarAlt className="mr-2" />
                        Choose Another Time
                      </button>
                    </div>
                  </>
                ) : appointmentStatus === 'under-review' ? (
                  <>
                    <h3 className="text-xl font-medium mb-2">Appointment Under Review</h3>
                    <div className="bg-white border border-yellow-200 rounded-lg p-6 mb-8 shadow-sm">
                      <div className="flex items-center">
                        <FaSpinner className="animate-spin text-yellow-500 mr-2" />
                        <p className="text-yellow-700">
                          Your appointment request for {patientResponse.formattedDate} at {patientResponse.formattedTime} is under review.
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Required(Yes or No)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <div className={`w-full text-gray-800 ${patientResponse.statusColor === 'teal' || patientResponse.statusColor === 'green' ? 'text-teal-600' : ''}`}>
                  <div className="flex justify-between items-center">
                    {patientResponse.status === 'pending' ? (
                      <div className="flex items-center">
                        <FaSpinner className="animate-spin text-yellow-500 mr-2" />
                        <p className="text-yellow-700">Your submission is pending review by the doctor.</p>
                      </div>
                    ) : patientResponse.status === 'opinion-needed' ? (
                      <p className="text-teal-600">Yes, a second opinion is needed. Please choose a date and time for your appointment.</p>
                    ) : patientResponse.status === 'opinion-not-needed' ? (
                      <p>No, a second opinion is not required at this time. The doctor has reviewed your case and provided feedback.</p>
                    ) : patientResponse.status === 'under-review' ? (
                      <p className="text-purple-700">Yes, a second opinion is needed. Your appointment request is currently under review by the doctor.</p>
                    ) : patientResponse.status === 'approved' ? (
                      <p className="text-green-600">Yes, a second opinion is needed. Your appointment has been approved.</p>
                    ) : patientResponse.status === 'rejected' ? (
                      <p className="text-red-600">Yes, a second opinion is needed. Your appointment request was not approved. You may request a new time.</p>
                    ) : patientResponse.status === 'completed' ? (
                      <p className="text-green-600">Yes, a second opinion was needed. Your consultation has been completed.</p>
                    ) : (
                      <p>Status: {patientResponse.statusText}</p>
                    )}
                  </div>
                </div>
              </div>
              {patientResponse.status === 'opinion-needed' && !appointmentRequested && (
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

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Message</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                <p className="text-gray-800 whitespace-pre-line">{patientResponse.doctorResponse?.message || 'No message available'}</p>
              </div>
            </div>

            <h3 className="text-xl font-medium mb-2">Documents</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {patientResponse.doctorResponse?.responseFiles && patientResponse.doctorResponse.responseFiles.length > 0 ? (
                  patientResponse.doctorResponse.responseFiles.map((file, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow">
                      <div className="bg-teal-600 text-white p-3 rounded-lg mb-2">
                        <FaFileAlt className="text-xl" />
                      </div>
                      <span className="text-gray-800 font-medium text-sm text-center mb-2">{file.fileName}</span>
                      <a 
                        href={file.filePath} 
                        download={file.fileName}
                        className="text-teal-600 text-sm flex items-center hover:underline"
                      >
                        <FaDownload className="mr-1" size={12} />
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-3 text-center py-4">No documents available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
        <div>
        <h3 className="text-xl font-medium mb-4">Rate Your Experience</h3>
        
        {appointmentStatus === 'approved' || appointmentStatus === 'completed' ? (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        {reviewSubmitSuccess ? (
        <div className="flex items-center text-green-600 mb-4">
        <FaCheckCircle className="mr-2" />
        Thank you for your feedback!
        </div>
        ) : (
        <>
        <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating</label>
        <div className="flex">
        {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
        <label key={i} className="cursor-pointer">
        <input
        type="radio"
        name="rating"
        className="hidden"
        value={ratingValue}
        onClick={() => setRating(ratingValue)}
        />
        <FaStar
        className="mr-1"
        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
        size={24}
        onMouseEnter={() => setHover(ratingValue)}
        onMouseLeave={() => setHover(null)}
        />
        </label>
        );
        })}
        <span className="ml-2 text-gray-600">{rating}/5</span>
        </div>
        </div>
        
        <div className="mb-4">
        <label className="block text-gray-700 mb-2">Comment</label>
        <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        rows="4"
        placeholder="Share your experience with the doctor..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        ></textarea>
        </div>
        
        <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center"
        disabled={reviewSubmitLoading}
        >
        {reviewSubmitLoading ? (
        <>
        <FaSpinner className="animate-spin mr-2" />
        Submitting...
        </>
        ) : (
        'Submit Review'
        )}
        </button>
        </>
        )}
        </form>
        ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <p className="text-gray-600">
        You can submit a review after your appointment has been approved and completed.
        </p>
        </div>
        )}
        </div>
        )}
      </main>
    </div>
  );
}