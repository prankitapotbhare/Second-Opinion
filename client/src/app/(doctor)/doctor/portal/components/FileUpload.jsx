"use client";

import React, { useState } from 'react';

const FileUpload = ({ 
  label, 
  accept = "image/*", 
  onChange,
  required = false,
  isDragDrop = false,
  description = "",
  fileTypes = ""
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onChange) {
        onChange(e);
      }
    }
  };

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
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Uploaded file: {selectedFile.name}
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
                accept={accept}
                onChange={handleFileChange}
              />
            </label>
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-600 mt-2">
              Selected file: {selectedFile.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;