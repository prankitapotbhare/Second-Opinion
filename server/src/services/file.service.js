
const cloudinary = require('./cloudinary.js');
const { Readable } = require('stream');

const uploadToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: 'auto',
        ...options 
      },
      (error, result) => {
        if (error) return reject(error);
        
        // Standardize the response format
        const standardized = {
          public_id: result.public_id,
          url: result.secure_url, // Map secure_url to url
          secure_url: result.secure_url,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          // Include any additional needed fields
          ...(result.original_filename && { originalName: result.original_filename })
        };

        // Validation check
        if (!standardized.url || !standardized.secure_url) {
          return reject(new Error('Cloudinary response missing required URL fields'));
        }

        resolve(standardized);
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};