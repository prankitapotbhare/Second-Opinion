"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFileAlt, FaStar } from 'react-icons/fa';

export default function ResponsePage() {
  const [activeTab, setActiveTab] = useState('response');
  const [rating, setRating] = useState(4); // Default to 4 stars as shown in the image
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [requiredField, setRequiredField] = useState('No second opinion needed. Please follow the doctor\'s advice.');

  // Mock data for responses
  const responseData = {
    text: "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort.",
    documents: [
      { id: 1, name: "File.pdf" },
      { id: 2, name: "Report.pdf" },
      { id: 3, name: "File.pdf" },
      { id: 4, name: "Report.pdf" }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ comment, rating });
    // Here you would typically send the data to your backend
  };

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
            {/* Required Field Section - Added as per image */}
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Required(Yes or No)</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
                <textarea
                  className="w-full text-gray-800 focus:outline-none resize-none"
                  value={requiredField}
                  onChange={(e) => setRequiredField(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
              <p className="text-gray-800 leading-relaxed">
                {responseData.text}
              </p>
            </div>

            <h2 className="text-2xl font-medium mb-6">Documents</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {responseData.documents.map((doc) => (
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
                    className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}