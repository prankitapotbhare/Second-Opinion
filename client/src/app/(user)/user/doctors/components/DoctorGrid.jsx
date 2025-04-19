import React from 'react';
import DoctorCard from './DoctorCard'; // Assuming this is the correct path to the DoctorCard above

const DoctorGrid = ({ doctors, showAll = false, toggleShowAll }) => {
  const displayedDoctors = showAll ? doctors : doctors.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedDoctors.map((doctor) => (
          // Ensure doctor.id exists before rendering
          doctor.id ? <DoctorCard key={doctor.id} doctor={doctor} /> : null
        ))}
      </div>

      {!showAll && doctors.length > 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={toggleShowAll}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 text-lg font-semibold whitespace-nowrap"
          >
            See All Doctors
          </button>
        </div>
      )}

      {showAll && doctors.length > 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={toggleShowAll}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-lg font-semibold whitespace-nowrap"
          >
            Show Less
          </button>
        </div>
      )}


      {doctors.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No doctors found matching your search</h3>
          <p className="text-gray-500 mt-2">Try a different search term or browse all doctors</p>
        </div>
      )}
    </div>
  );
};

export default DoctorGrid;