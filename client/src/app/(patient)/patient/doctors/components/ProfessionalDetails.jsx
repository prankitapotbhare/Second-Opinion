import React from 'react';
import {
  FaStar,
  FaGraduationCap,
  FaIdBadge,
  FaLanguage,
  FaCalendarAlt,
  FaComments,
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';

import { MdLocalHospital, MdAttachMoney } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { GoLocation } from 'react-icons/go';


// Helper for Detail Items
const DetailItem = ({ icon, label, value, verified, children }) => (
  <div className="flex items-start mb-4">
    <div className="text-teal-600 w-5 h-5 mr-3 mt-1 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      {children ? (
        <div className="text-sm text-gray-800">{children}</div>
      ) : (
        <p className="text-sm text-gray-800 flex items-center">
          {value || '-'}
          {verified && <FaCheckCircle className="ml-2 text-green-500" title="Verified" />}
        </p>
      )}
    </div>
  </div>
);

// Professional Details Component
const ProfessionalDetails = ({ doctor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Professional Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {/* Left Column */}
      <div>
        <DetailItem icon={<FaGraduationCap />} label="Qualification" value={doctor.qualification} />
        <DetailItem icon={<FaIdBadge />} label="License" value={doctor.license} verified={doctor.licenseVerified} />
        {/* <DetailItem icon={<FaAward />} label="Award" value={doctor.awards?.join(', ')} /> */}
        <DetailItem icon={<FaLanguage />} label="Languages" value={doctor.languages?.join(', ')} />
        <DetailItem icon={<BiMoney />} label="Consultation Fee" value={`₹${doctor.fee}`} />
      </div>
      {/* Right Column */}
      <div>
        <DetailItem icon={<FaCalendarAlt />} label="Availability" value={doctor.availability} />
        <DetailItem icon={<FaComments />} label="Consult Options" value={doctor.consultOptions?.join(', ')} />
        {/* <DetailItem icon={<FaStar className="text-yellow-400"/>} label="Reviews">
            <div className="flex items-center">
                <span className="text-yellow-500 font-semibold mr-1">{doctor.rating?.toFixed(1)}/5</span>
                <span className="text-gray-500">({doctor.reviewCount}+ Patient Reviews)</span>
            </div>
        </DetailItem> */}
        <DetailItem icon={<MdLocalHospital />} label="Hospital Address" value={doctor.address} />
        <DetailItem icon={<GoLocation />} label="Location" value={doctor.location} />

      </div>
    </div>
  </div>
);

export default ProfessionalDetails;