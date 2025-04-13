// "use client";
// // The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// import React, { useState } from 'react';

// const App = () => {
//   const [activeQuestion, setActiveQuestion] = useState(null);
  
//   const toggleQuestion = (index) => {
//     setActiveQuestion(activeQuestion === index ? null : index);
//   };
  
//   const faqData = [
//     {
//       question: "What is a second opinion and why is it important?",
//       answer: "A second opinion is a medical consultation from another doctor to confirm a diagnosis or explore alternative treatment options. It's important because it can provide peace of mind, additional insights, and potentially better treatment outcomes."
//     },
//     {
//       question: "How do I upload medical reports?",
//       answer: "You can upload your medical reports by logging into your account, navigating to the 'Upload Documents' section, and following the simple step-by-step instructions. We accept various file formats including PDF, JPG, and PNG."
//     },
//     {
//       question: "Is my data safe with this platform?",
//       answer: "Yes, we take data security very seriously. All your medical information is encrypted and stored securely following HIPAA compliance standards. We never share your data with third parties without your explicit consent."
//     },
//     {
//       question: "How long does it take to receive a doctor's response?",
//       answer: "Typically, you'll receive a response within 24-48 hours after submitting your request. For urgent cases, we offer expedited services that can provide responses within 24 hours."
//     },
//     {
//       question: "Can I choose a specific doctor or department?",
//       answer: "Yes, you can choose a specific doctor based on their specialty or select a particular department for your second opinion. Our platform allows you to browse through profiles and select the most suitable expert for your needs."
//     }
//   ];
  
//   const doctors = [
//     {
//       name: "Dr. Emily Johnson",
//       specialization: "Cardiology",
//       qualification: "M.D., FACC",
//       experience: "8 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20female%20cardiologist%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=1&orientation=portrait"
//     },
//     {
//       name: "Dr. Michael Chen",
//       specialization: "Oncology",
//       qualification: "M.D., Ph.D.",
//       experience: "12 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20male%20oncologist%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=2&orientation=portrait"
//     },
//     {
//       name: "Dr. Sarah Williams",
//       specialization: "Neurology",
//       qualification: "M.B.B.S., MRCP",
//       experience: "9 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20female%20neurologist%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=3&orientation=portrait"
//     },
//     {
//       name: "Dr. James Rodriguez",
//       specialization: "Orthopedics",
//       qualification: "M.D., FAAOS",
//       experience: "15 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20male%20orthopedic%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=4&orientation=portrait"
//     },
//     {
//       name: "Dr. Lisa Thompson",
//       specialization: "Dermatology",
//       qualification: "M.D., FAAD",
//       experience: "7 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20female%20dermatologist%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=5&orientation=portrait"
//     },
//     {
//       name: "Dr. Robert Kim",
//       specialization: "Gastroenterology",
//       qualification: "M.D., FACG",
//       experience: "11 years",
//       imageUrl: "https://readdy.ai/api/search-image?query=Professional%20male%20gastroenterologist%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20smiling%20confidently%20in%20modern%20medical%20office%2C%20high%20quality%20portrait%20with%20soft%20lighting%20and%20clean%20medical%20background%2C%20professional%20headshot&width=300&height=350&seq=6&orientation=portrait"
//     }
//   ];
  
//   return (
//     <div className="min-h-screen bg-[#e6f5f5]">
//       {/* Header/Navigation */}
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="text-xl font-semibold text-teal-700">Second Opinion</div>
//           <nav className="hidden md:flex items-center space-x-6">
//             <a href="#" className="text-gray-700 hover:text-teal-600">Home</a>
//             <a href="#" className="text-gray-700 hover:text-teal-600">Response</a>
//             <a href="#" className="text-gray-700 hover:text-teal-600">Login</a>
//             <a href="#" className="text-gray-700 hover:text-teal-600">SignIn</a>
//             <a href="#" className="text-gray-700 hover:text-teal-600">FAQs</a>
//             <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer">Contact Us</button>
//           </nav>
//         </div>
//       </header>
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 z-10">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Best Recommended Doctors</h1>
//             <h2 className="text-3xl font-bold text-gray-800 mb-8">Expert advice Trusted decision!</h2>
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-search text-gray-400"></i>
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Search Location"
//                   className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-search text-gray-400"></i>
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="Search Department"
//                   className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
//                 />
//               </div>
//               <button className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer">
//                 <i className="fas fa-user-md mr-2"></i>
//                 Find Doctors
//               </button>
//             </div>
//           </div>
//           <div className="md:w-1/2 relative mt-10 md:mt-0">
//             <div className="relative">
//               <div className="bg-teal-100 rounded-full h-80 w-80 mx-auto overflow-hidden">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=Professional%20male%20doctor%20in%20white%20coat%20with%20stethoscope%20smiling%20confidently%20holding%20clipboard%2C%20standing%20against%20light%20teal%20background%2C%20high%20quality%20portrait%20with%20clean%20medical%20professional%20appearance%2C%20friendly%20approachable%20healthcare%20provider&width=500&height=500&seq=7&orientation=portrait"
//                   alt="Doctor"
//                   className="object-cover w-full h-full object-top"
//                 />
//               </div>
//               <div className="absolute -top-4 right-10 bg-white py-2 px-4 rounded-lg shadow-md">
//                 <div className="flex items-center text-sm">
//                   <i className="fas fa-calendar-check text-teal-500 mr-2"></i>
//                   <span>Easy Appointment Booking</span>
//                 </div>
//               </div>
//               <div className="absolute bottom-4 left-0 bg-white py-2 px-4 rounded-lg shadow-md">
//                 <div className="flex items-center text-sm">
//                   <i className="fas fa-clipboard-check text-teal-500 mr-2"></i>
//                   <span>Get Your Second Opinion Today</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Doctors Section */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-12">
//             <span className="text-gray-800">Our </span>
//             <span className="text-teal-600">Recommended</span>
//             <span className="text-gray-800"> Best Doctors...</span>
//           </h2>
//           <div className="grid md:grid-cols-2 gap-6">
//             {doctors.map((doctor, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
//                 <div className="w-32 h-32 overflow-hidden rounded-lg mr-6">
//                   <img
//                     src={doctor.imageUrl}
//                     alt={doctor.name}
//                     className="w-full h-full object-cover object-top"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
//                   <p className="text-gray-600 mb-1">{doctor.specialization}</p>
//                   <p className="text-gray-600 mb-1">{doctor.qualification}</p>
//                   <p className="text-gray-600">Experience: {doctor.experience}</p>
//                 </div>
//                 <div className="flex flex-col space-y-3">
//                   <button className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer">
//                     Know More
//                   </button>
//                   <button className="border border-teal-600 text-teal-600 px-4 py-2 rounded text-sm hover:bg-teal-50 transition-colors !rounded-button whitespace-nowrap cursor-pointer">
//                     Book a consultant
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* FAQ Section */}
//       <section className="py-16 bg-[#f5f5f5]">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
//           <div className="max-w-3xl mx-auto space-y-4">
//             {faqData.map((faq, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 <button
//                   className="w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer focus:outline-none"
//                   onClick={() => toggleQuestion(index)}
//                 >
//                   <span className="font-medium text-gray-800">{faq.question}</span>
//                   <i className={`fas ${activeQuestion === index ? 'fa-chevron-up' : 'fa-chevron-down'} text-teal-600`}></i>
//                 </button>
//                 {activeQuestion === index && (
//                   <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                     <p className="text-gray-600">{faq.answer}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* Footer */}
//       <footer className="bg-teal-700 text-white py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold mb-4 flex items-center">
//                 <i className="fas fa-comment-medical mr-2"></i>
//                 Second Opinion
//               </h3>
//               <div className="flex space-x-4 mt-4">
//                 <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
//                   <i className="fab fa-facebook-square text-2xl"></i>
//                 </a>
//                 <a href="#" className="text-white hover:text-teal-200 transition-colors cursor-pointer">
//                   <i className="fab fa-twitter-square text-2xl"></i>
//                 </a>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
//               <div className="space-y-2">
//                 <p className="flex items-center">
//                   <i className="fas fa-phone-alt mr-2"></i>
//                   +1 (555) 123-4567
//                 </p>
//                 <p className="flex items-center">
//                   <i className="fas fa-envelope mr-2"></i>
//                   support@secondopinion.com
//                 </p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Social Media</h3>
//               <div className="space-y-2">
//                 <p>LinkedIn</p>
//                 <p>Twitter</p>
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
//               <div className="space-y-2">
//                 <p>Available 24/7</p>
//                 <p>Priority Support</p>
//                 <p>For urgent medical requests, response within 24 hours</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default App;
