const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  sheets: [{
    name: String,
    data: [{
      type: mongoose.Schema.Types.Mixed
    }],
    headers: [String],
    rowCount: Number,
    columnCount: Number
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
excelFileSchema.index({ uploadedBy: 1, createdAt: -1 });
excelFileSchema.index({ filename: 'text', description: 'text' });

// Virtual for file size in MB
excelFileSchema.virtual('fileSizeMB').get(function() {
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

// Ensure virtual fields are serialized
excelFileSchema.set('toJSON', { virtuals: true });
excelFileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ExcelFile', excelFileSchema); 