import React from "react";
import { FaStar, FaUser, FaCalendarAlt, FaClipboardCheck, FaUserMd, FaChartLine } from "react-icons/fa";

const DashboardSection = ({
  stats,
  reviewsData,
  onReviewPageChange,
  reviewPage,
  reviewTotalPages,
  loadingReviews
}) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          {
            title: "Today's Appointments",
            value: stats?.todayAppointments ?? 0,
            icon: <FaCalendarAlt className="text-blue-600" size={20} />,
            bg: "bg-blue-50",
            text: "text-blue-600",
            hover: "hover:bg-blue-100",
            borderColor: "border-blue-200"
          },
          {
            title: "Pending Appointments",
            value: stats?.pendingAppointments ?? 0,
            icon: <FaClipboardCheck className="text-amber-600" size={20} />,
            bg: "bg-amber-50",
            text: "text-amber-600",
            hover: "hover:bg-amber-100",
            borderColor: "border-amber-200"
          },
          {
            title: "Completed Appointments",
            value: stats?.completedAppointments ?? 0,
            icon: <FaChartLine className="text-green-600" size={20} />,
            bg: "bg-green-50",
            text: "text-green-600",
            hover: "hover:bg-green-100",
            borderColor: "border-green-200"
          },
          {
            title: "Total Patients",
            value: stats?.totalPatients ?? 0,
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-80 ${item.bg}`}>
                {item.icon}
              </div>
            </div>
            <span className={`text-3xl sm:text-4xl font-bold ${item.text} mt-2 block`}>
              {item.value}
            </span>
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
                  <FaStar key={star} className={`text-yellow-400 mr-1`} size={14} />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {reviewsData?.averageRating ? `${reviewsData.averageRating.toFixed(1)}/5.0` : "-"} ({reviewsData?.totalReviews ?? 0} reviews)
              </span>
            </div>
          </div>

          {loadingReviews ? (
            <div className="text-center py-8 text-blue-600">Loading reviews...</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {(reviewsData?.reviews ?? []).map((review, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {review.patientPhotoURL ? (
                            <img src={review.patientPhotoURL} alt={review.patientName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <FaUser />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">
                            {review.patientName || "Patient"}
                          </p>
                          <p className="text-xs text-gray-500">{review.dayAgo}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`text-xs ml-1 ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-6">
                <button
                  className="px-3 py-1 rounded-l bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  onClick={() => onReviewPageChange(reviewPage - 1)}
                  disabled={reviewPage <= 1}
                >
                  Prev
                </button>
                <span className="px-4 py-1 bg-white border border-blue-100 text-blue-700">
                  Page {reviewPage} of {reviewTotalPages}
                </span>
                <button
                  className="px-3 py-1 rounded-r bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  onClick={() => onReviewPageChange(reviewPage + 1)}
                  disabled={reviewPage >= reviewTotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardSection;
