"use client";

import React from 'react';
import Image from 'next/image';

const SplitScreen = ({ 
  children, 
  imageSrc, 
  imageAlt = "Authentication image",
  imagePosition = "left", // 'left' or 'right'
  mobileImageHeight = "30vh" // Control image height on mobile
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Mobile Image (shown only on mobile) */}
      <div className="block md:hidden w-full relative bg-[#e0eae4] overflow-hidden" style={{ height: mobileImageHeight }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
      </div>

      {/* Image Section for desktop (left position) */}
      {imagePosition === 'left' && (
        <div className="hidden md:block md:w-1/2 bg-[#e0eae4] relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
        </div>
      )}

      {/* Content Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-4 md:py-0">
          {children}
        </div>
      </div>

      {/* Image Section for desktop (right position) */}
      {imagePosition === 'right' && (
        <div className="hidden md:block md:w-1/2 bg-[#e0eae4] relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default SplitScreen;