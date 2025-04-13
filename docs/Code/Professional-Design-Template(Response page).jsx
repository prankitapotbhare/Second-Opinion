// // The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// "use client";
// import React, { useState } from 'react';

// const App = () => {
//   const [activeTab, setActiveTab] = useState('response');

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation Header */}
//       <header className="flex items-center justify-between px-16 py-4 border-b border-gray-200">
//         <div className="flex items-center">
//           <h1 className="text-xl font-medium">
//             <span className="text-teal-600">Second</span> opinion
//           </h1>
//         </div>
        
//         <nav className="flex items-center space-x-8">
//           <a href="#" className="text-gray-600 hover:text-teal-600 cursor-pointer">Home</a>
//           <a href="#" className="text-teal-600 font-medium cursor-pointer">Response</a>
//           <a href="#" className="text-gray-600 hover:text-teal-600 cursor-pointer">Login</a>
//           <a href="#" className="text-gray-600 hover:text-teal-600 cursor-pointer">Signin</a>
//           <a href="#" className="text-gray-600 hover:text-teal-600 cursor-pointer">FAQs</a>
//         </nav>
        
//         <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer">
//           Contact us
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-16 py-8">
//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 mb-8">
//           <button 
//             className={`pb-4 px-4 text-lg font-medium ${activeTab === 'response' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer !rounded-button whitespace-nowrap`}
//             onClick={() => setActiveTab('response')}
//           >
//             Response (1)
//           </button>
//           <button 
//             className={`pb-4 px-4 text-lg font-medium ml-auto ${activeTab === 'comments' ? 'text-black border-b-2 border-teal-600' : 'text-gray-500'} cursor-pointer !rounded-button whitespace-nowrap`}
//             onClick={() => setActiveTab('comments')}
//           >
//             Comments
//           </button>
//         </div>

//         {/* Response Section */}
//         {activeTab === 'response' && (
//           <div>
//             <h2 className="text-2xl font-medium mb-6">Response</h2>
//             <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
//               <p className="text-gray-800 leading-relaxed">
//                 As a precaution, please avoid heavy activities and ensure proper rest. Let's do a 
//                 detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If 
//                 symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep 
//                 a daily log of your symptoms to help us understand any patterns. Avoid screen time 
//                 and loud environments if they trigger discomfort.
//               </p>
//             </div>

//             <h2 className="text-2xl font-medium mb-6">Documents</h2>
//             <div className="bg-white border border-gray-200 rounded-lg p-8">
//               <div className="grid grid-cols-4 gap-6">
//                 {/* Document 1 */}
//                 <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center cursor-pointer">
//                   <div className="bg-teal-600 text-white p-4 rounded-lg mb-3">
//                     <i className="fas fa-file-alt text-2xl"></i>
//                   </div>
//                   <span className="text-gray-800 font-medium">File.pdf</span>
//                 </div>

//                 {/* Document 2 */}
//                 <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center cursor-pointer">
//                   <div className="bg-teal-600 text-white p-4 rounded-lg mb-3">
//                     <i className="fas fa-file-alt text-2xl"></i>
//                   </div>
//                   <span className="text-gray-800 font-medium">Report.pdf</span>
//                 </div>

//                 {/* Document 3 */}
//                 <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center cursor-pointer">
//                   <div className="bg-teal-600 text-white p-4 rounded-lg mb-3">
//                     <i className="fas fa-file-alt text-2xl"></i>
//                   </div>
//                   <span className="text-gray-800 font-medium">File.pdf</span>
//                 </div>

//                 {/* Document 4 */}
//                 <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center cursor-pointer">
//                   <div className="bg-teal-600 text-white p-4 rounded-lg mb-3">
//                     <i className="fas fa-file-alt text-2xl"></i>
//                   </div>
//                   <span className="text-gray-800 font-medium">File.pdf</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Comments Section (Empty for now) */}
//         {activeTab === 'comments' && (
//           <div className="min-h-[600px] flex items-center justify-center">
//             <p className="text-gray-500 text-lg">No comments available</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default App;

