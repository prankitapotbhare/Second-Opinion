import React from 'react';

const StatCard = ({ title, count, icon, color }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 font-medium mb-2">{title}</h3>
          <p className="text-3xl font-semibold">{count}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center
          ${color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
          ${color === 'green' ? 'bg-green-100 text-green-600' : ''}
          ${color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
          ${color === 'red' ? 'bg-red-100 text-red-600' : ''}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;