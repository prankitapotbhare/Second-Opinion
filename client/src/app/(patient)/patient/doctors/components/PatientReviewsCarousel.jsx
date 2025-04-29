"use client"; // Add this directive as it uses useState

import React, { useState } from 'react';

// Patient Reviews Carousel Component (Simple Implementation)
const PatientReviewsCarousel = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return null; // Don't render if no reviews
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Patient Reviews</h2>
      <div className="relative h-40 flex items-center justify-center"> {/* Adjust height as needed */}
        {/* Previous Button */}
        <button onClick={goToPrevious} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Review Content */}
        <div className="text-center px-10">
            <p className="text-gray-700 italic text-lg mb-2">"{reviews[currentIndex].text}"</p>
            <p className="text-gray-600 font-medium">- {reviews[currentIndex].name}</p>
        </div>

        {/* Next Button */}
        <button onClick={goToNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {reviews.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === slideIndex ? 'bg-teal-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientReviewsCarousel;