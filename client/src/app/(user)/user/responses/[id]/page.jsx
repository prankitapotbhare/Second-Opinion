"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaFileAlt, FaArrowLeft, FaComment } from 'react-icons/fa';

export default function SingleResponsePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('response');
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch the response data from an API
    // For now, we'll use mock data
    const mockResponse = {
      id,
      text: "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort.",
      documents: [
        { id: 1, name: "File.pdf" },
        { id: 2, name: "Report.pdf" },
        { id: 3, name: "File.pdf" },
        { id: 4, name: "Report.pdf" }
      ],
      doctor: {
        name: "Dr. Emily Johnson",
        specialization: "Neurologist",
        date: "May 15, 2023"
      }
    };
    
    setResponse(mockResponse);
    setLoading(false);
  }, [id]);

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
        <Link href="/user/responses" className="flex items-center text-teal-600 mb-6 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to all responses
        </Link>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Response from {response.doctor.name}</h1>
              <p className="text-gray-600">{response.doctor.specialization} • {response.doctor.date}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href={`/user/responses/${id}/comments`}>
                <button className="flex items-center bg-teal-50 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-100 transition-colors">
                  <FaComment className="mr-2" /> Add Comment & Rating
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('response')}
          >
            Response
          </button>
          <button 
            className={`pb-4 px-4 text-lg font-medium ml-auto ${activeTab === 'comments' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
        </div>

        {/* Response Section */}
        {activeTab === 'response' && (
          <div>
            <h2 className="text-2xl font-medium mb-6">Response</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
              <p className="text-gray-800 leading-relaxed">
                {response.text}
              </p>
            </div>

            <h2 className="text-2xl font-medium mb-6">Documents</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {response.documents.map((doc) => (
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

        {/* Comments Section */}
        {activeTab === 'comments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Comments</h2>
              <Link href={`/user/responses/${id}/comments`}>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                  Add Comment & Rating
                </button>
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="text-center text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}