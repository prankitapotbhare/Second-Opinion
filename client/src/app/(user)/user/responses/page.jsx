"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaFileAlt } from 'react-icons/fa';

export default function ResponsePage() {
  const [activeTab, setActiveTab] = useState('response');

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

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-16 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab('response')}
          >
            Response (1)
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

        {/* Comments Section */}
        {activeTab === 'comments' && (
          <div>
            <h2 className="text-2xl font-medium mb-6">Comments</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="mb-6">
                <textarea 
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Add a comment..."
                  rows={4}
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
              
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