import React from 'react';

const DoctorCardSkeleton = ({ count = 6 }) => {
  return Array(count).fill(0).map((_, idx) => (
    <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Image - Square Skeleton */}
        <div className="w-full sm:w-1/5 max-w-[120px] mx-auto sm:mx-0 aspect-square overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        {/* Doctor Info and Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between w-full sm:w-4/5 gap-4">
          {/* Doctor Info Skeleton */}
          <div className="flex flex-col justify-center text-center sm:text-left w-full">
            <div className="h-7 bg-gray-200 rounded w-2/3 mx-auto sm:mx-0 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto sm:mx-0 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-1/3 mx-auto sm:mx-0 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto sm:mx-0 animate-pulse"></div>
          </div>
          {/* Action Buttons Skeleton */}
          <div className="flex flex-col gap-2 justify-center mt-2 sm:mt-0 w-full">
            <div className="w-full h-9 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default DoctorCardSkeleton;