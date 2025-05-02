"use client";

import React, { useState, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import Image from 'next/image';

// Patient Reviews Carousel Component
const PatientReviewsCarousel = ({ doctor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { 
    reviews, 
    reviewsLoading, 
    reviewsError, 
    fetchDoctorReviews,
    reviewsPagination,
    averageRating
  } = usePatient();

  // Fetch reviews when doctor changes or page changes
  useEffect(() => {
    if (doctor && doctor.id) {
      fetchDoctorReviews(doctor.id, { page: reviewsPagination.currentPage });
    }
  }, [doctor, fetchDoctorReviews, reviewsPagination.currentPage]);

  // Reset current index when reviews change
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setCurrentIndex(0);
    }
  }, [reviews]);

  if (reviewsLoading && !reviews.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Patient Reviews</h2>
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Patient Reviews</h2>
        <p className="text-center text-gray-600">Unable to load reviews at this time.</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Patient Reviews</h2>
        <div className="text-center py-8">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">No reviews available for this doctor yet.</p>
          <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? reviews.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === reviews.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Handle page change
  const changePage = (newPage) => {
    if (doctor && doctor.id) {
      fetchDoctorReviews(doctor.id, { page: newPage });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
      {/* Header with rating summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">Patient Reviews</h2>
        <div className="flex items-center mt-2 md:mt-0">
          {averageRating > 0 && (
            <div className="flex items-center mr-3">
              <div className="flex mr-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{averageRating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-sm text-gray-600">
            {reviewsPagination.totalReviews} {reviewsPagination.totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>
      
      {/* Review Carousel */}
      <div className="relative min-h-[200px] flex items-center justify-center">
        {/* Previous Button */}
        {reviews.length > 1 && (
          <button 
            onClick={goToPrevious} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
            aria-label="Previous review"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}

        {/* Review Content */}
        <div className="w-full max-w-2xl px-4 md:px-10">
          <div className="flex flex-col items-center">
            {/* Patient Photo */}
            <div className="mb-4 relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-100">
              <Image 
                src={reviews[currentIndex].patientPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[currentIndex].patientName)}&background=3b82f6&color=fff`} 
                alt={reviews[currentIndex].patientName || 'Anonymous Patient'}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Patient Name and Time */}
            <div className="text-center mb-2">
              <p className="font-medium text-gray-800">{reviews[currentIndex].patientName || 'Anonymous Patient'}</p>
              <p className="text-sm text-gray-500">{reviews[currentIndex].dayAgo || 'Recently'}</p>
            </div>
            
            {/* Star Rating */}
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${i < reviews[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            {/* Review Comment */}
            <div className="text-center">
              <p className="text-gray-700 italic mb-2">"{reviews[currentIndex].comment}"</p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        {reviews.length > 1 && (
          <button 
            onClick={goToNext} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
            aria-label="Next review"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>

      {/* Dots for current page reviews */}
      {reviews.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {reviews.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === slideIndex ? 'bg-teal-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${slideIndex + 1}`}
            ></button>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {reviewsPagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 pt-4 border-t">
          <button
            onClick={() => changePage(reviewsPagination.currentPage - 1)}
            disabled={reviewsPagination.currentPage === 1}
            className={`px-3 py-1 rounded-md mr-2 ${
              reviewsPagination.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-sm text-gray-600">
            Page {reviewsPagination.currentPage} of {reviewsPagination.totalPages}
          </span>
          
          <button
            onClick={() => changePage(reviewsPagination.currentPage + 1)}
            disabled={reviewsPagination.currentPage === reviewsPagination.totalPages}
            className={`px-3 py-1 rounded-md ml-2 ${
              reviewsPagination.currentPage === reviewsPagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading indicator for page changes */}
      {reviewsLoading && reviews.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
        </div>
      )}
    </div>
  );
};

export default PatientReviewsCarousel;