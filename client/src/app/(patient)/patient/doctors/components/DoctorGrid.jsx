import React from 'react';
import DoctorCard from './DoctorCard';
import DoctorCardSkeleton from './DoctorCardSkeleton';

const DoctorGrid = ({
  doctors,
  pagination,
  onPageChange,
  loading = false,
  isChangingPage = false
}) => {
  const { currentPage, totalPages, totalDoctors, limit } = pagination;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DoctorCardSkeleton count={pagination.limit || 8} />
        </div>
        {/* Optionally add skeleton pagination here */}
      </div>
    );
  }

  return (
    <div>
      {doctors.length > 0 ? (
        <>
          {isChangingPage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DoctorCardSkeleton count={limit || 8} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                {/* Previous Page Button */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isChangingPage}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 || isChangingPage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && !isChangingPage && onPageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage
                        ? 'bg-teal-600 text-white'
                        : page === '...'
                        ? 'bg-white text-gray-500 cursor-default'
                        : isChangingPage
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={page === '...' || isChangingPage}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isChangingPage}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages || isChangingPage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm mt-4">
            Showing {doctors.length} of {totalDoctors} doctors
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No doctors found matching your search</h3>
          <p className="text-gray-500 mt-2">Try a different search term or browse all doctors</p>
        </div>
      )}
    </div>
  );
};

export default DoctorGrid;