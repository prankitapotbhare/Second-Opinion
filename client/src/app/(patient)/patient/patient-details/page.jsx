// "use client";

// import React, { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FaUpload } from 'react-icons/fa';
// import { submitPatientDetails } from '@/api/patient.api';
// import { usePatient } from '@/contexts/PatientContext';

// export default function PatientDetailsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const doctorId = searchParams.get('doctorId');
//   const { setSubmission } = usePatient();
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     age: '',
//     relation: '',
//     contactNumber: '',
//     email: '',
//     emergencyContact: '',
//     gender: '',
//     problem: '',
//     documents: []
//   });

//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleGenderSelect = (gender) => {
//     setFormData(prev => ({
//       ...prev,
//       gender
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setIsUploading(true);
    
//     // Simulate file upload process
//     setTimeout(() => {
//       setFormData(prev => ({
//         ...prev,
//         documents: [...prev.documents, ...files]
//       }));
//       setIsUploading(false);
//     }, 1000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);
    
//     try {
//       console.log('Patient details submitted:', formData);
      
//       // Call the API to submit patient details
//       const response = await submitPatientDetails(
//         {
//           fullName: formData.fullName,
//           age: formData.age,
//           relation: formData.relation,
//           contactNumber: formData.contactNumber,
//           email: formData.email,
//           emergencyContact: formData.emergencyContact,
//           gender: formData.gender,
//           problem: formData.problem
//         },
//         formData.documents,
//         doctorId
//       );
      
//       // Store the submission in context
//       setSubmission({
//         id: response.submissionId,
//         doctorId: doctorId
//       });
      
//       // Redirect to success page instead of directly to responses
//       router.push('/patient/response');
//     } catch (err) {
//       console.error('Error submitting patient details:', err);
//       setError(err.message || 'Failed to submit patient details. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-8">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-6">Patient's Details</h1>
          
//           {error && (
//             <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
//               {error}
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="relative">
//             <div className="space-y-4">
//               {/* Full Name */}
//               <div>
//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full Name"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Age */}
//               <div>
//                 <input
//                   type="number"
//                   name="age"
//                   placeholder="Age"
//                   value={formData.age}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Relation with patient */}
//               <div>
//                 <input
//                   type="text"
//                   name="relation"
//                   placeholder="Your relation with patient"
//                   value={formData.relation}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Contact Number */}
//               <div>
//                 <input
//                   type="tel"
//                   name="contactNumber"
//                   placeholder="Contact Number"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Email */}
//               <div>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Emergency Contact */}
//               <div>
//                 <input
//                   type="tel"
//                   name="emergencyContact"
//                   placeholder="Emergency Contact Number"
//                   value={formData.emergencyContact}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                   required
//                 />
//               </div>
              
//               {/* Gender Selection */}
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   type="button"
//                   onClick={() => handleGenderSelect('Male')}
//                   className={`px-4 py-3 border rounded-md text-center ${
//                     formData.gender === 'Male' 
//                       ? 'border-teal-500 bg-teal-50 text-teal-700' 
//                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Male
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleGenderSelect('Female')}
//                   className={`px-4 py-3 border rounded-md text-center ${
//                     formData.gender === 'Female' 
//                       ? 'border-teal-500 bg-teal-50 text-teal-700' 
//                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Female
//                 </button>
//               </div>
              
//               {/* Problem Description */}
//               <div>
//                 <textarea
//                   name="problem"
//                   placeholder="Write your problem"
//                   value={formData.problem}
//                   onChange={handleChange}
//                   rows={6}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
//                   required
//                 ></textarea>
//               </div>
              
//               {/* Document Upload */}
//               <div>
//                 <label className="block w-full cursor-pointer">
//                   <div className="flex items-center justify-center w-full px-4 py-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
//                     <FaUpload className="mr-2 text-teal-600" />
//                     <span>Upload Your Documents</span>
//                     <input
//                       type="file"
//                       multiple
//                       className="hidden"
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                 </label>
                
//                 {/* Display uploaded files */}
//                 {formData.documents.length > 0 && (
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
//                     <ul className="text-sm text-gray-800">
//                       {formData.documents.map((file, index) => (
//                         <li key={index} className="mb-1">
//                           {file.name}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
                
//                 {isUploading && (
//                   <div className="mt-2">
//                     <p className="text-sm text-teal-600">Uploading...</p>
//                   </div>
//                 )}
//               </div>
              
//               {/* Submit Button */}
//               <div className="pt-4 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit Documents'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FaUpload } from 'react-icons/fa';
// import { submitPatientDetails } from '@/api/patient.api';
// import { usePatient } from '@/contexts/PatientContext';

// export default function PatientDetailsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const doctorId = searchParams.get('doctorId');
//   const { setSubmission } = usePatient();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     age: '',
//     relation: '',
//     contactNumber: '',
//     email: '',
//     emergencyContact: '',
//     gender: '',
//     problem: '',
//     documents: []
//   });

//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleGenderSelect = (gender) => {
//     setFormData(prev => ({ ...prev, gender }));
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setIsUploading(true);

//     setTimeout(() => {
//       setFormData(prev => ({
//         ...prev,
//         documents: [...prev.documents, ...files]
//       }));
//       setIsUploading(false);
//     }, 1000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const response = await submitPatientDetails(
//         {
//           fullName: formData.fullName,
//           age: formData.age,
//           relation: formData.relation,
//           contactNumber: formData.contactNumber,
//           email: formData.email,
//           emergencyContact: formData.emergencyContact,
//           gender: formData.gender,
//           problem: formData.problem
//         },
//         formData.documents,
//         doctorId
//       );

//       setSubmission({
//         id: response.submissionId,
//         doctorId: doctorId
//       });

//       router.push('/patient/response');
//     } catch (err) {
//       console.error('Error submitting patient details:', err);
//       setError(err.message || 'Failed to submit patient details. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Patient's Details</h1>

//         {error && (
//           <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input
//             type="text"
//             name="fullName"
//             placeholder="Full Name"
//             value={formData.fullName}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           <input
//             type="number"
//             name="age"
//             placeholder="Age"
//             value={formData.age}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           <input
//             type="text"
//             name="relation"
//             placeholder="Your relation with patient"
//             value={formData.relation}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           <input
//             type="tel"
//             name="contactNumber"
//             placeholder="Contact Number"
//             value={formData.contactNumber}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           <input
//             type="tel"
//             name="emergencyContact"
//             placeholder="Emergency Contact Number"
//             value={formData.emergencyContact}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//             required
//           />

//           {/* Gender Buttons */}
//           <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
//             <button
//               type="button"
//               onClick={() => handleGenderSelect('Male')}
//               className={`px-4 py-3 border rounded-md text-center ${
//                 formData.gender === 'Male'
//                   ? 'border-teal-500 bg-teal-50 text-teal-700'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Male
//             </button>
//             <button
//               type="button"
//               onClick={() => handleGenderSelect('Female')}
//               className={`px-4 py-3 border rounded-md text-center ${
//                 formData.gender === 'Female'
//                   ? 'border-teal-500 bg-teal-50 text-teal-700'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Female
//             </button>
//           </div>

//           {/* Problem */}
//           <textarea
//             name="problem"
//             placeholder="Write your problem"
//             value={formData.problem}
//             onChange={handleChange}
//             rows={6}
//             className="col-span-1 md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
//             required
//           ></textarea>

//           {/* Document Upload */}
//           <div className="col-span-1 md:col-span-2">
//             <label className="block w-full cursor-pointer">
//               <div className="flex items-center justify-center w-full px-4 py-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
//                 <FaUpload className="mr-2 text-teal-600" />
//                 <span>Upload Your Documents</span>
//                 <input
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={handleFileUpload}
//                 />
//               </div>
//             </label>

//             {formData.documents.length > 0 && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
//                 <ul className="text-sm text-gray-800">
//                   {formData.documents.map((file, index) => (
//                     <li key={index} className="mb-1">{file.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {isUploading && (
//               <div className="mt-2">
//                 <p className="text-sm text-teal-600">Uploading...</p>
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit Documents'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUpload } from 'react-icons/fa';
import { submitPatientDetails } from '@/api/patient.api';
import { usePatient } from '@/contexts/PatientContext';

export default function PatientDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const { setSubmission } = usePatient();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    relation: '',
    contactNumber: '',
    email: '',
    emergencyContact: '',
    gender: '',
    problem: '',
    documents: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
      setIsUploading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitPatientDetails(
        {
          fullName: formData.fullName,
          age: formData.age,
          relation: formData.relation,
          contactNumber: formData.contactNumber,
          email: formData.email,
          emergencyContact: formData.emergencyContact,
          gender: formData.gender,
          problem: formData.problem
        },
        formData.documents,
        doctorId
      );

      setSubmission({
        id: response.submissionId,
        doctorId: doctorId
      });

      router.push('/patient/response');
    } catch (err) {
      console.error('Error submitting patient details:', err);
      setError(err.message || 'Failed to submit patient details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Patient's Details</h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age<span className="text-red-500">*</span></label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Relation */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Relation with Patient<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="relation"
              placeholder="Your relation with patient"
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Contact Number<span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="+91 1234567890"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Emergency Contact Number<span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="emergencyContact"
              placeholder="+91 9876543210"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Gender */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Gender<span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleGenderSelect('Male')}
                className={`px-4 py-3 border rounded-md text-center ${
                  formData.gender === 'Male'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderSelect('Female')}
                className={`px-4 py-3 border rounded-md text-center ${
                  formData.gender === 'Female'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Problem */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Problem Description<span className="text-red-500">*</span></label>
            <textarea
              name="problem"
              placeholder="Write your problem"
              value={formData.problem}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              required
            ></textarea>
          </div>

          {/* Document Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Upload Documents (if any)</label>
            <label className="block w-full cursor-pointer">
              <div className="flex items-center justify-center w-full px-4 py-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FaUpload className="mr-2 text-teal-600" />
                <span>Upload Your Documents</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </label>

            {formData.documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
                <ul className="text-sm text-gray-800">
                  {formData.documents.map((file, index) => (
                    <li key={index} className="mb-1">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <p className="text-sm text-teal-600">Uploading...</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Documents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
