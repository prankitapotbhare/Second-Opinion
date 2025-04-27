// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import FileUpload from './FileUpload';
// import DropdownSelect from './DropdownSelect';

// const DoctorDetailsForm = () => {
//   const [specialization, setSpecialization] = useState('');
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const router = useRouter();

//   const specializationOptions = [
//     "Cardiology",
//     "Dermatology",
//     "Endocrinology",
//     "Gastroenterology",
//     "Neurology",
//     "Oncology",
//     "Orthopedics",
//     "Pediatrics", 
//     "Psychiatry",
//     "Radiology",
//     "Surgery",
//     "Urology",
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Show success popup
//     setShowSuccessPopup(true);

//     // Redirect after 2 seconds
//     setTimeout(() => {
//       router.push('/doctor/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto my-4 bg-white p-8 rounded-lg shadow-sm">
//       {/* Success Popup */}
//       {showSuccessPopup && (
//         <div className="fixed inset-0 min-h-screen bg-gray-50 flex items-center justify-center px-4">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//                 <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="mt-3 text-lg font-medium text-gray-900">Your account has been successfully created!</h3>
//               <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard...</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-semibold">Doctor's Details</h2>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="space-y-6">
//           <div className="border-b pb-4">
//             <p className="text-gray-700 font-medium mb-4">Professional Information:-</p>

//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
//                   Specialization:<span className="text-red-500">*</span>
//                 </label>
//                 <DropdownSelect
//                   options={specializationOptions}
//                   value={specialization}
//                   onChange={setSpecialization}
//                   placeholder="Eg. Cardiology"
//                   required={true}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
//                   Years of Experience:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="experience"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. 5 (in years)"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
//                   Current Hospital/Clinic Affiliation:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="hospitalAffiliation"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. Apollo Hospitals, Chennai"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                   Hospital Address:
//                 </label>
//                 <input
//                   type="text"
//                   id="hospitalAddress"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. AIIMS, Delhi, India"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                   Medical License Number:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="licenseNumber"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. 4456748"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="issuingMedicalCouncil" className="block text-sm font-medium text-gray-700 mb-1">
//                   Issuing Medical Council:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="issuingMedicalCouncil"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. Medical Council of India (MCI) / USMLE (USA)"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
//                   Add Languages:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="consultationFee"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder=""
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Registration Certificate Upload:<span className="text-red-500">*</span>
//                 </label>
//                 <FileUpload
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   required={true}
//                   isDragDrop={true}
//                   fileTypes="PDF, JPG or PNG (max. 5MB)"
//                   placeholder="Upload PDF/JPG"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone number:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="phoneNumber"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. 9843XXXXXX"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. sunilkumar@gmail.com"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
//                   Emergency Contact number:<span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="emergencyContact"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. 7843XXXXXX"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="consultationAddress" className="block text-sm font-medium text-gray-700 mb-1">
//                   Consultation Address:
//                 </label>
//                 <input
//                   type="text"
//                   id="consultationAddress"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
//                   Bio:
//                 </label>
//                 <textarea
//                   id="bio"
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Eg. I am a cardiology specialist with 10 years of experience."
//                 ></textarea>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DoctorDetailsForm;



// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import FileUpload from './FileUpload';
// import DropdownSelect from './DropdownSelect';

// const DoctorDetailsForm = () => {
//   const [specialization, setSpecialization] = useState('');
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const router = useRouter();

//   const specializationOptions = [
//     "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology",
//     "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Urology"
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowSuccessPopup(true);
//     setTimeout(() => {
//       router.push('/doctor/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="w-full px-4 py-6 md:px-8 lg:px-16">
//       {showSuccessPopup && (
//         <div className="fixed inset-0 min-h-screen bg-gray-50 flex items-center justify-center px-4 z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//                 <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="mt-3 text-lg font-medium text-gray-900">Your account has been successfully created!</h3>
//               <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard...</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <h2 className="text-3xl font-semibold mb-6">Doctor's Details</h2>

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Specialization */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Specialization:<span className="text-red-500">*</span></label>
//           <DropdownSelect
//             options={specializationOptions}
//             value={specialization}
//             onChange={setSpecialization}
//             placeholder="Eg. Cardiology"
//             required={true}
//           />
//         </div>

//         {/* Experience */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience:<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. 5 (in years)"
//             required
//           />
//         </div>

//         {/* Hospital Affiliation */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Current Hospital/Clinic Affiliation:<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. Apollo Hospitals, Chennai"
//           />
//         </div>

//         {/* Hospital Address */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Address:</label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. AIIMS, Delhi, India"
//           />
//         </div>

//         {/* License Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Medical License Number:<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. 4456748"
//           />
//         </div>

//         {/* Medical Council */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Medical Council:<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. Medical Council of India (MCI) / USMLE (USA)"
//           />
//         </div>

//         {/* Languages */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Add Languages:<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. English, Hindi"
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Phone number:<span className="text-red-500">*</span></label>
//           <input
//             type="tel"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. 9843XXXXXX"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email Address:<span className="text-red-500">*</span></label>
//           <input
//             type="email"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. sunilkumar@gmail.com"
//           />
//         </div>

//         {/* Emergency Contact */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact number:<span className="text-red-500">*</span></label>
//           <input
//             type="tel"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. 7843XXXXXX"
//           />
//         </div>
//         {/* Consultation Fee */}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee:<span className="text-red-500">*</span></label>
//           <input
//             type="tel"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. 7843XXXXXX"
//           />
//         </div>

//         {/* Consultation Address */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Address:</label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
//           />
//         </div>


//         {/* Location*/}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
//           <input
//             type="text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
//           />
//         </div>

//         {/* File Upload - full width */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Registration Certificate Upload:<span className="text-red-500">*</span></label>
//           <FileUpload
//             accept=".pdf,.jpg,.jpeg,.png"
//             required={true}
//             isDragDrop={true}
//             fileTypes="PDF, JPG or PNG (max. 5MB)"
//             placeholder="Upload PDF/JPG"
//           />
//         </div>

//         {/* Bio - full width */}
//         <div className="md:col-span-2">
//           <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio:</label>
//           <textarea
//             id="bio"
//             rows={4}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Eg. I am a cardiology specialist with 10 years of experience."
//           ></textarea>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <label className="block text-lg font-semibold text-gray-800 mb-4">Availability / Working Hours</label>

//           {/* Working Days */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
//             <select
//               multiple
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple days.</p>
//           </div>

//           {/* Working Hours */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//               <input
//                 type="time"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//               <input
//                 type="time"
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//           </div>

//           {/* Weekly Off / Holiday */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Holiday</label>
//             <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
//               <option value="">-- Select a Day Off --</option>
//               {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//           </div>

//           {/* Optional Location */}
//           <div className="mb-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Location / Hospital (Optional)</label>
//             <input
//               type="text"
//               placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>


//         {/* Submit Button - full width */}
//         <div className="md:col-span-2 flex justify-end">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DoctorDetailsForm;



"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import DropdownSelect from './DropdownSelect';

export default function DoctorDetailsForm() {
  const [specialization, setSpecialization] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [workingDays, setWorkingDays] = useState([]);
  const [weeklyHoliday, setWeeklyHoliday] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const specializationOptions = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology",
    "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Urology"
  ];

  const toggleDay = (day) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit all form data including availability
    setShowSuccessPopup(true);
    setTimeout(() => {
      router.push('/doctor/dashboard');
    }, 2000);
  };

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-16">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Your account has been successfully created!</h3>
              <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold mb-6">Doctor's Details</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization:<span className="text-red-500">*</span>
          </label>
          <DropdownSelect
            options={specializationOptions}
            value={specialization}
            onChange={setSpecialization}
            placeholder="Eg. Cardiology"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 5 (in years)"
            required
          />
        </div>

        {/* Hospital Affiliation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Hospital/Clinic Affiliation:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Apollo Hospitals, Chennai"
            required
          />
        </div>

        {/* Hospital Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospital Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. AIIMS, Delhi, India"
          />
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical License Number:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 4456748"
            required
          />
        </div>

        {/* Medical Council */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Medical Council:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. MCI / USMLE"
            required
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Languages:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. English, Hindi"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number:<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 9843XXXXXX"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. you@example.com"
            required
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact number:<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 7843XXXXXX"
            required
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Fee:<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 500"
            required
          />
        </div>

        {/* Consultation Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
          />
        </div>

        {/* File Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Certificate Upload:<span className="text-red-500">*</span>
          </label>
          <FileUpload
            accept=".pdf,.jpg,.jpeg,.png"
            required
            isDragDrop
            fileTypes="PDF, JPG or PNG (max. 5MB)"
            placeholder="Upload PDF/JPG"
          />
        </div>

         {/* government id Upload */}
         <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Government ID Upload:<span className="text-red-500">* PAN, Aadhar card</span>
          </label>
          <FileUpload
            accept=".pdf,.jpg,.jpeg,.png"
            required
            isDragDrop
            fileTypes="PDF, JPG or PNG (max. 5MB)"
            placeholder="Upload PDF/JPG"
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio:<span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. I am a cardiology specialist with 10 years of experience."
          />
        </div>

        {/* Availability / Working Hours */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Availability / Working Hours:<span className="text-red-500">*</span>
          </label>

          {/* Working Days */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'].map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={workingDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Weekly Holiday */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Holiday</label>
            <select
              value={weeklyHoliday}
              onChange={e => setWeeklyHoliday(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">-- Select a Day Off --</option>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
