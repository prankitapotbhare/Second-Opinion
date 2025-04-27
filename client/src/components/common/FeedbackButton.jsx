import React, { useState, useEffect } from 'react';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState('');

  // Add animation when component mounts
  useEffect(() => {
    setAnimation('animate-bounce');
    const timer = setTimeout(() => setAnimation(''), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Here you would normally send the feedback to your backend
      console.log('Feedback submitted:', { text: feedback, category });
      setSubmitted(true);
      setLoading(false);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setFeedback('');
        setCategory('general');
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const toggleFeedback = () => {
    setIsOpen(!isOpen);
    if (submitted) {
      setSubmitted(false);
      setFeedback('');
      setCategory('general');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Feedback Button */}
      <button
        onClick={toggleFeedback}
        className={`bg-teal-700 hover:bg-teal-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${animation}`}
        aria-label="Give feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Feedback Form with improved animation */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
          <div className="bg-teal-700 text-white py-3 px-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Share Your Feedback</h3>
              <button 
                onClick={toggleFeedback}
                className="text-white hover:text-teal-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {submitted ? (
              <div className="text-center py-6 animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-700 font-medium text-lg">Thank you for your feedback!</p>
                <p className="text-gray-500 text-sm mt-1">We appreciate your input.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="animate-fadeIn">
                {/* Feedback Category */}
                <div className="mb-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="experience">User Experience</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Feedback Text */}
                <div className="mb-3">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What's on your mind? We'd love to hear your thoughts."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-md font-medium text-white ${
                    loading ? 'bg-teal-500 cursor-not-allowed' : 'bg-teal-700 hover:bg-teal-800'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Feedback'}
                </button>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Your feedback helps us improve our service.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackButton;