"use client";

import React, { useState, useEffect } from 'react';
import { FaTrash, FaCamera } from 'react-icons/fa';

const FileUpload = ({ 
  label, 
  accept = "image/*", 
  onChange,
  onDelete,
  required = false,
  isDragDrop = false,
  description = "",
  fileTypes = "",
  name,
  value = null,
  preview = null,
  isProfilePhoto = false
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Initialize from props
  useEffect(() => {
    if (value) {
      setSelectedFile(value);
    }
    if (preview) {
      setFilePreview(preview);
    }
  }, [value, preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
      
      if (onChange) {
        onChange({
          target: {
            name,
            files: e.target.files
          }
        });
      }
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    
    if (onDelete) {
      onDelete(name);
    }
  };

  // Profile photo specific UI
  if (isProfilePhoto) {
    return (
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <img
            src={filePreview || "https://public.readdy.ai/ai/img_res/fc4e928c7d3a4337c7173c0e07f786b5.jpg"}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top"
          />
          <label htmlFor={name} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer">
            <FaCamera />
            <input 
              type="file" 
              id={name} 
              name={name} 
              className="hidden" 
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">Upload your profile photo</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isDragDrop ? (
        <div>
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex flex-col items-center space-y-2">
              <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
              <span className="font-medium text-gray-600">
                {selectedFile ? selectedFile.name : "Drop files to upload or browse"}
              </span>
              {fileTypes && !selectedFile && (
                <span className="text-xs text-gray-500">
                  {fileTypes}
                </span>
              )}
            </span>
            <input
              type="file"
              className="hidden"
              name={name}
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
          
          {selectedFile && (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
              <span>{selectedFile.name}</span>
              <button 
                onClick={handleDeleteFile}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Delete file"
                type="button"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            {description && (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                {description}
              </div>
            )}
            <label className="cursor-pointer">
              <span className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 !rounded-button whitespace-nowrap">
                Upload
              </span>
              <input
                type="file"
                className="hidden"
                name={name}
                accept={accept}
                onChange={handleFileChange}
              />
            </label>
            
            {selectedFile && (
              <button 
                onClick={handleDeleteFile}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Delete file"
                type="button"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
          
          {selectedFile && (
            <div className="text-sm text-gray-600">
              {selectedFile.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;