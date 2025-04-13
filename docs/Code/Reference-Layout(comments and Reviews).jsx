// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState } from 'react';

const App = () => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("Great experience and smooth experience");
  
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="text-xl font-medium text-gray-700">
          <span className="text-teal-700">Second</span> opinion
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-teal-700 cursor-pointer">Home</a>
          <a href="#" className="text-teal-600 hover:text-teal-700 cursor-pointer">Response</a>
          <a href="#" className="text-gray-600 hover:text-teal-700 cursor-pointer">Login</a>
          <a href="#" className="text-gray-600 hover:text-teal-700 cursor-pointer">Signin</a>
          <a href="#" className="text-gray-600 hover:text-teal-700 cursor-pointer">FAQs</a>
        </nav>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer">
          Contact us
        </button>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-xl font-bold text-gray-800">Response (1)</h1>
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-black pb-1">Comments & Ratings</h2>
        </div>
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Comments & Ratings</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Comments</h3>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 min-h-[100px]"
                value={comment}
                onChange={handleCommentChange}
              />
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Ratings</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="text-3xl focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    {star <= rating ? (
                      <i className="fas fa-star text-amber-400"></i>
                    ) : (
                      <i className="far fa-star text-gray-400"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-teal-600 text-white px-8 py-3 rounded-md hover:bg-teal-700 transition-colors font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
