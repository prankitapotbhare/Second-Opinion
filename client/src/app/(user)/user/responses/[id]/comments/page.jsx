"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa';

export default function CommentsAndRatingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch the response data from an API
    // For now, we'll use mock data
    const mockResponse = {
      id,
      doctor: {
        name: "Dr. Emily Johnson",
        specialization: "Neurologist",
        date: "May 15, 2023"
      }
    };
    
    setResponse(mockResponse);
    setLoading(false);
  }, [id]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    // In a real app, you would send this data to your backend
    console.log({
      responseId: id,
      rating,
      comment
    });
    
    // Show success message
    alert('Your comment and rating have been submitted successfully!');
    
    // Redirect back to the response page
    router.push(`/user/responses/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Response Not Found</h1>
        <Link href="/user/responses" className="text-teal-600 hover:underline">
          View All Responses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 md:px-16 py-8">
        <Link href={`/user/responses/${id}`} className="flex items-center text-teal-600 mb-6 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to response
        </Link>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Response from {response.doctor.name}</h1>
              <p className="text-gray-600">{response.doctor.specialization} • {response.doctor.date}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-gray-200 pb-4">
          <Link href={`/user/responses/${id}`} className="text-xl font-bold text-gray-600 hover:text-teal-600">
            Response
          </Link>
          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-black pb-1">
            Comments & Ratings
          </h2>
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
                placeholder="Share your experience with this doctor's response..."
              />
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Ratings</h3>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="text-3xl focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    {star <= rating ? (
                      <FaStar className="text-amber-400" />
                    ) : (
                      <FaRegStar className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSubmit}
                className="bg-teal-600 text-white px-8 py-3 rounded-md hover:bg-teal-700 transition-colors font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}