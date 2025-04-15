"use client";

import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <input
        type="text"
        className="w-full p-4 pl-12 text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Search by doctor name or specialization"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;