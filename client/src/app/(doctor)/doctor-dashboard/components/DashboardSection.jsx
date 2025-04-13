import React from "react";
import { FaStar, FaUser } from "react-icons/fa";

const DashboardSection = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            title: "Today's Appointments",
            value: 8,
            bg: "bg-blue-50",
            text: "text-blue-600",
            hover: "hover:bg-blue-100",
          },
          {
            title: "Pending Appointments",
            value: 3,
            bg: "bg-amber-50",
            text: "text-amber-600",
            hover: "hover:bg-amber-100",
          },
          {
            title: "Completed Appointments",
            value: 12,
            bg: "bg-green-50",
            text: "text-green-600",
            hover: "hover:bg-green-100",
          },
          {
            title: "Total Appointments",
            value: 23,
            bg: "bg-purple-50",
            text: "text-purple-600",
            hover: "hover:bg-purple-100",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
              <span className={`text-3xl sm:text-4xl font-bold ${item.text} mt-2 block`}>
                {item.value}
              </span>
            </div>
            <button
              className={`mt-4 w-full py-2 ${item.bg} ${item.text} rounded-md font-medium text-sm ${item.hover} transition`}
            >
              View All
            </button>
          </div>
        ))}
      </div>

      {/* Comments & Reviews */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h3 className="text-base sm:text-lg font-medium text-gray-800">
            Comments & Reviews
          </h3>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-yellow-400 mr-1" />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              4.8/5.0 (42 reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-4 bg-gray-50 rounded-lg">
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

        <button className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-200 transition">
          View All Reviews
        </button>
      </div>
    </main>
  );
};

export default DashboardSection;
