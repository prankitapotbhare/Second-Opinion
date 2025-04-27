// "use client";
// import { useState } from "react";
// import { faqs } from "@/data/staticData";

// export default function FAQSection() {
//   const [activeQuestion, setActiveQuestion] = useState(null);

//   const toggleQuestion = (index) => {
//     setActiveQuestion(activeQuestion === index ? null : index);
//   };

//   return (
//     <section className="py-16 bg-[#f5f5f5]">
//       <div className="container mx-auto px-6">
//         <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
//           Frequently Asked Questions
//         </h2>
//         <div className="max-w-3xl mx-auto space-y-4">
//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <button
//                 className="w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer focus:outline-none"
//                 onClick={() => toggleQuestion(index)}
//               >
//                 <span className="font-medium text-gray-800">{faq.question}</span>
//                 <i
//                   className={`fas ${activeQuestion === index ? "fa-chevron-up" : "fa-chevron-down"} text-teal-600`}
//                 ></i>
//               </button>
//               {activeQuestion === index && (
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                   <p className="text-gray-600">{faq.answer}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";
import { useState } from "react";
import { faqs } from "@/data/staticData";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function FAQSection() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeQuestion === index;

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer focus:outline-none"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {isOpen ? (
                    <FiChevronUp className="text-teal-600 text-xl transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="text-teal-600 text-xl transition-transform duration-300" />
                  )}
                </button>
                <div
                  className={`px-6 bg-gray-50 border-t border-gray-100 overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
                  }`}
                >
                  <p
                    className={`text-gray-600 transition-opacity duration-300 ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
