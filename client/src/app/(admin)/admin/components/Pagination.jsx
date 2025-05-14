"use client";

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPrevPage, 
  onNextPage,
  colorScheme = "blue" // Default color scheme
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600"
  };
  
  const buttonColor = colorClasses[colorScheme] || colorClasses.blue;
  
  return (
    <div className="mt-4 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> items
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md flex items-center ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : buttonColor}`}
        >
          <FaChevronLeft className="mr-1" /> Previous
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md flex items-center ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : buttonColor}`}
        >
          Next <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;