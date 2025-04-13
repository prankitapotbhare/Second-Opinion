"use client";

import React from 'react';

export default function Reviews({ reviews, activeReviewIndex, setActiveReviewIndex }) {
  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev === 0 ? reviews.length - 3 : prev - 1));
  };
  
  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev === reviews.length - 3 ? 0 : prev + 1));
  };
  
  const visibleReviews = [
    reviews[activeReviewIndex],
    reviews[(activeReviewIndex + 1) % reviews.length],
    reviews[(activeReviewIndex + 2) % reviews.length]
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Patient Reviews</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevReview}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button
            onClick={handleNextReview}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleReviews.map((review, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <div className="text-gray-400 mb-3">
              <i className="fas fa-quote-left text-blue-500"></i>
            </div>
            <p className="text-gray-700 mb-4">{review.text}</p>
            <p className="text-gray-600 italic">– {review.author}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {reviews.slice(0, reviews.length - 2).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveReviewIndex(index)}
            className={`h-2 w-2 rounded-full mx-1 ${index === activeReviewIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Go to review set ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}