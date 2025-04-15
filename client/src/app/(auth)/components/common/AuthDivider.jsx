"use client";

import React from 'react';

const AuthDivider = ({ text = "or" }) => {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 py-1 bg-white text-gray-500 rounded-full">{text}</span>
      </div>
    </div>
  );
};

export default AuthDivider;