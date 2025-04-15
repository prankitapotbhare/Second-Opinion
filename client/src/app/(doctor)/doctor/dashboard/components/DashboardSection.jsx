import React from "react";
import { FaStar, FaUser, FaCalendarAlt, FaClipboardCheck, FaUserMd, FaChartLine } from "react-icons/fa";

const DashboardSection = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          {
            title: "Today's Appointments",
            value: 8,
            icon: <FaCalendarAlt className="text-blue-600" size={20} />,
            bg: "bg-blue-50",
            text: "text-blue-600",
            hover: "hover:bg-blue-100",
            borderColor: "border-blue-200"
          },
          {
            title: "Pending Appointments",
            value: 3,
            icon: <FaClipboardCheck className="text-amber-600" size={20} />,
            bg: "bg-amber-50",
            text: "text-amber-600",
            hover: "hover:bg-amber-100",
            borderColor: "border-amber-200"
          },
          {
            title: "Completed Appointments",
            value: 12,
            icon: <FaChartLine className="text-green-600" size={20} />,
            bg: "bg-green-50",
            text: "text-green-600",
            hover: "hover:bg-green-100",
            borderColor: "border-green-200"
          },
          {
            title: "Total Patients",
            value: 23,
            icon: <FaUserMd className="text-purple-600" size={20} />,
            bg: "bg-purple-50",
            text: "text-purple-600",
            hover: "hover:bg-purple-100",
            borderColor: "border-purple-200"
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 border ${item.borderColor} flex flex-col justify-between transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-opacity-80 ${item.bg}">
                {item.icon}
              </div>
            </div>
            <span className={`text-3xl sm:text-4xl font-bold ${item.text} mt-2 block`}>
              {item.value}
            </span>
            <button
              className={`mt-4 w-full py-2 ${item.bg} ${item.text} rounded-md font-medium text-sm ${item.hover} transition-all duration-300`}
            >
              View All
            </button>
          </div>
        ))}
      </div>

      {/* Comments & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Patient Reviews */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 md:p-6 border border-blue-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                <FaStar size={14} />
              </span>
              Patient Reviews
            </h3>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="text-yellow-400 mr-1" size={14} />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                4.8/5.0 (42 reviews)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaUser />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">
                        Patient Name
                      </p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xs ml-1 ${
                          star <= 5 - (item % 2)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "Dr. Doe was very professional and thorough with my examination.
                  I appreciate the clear explanations and follow-up instructions."
                </p>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full py-2 bg-blue-100 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-200 transition-all duration-300">
            View All Reviews
          </button>
        </div>
        
        {/* Upcoming Appointments Quick View
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-purple-100">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center mb-4">
            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
              <FaCalendarAlt size={14} />
            </span>
            Today's Schedule
          </h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-800">Patient #{item}</p>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">10:3{item} AM</span>
                </div>
                <p className="text-xs text-gray-500">General Consultation • 30 min</p>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-2 bg-purple-100 text-purple-700 rounded-md font-medium text-sm hover:bg-purple-200 transition-all duration-300">
            View Full Schedule
          </button>
        </div> */}
      </div>
    </main>
  );
};

export default DashboardSection;
