const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  // Reference to the owner (could be patient or doctor)
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerModel'
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ['Patient', 'Doctor']
  },

  // Cloudinary storage data
  cloudinary: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    },
    format: String,
    resource_type: String,
    bytes: Number
  },

  // File metadata
  originalName: String,
  mimeType: String,
  size: Number,
  description: String,

  // File classification
  category: {
    type: String,
    enum: [
      'medical_record',
      'prescription', 
      'lab_result',
      'doctor_certification',
      'registration_certificate',
      'government_id',
      'profile_photo',
      'other'
    ],
    required: true
  },

  // Timestamps
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
fileSchema.index({ owner: 1, ownerModel: 1 });
fileSchema.index({ category: 1 });
fileSchema.index({ deletedAt: 1 });

// Soft delete method
fileSchema.methods.softDelete = async function() {
  this.deletedAt = new Date();
  await this.save();
  return this;
};

// Virtual for easy frontend access
fileSchema.virtual('thumbnail').get(function() {
  if (this.cloudinary.resource_type === 'image') {
    return this.cloudinary.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill/');
  }
  return null;
});

module.exports = mongoose.model('File', fileSchema);