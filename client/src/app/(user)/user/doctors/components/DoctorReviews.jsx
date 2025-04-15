import React, { useState } from 'react';
import { FaStar, FaThumbsUp, FaThumbsDown, FaFilter } from 'react-icons/fa';

const DoctorReviews = ({ doctorId }) => {
  const [filter, setFilter] = useState('all');
  
  // Mock reviews data
  const allReviews = [
    {
      id: 1,
      patientName: "Rahul Sharma",
      rating: 5,
      date: "March 15, 2023",
      comment: "Dr. Singh was extremely thorough and took the time to explain everything to me. I felt very comfortable and well-cared for during my visit.",
      helpful: 12,
      unhelpful: 1
    },
    {
      id: 2,
      patientName: "Priya Patel",
      rating: 4,
      date: "February 28, 2023",
      comment: "Very knowledgeable doctor. The wait time was a bit long, but the quality of care made up for it.",
      helpful: 8,
      unhelpful: 2
    },
    {
      id: 3,
      patientName: "Amit Kumar",
      rating: 5,
      date: "January 10, 2023",
      comment: "Excellent experience! The doctor was very attentive and addressed all my concerns. The staff was also very friendly and helpful.",
      helpful: 15,
      unhelpful: 0
    },
    {
      id: 4,
      patientName: "Neha Gupta",
      rating: 3,
      date: "December 5, 2022",
      comment: "The doctor was good but the clinic was very crowded. Had to wait for almost an hour past my appointment time.",
      helpful: 6,
      unhelpful: 3
    }
  ];
  
  // Filter reviews based on rating
  const filteredReviews = allReviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === '5star' && review.rating === 5) return true;
    if (filter === '4star' && review.rating === 4) return true;
    if (filter === '3star' && review.rating === 3) return true;
    if (filter === 'low' && review.rating < 3) return true;
    return false;
  });
  
  // Calculate average rating
  const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;
  
  // Rating distribution
  const ratingDistribution = {
    5: allReviews.filter(r => r.rating === 5).length,
    4: allReviews.filter(r => r.rating === 4).length,
    3: allReviews.filter(r => r.rating === 3).length,
    2: allReviews.filter(r => r.rating === 2).length,
    1: allReviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Patient Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">Based on {allReviews.length} reviews</div>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center mb-2">
                <div className="w-12 text-sm text-gray-600">{rating} Star</div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full" 
                      style={{ width: `${(ratingDistribution[rating] / allReviews.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-600 text-right">{ratingDistribution[rating]}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-md font-medium text-gray-800">All Reviews</h3>
          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5star">5 Star</option>
              <option value="4star">4 Star</option>
              <option value="3star">3 Star</option>
              <option value="low">2 Star & Below</option>
            </select>
          </div>
        </div>
        
        {filteredReviews.length > 0 ? (
          <div className="space-y-6">
            {filteredReviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{review.patientName}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <button className="flex items-center mr-4 hover:text-gray-700">
                    <FaThumbsUp className="mr-1" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center hover:text-gray-700">
                    <FaThumbsDown className="mr-1" />
                    <span>Not Helpful ({review.unhelpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;