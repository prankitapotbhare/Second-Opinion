"use client";

import React from 'react';

const AuthHeader = ({ 
  title, 
  subtitle,
  align = "center", // 'center', 'left', or 'right'
  titleClass = "",
  subtitleClass = ""
}) => {
  const alignmentClasses = {
    center: "text-center",
    left: "text-left",
    right: "text-right"
  };

  return (
    <div className={`${alignmentClasses[align]} md:${alignmentClasses[align]} mb-6 md:mb-10`}>
      <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${titleClass}`}>{title}</h1>
      {subtitle && <p className={`text-gray-600 text-sm md:text-base ${subtitleClass}`}>{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;