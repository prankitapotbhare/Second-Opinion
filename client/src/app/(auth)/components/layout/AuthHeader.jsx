"use client";

import React from 'react';

const AuthHeader = ({ 
  title, 
  subtitle,
  align = "center" // 'center', 'left', or 'right'
}) => {
  const alignmentClasses = {
    center: "text-center",
    left: "text-left",
    right: "text-right"
  };

  return (
    <div className={`${alignmentClasses[align]} md:${alignmentClasses[align]} mb-10`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;