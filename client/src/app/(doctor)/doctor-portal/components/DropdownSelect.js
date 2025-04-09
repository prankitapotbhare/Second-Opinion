"use client";

import React, { useState, useRef } from 'react';
import { useOnClickOutside } from '../../../../hooks/useOnClickOutside';

const DropdownSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  required = false,
  maxHeight = "60"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center !rounded-button whitespace-nowrap cursor-pointer"
          onClick={toggleDropdown}
        >
          <span>{value || placeholder}</span>
          <i
            className={`fas fa-chevron-${isOpen ? "up" : "down"} text-gray-400`}
          ></i>
        </button>
        {isOpen && (
          <div className={`absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-${maxHeight} overflow-y-auto`}>
            <ul className="py-1">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownSelect;