"use client";

import React from 'react';

const StatsCard = ({ icon, title, value, chartIcon, iconColor, chartBgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <div className={`${iconColor} mb-2`}>
            {icon}
          </div>
          <h3 className="text-gray-600 font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${chartBgColor} rounded-full p-2`}>
          {chartIcon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;