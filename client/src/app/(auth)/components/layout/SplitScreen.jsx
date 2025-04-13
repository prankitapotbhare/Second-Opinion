"use client";

import React from 'react';
import Image from 'next/image';

const SplitScreen = ({ 
  children, 
  imageSrc, 
  imageAlt = "Authentication image",
  imagePosition = "left" // 'left' or 'right'
}) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Image Section */}
      {imagePosition === 'left' && (
        <div className="hidden md:block md:w-1/2 bg-[#e0eae4] relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      {/* Content Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Image Section (if right position) */}
      {imagePosition === 'right' && (
        <div className="hidden md:block md:w-1/2 bg-[#e0eae4] relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}
    </div>
  );
};

export default SplitScreen;