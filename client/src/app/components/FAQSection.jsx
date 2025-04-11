"use client";
import { useState } from "react";
import { faqs } from "@/data/staticData";

export default function FAQSection() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left p-5 focus:outline-none flex justify-between items-center cursor-pointer"
                onClick={() => toggleQuestion(index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <i
                  className={`fas ${activeQuestion === index ? "fa-chevron-up" : "fa-chevron-down"} text-green-600`}
                ></i>
              </button>
              {activeQuestion === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}