import React from 'react';
import { FaUserMd, FaCalendarCheck, FaUserPlus, FaUserEdit, FaCalendarTimes } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  // Map icon names to React Icons
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'user-md': return <FaUserMd />;
      case 'calendar-check': return <FaCalendarCheck />;
      case 'user-plus': return <FaUserPlus />;
      case 'user-edit': return <FaUserEdit />;
      case 'calendar-times': return <FaCalendarTimes />;
      default: return <FaUserMd />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4
              ${activity.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
              ${activity.color === 'green' ? 'bg-green-100 text-green-600' : ''}
              ${activity.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
              ${activity.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
              ${activity.color === 'red' ? 'bg-red-100 text-red-600' : ''}`}
            >
              {getIcon(activity.icon)}
            </div>
            <div>
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;