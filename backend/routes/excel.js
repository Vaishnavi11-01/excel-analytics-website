const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const ExcelFile = require('../models/ExcelFile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel files (.xls, .xlsx) and CSV files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to parse Excel file
const parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheets = [];

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Find the first row that is NOT all numbers, use as headers
      let headerRowIdx = 0;
      while (headerRowIdx < jsonData.length && jsonData[headerRowIdx].every(h => typeof h === 'number' || !isNaN(Number(h)))) {
        headerRowIdx++;
      }
      if (headerRowIdx >= jsonData.length) return; // No valid header row
      const headers = jsonData[headerRowIdx];
      const dataRows = jsonData.slice(headerRowIdx + 1);
      const data = dataRows.map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] !== undefined && row[index] !== null ? row[index] : '';
        });
        return rowData;
      });

      sheets.push({
        name: sheetName,
        headers: headers,
        data: data,
        rowCount: data.length,
        columnCount: headers.length
      });
    });

    return sheets;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// @route   POST /api/excel/upload
// @desc    Upload Excel file
// @access  Private
router.post('/upload', auth, upload.array('file'), [
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          throw new Error('Tags must be a valid JSON string');
        }
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'No files uploaded' 
      });
    }

    // Parse tags from JSON string
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
        if (!Array.isArray(tags)) {
          tags = [];
        }
      } catch (error) {
        tags = [];
      }
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      // Parse the Excel file
      const sheets = parseExcelFile(file.path);
      if (sheets.length === 0) {
        // Delete the uploaded file if it's empty
        await fs.unlink(file.path);
        continue;
      }
      // Create Excel file record
      const excelFile = new ExcelFile({
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        sheets: sheets,
        uploadedBy: req.user._id,
        description: req.body.description || '',
        tags: tags
      });
      await excelFile.save();
      uploadedFiles.push({
        id: excelFile._id,
        filename: excelFile.filename,
        originalName: excelFile.originalName,
        fileSizeMB: excelFile.fileSizeMB,
        sheets: excelFile.sheets.map(sheet => ({
          name: sheet.name,
          rowCount: sheet.rowCount,
          columnCount: sheet.columnCount,
          headers: sheet.headers
        })),
        uploadedAt: excelFile.createdAt
      });
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No valid Excel files uploaded' });
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up uploaded files if they exist
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }
    res.status(500).json({ 
      error: 'Server error during file upload',
      message: error.message 
    });
  }
});

// @route   GET /api/excel/:id/data
// @desc    Get Excel file data
// @access  Private
router.get('/:id/data', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    // Get the first sheet data
    const sheet = file.sheets[0];
    if (!sheet) {
      return res.status(404).json({ 
        error: 'No data found in file' 
      });
    }

    res.json({
      filename: file.originalName,
      size: file.fileSize,
      uploadDate: file.createdAt,
      data: sheet.data
    });
  } catch (error) {
    console.error('Get file data error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching file data' 
    });
  }
});

// @route   POST /api/excel/:id/analyze
// @desc    Analyze Excel file data for charts
// @access  Private
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const { xAxis, yAxis, chartType = 'bar' } = req.body;

    if (!xAxis || !yAxis) {
      return res.status(400).json({ 
        error: 'X-Axis and Y-Axis are required' 
      });
    }

    const file = await ExcelFile.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    const sheet = file.sheets[0];
    if (!sheet) {
      return res.status(404).json({ 
        error: 'No data found in file' 
      });
    }

    // Group data by X-Axis and aggregate Y-Axis
    const groupedData = {};
    sheet.data.forEach(row => {
      const xValue = row[xAxis] || 'Unknown';
      const yValue = parseFloat(row[yAxis]) || 0;
      
      if (!groupedData[xValue]) {
        groupedData[xValue] = 0;
      }
      groupedData[xValue] += yValue;
    });

    // Convert to chart format
    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    res.json({
      labels,
      data,
      chartType,
      xAxis,
      yAxis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Server error during analysis' 
    });
  }
});

// @route   GET /api/excel/:id/download
// @desc    Download Excel file
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Server error during download' 
    });
  }
});

// @route   GET /api/excel/files
// @desc    Get all Excel files for user
// @access  Private
router.get('/files', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { uploadedBy: req.user._id };
    
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const files = await ExcelFile.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-sheets.data')
      .populate('uploadedBy', 'username email');

    const total = await ExcelFile.countDocuments(query);

    res.json({
      files,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalFiles: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching files' 
    });
  }
});

// @route   GET /api/excel/files/:id
// @desc    Get specific Excel file with data
// @access  Private
router.get('/files/:id', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    }).populate('uploadedBy', 'username email');

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    // Update access count and last accessed
    file.accessCount += 1;
    file.lastAccessed = new Date();
    await file.save();

    res.json({
      file: {
        id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        fileSizeMB: file.fileSizeMB,
        sheets: file.sheets,
        description: file.description,
        tags: file.tags,
        uploadedBy: file.uploadedBy,
        uploadedAt: file.createdAt,
        lastAccessed: file.lastAccessed,
        accessCount: file.accessCount
      }
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching file' 
    });
  }
});

// @route   DELETE /api/excel/files/:id
// @desc    Delete Excel file
// @access  Private
router.delete('/files/:id', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    // Delete physical file
    try {
      await fs.unlink(file.filePath);
    } catch (unlinkError) {
      console.error('Error deleting physical file:', unlinkError);
    }

    // Delete from database
    await ExcelFile.findByIdAndDelete(req.params.id);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Server error while deleting file' 
    });
  }
});

// @route   GET /api/excel/analyze/:id/:sheetName
// @desc    Analyze Excel sheet data
// @access  Private
router.get('/analyze/:id/:sheetName', auth, async (req, res) => {
  try {
    const { id, sheetName } = req.params;
    const { column } = req.query;

    const file = await ExcelFile.findOne({
      _id: id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    const sheet = file.sheets.find(s => s.name === sheetName);
    if (!sheet) {
      return res.status(404).json({ 
        error: 'Sheet not found' 
      });
    }

    // Basic statistics
    const analysis = {
      sheetName: sheet.name,
      totalRows: sheet.rowCount,
      totalColumns: sheet.columnCount,
      headers: sheet.headers,
      columnAnalysis: {}
    };

    // Analyze each column
    sheet.headers.forEach(header => {
      const values = sheet.data.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.filter(val => !isNaN(Number(val))).map(val => Number(val));
      
      const columnStats = {
        totalValues: values.length,
        uniqueValues: new Set(values).size,
        nullValues: sheet.data.length - values.length,
        dataType: numericValues.length > 0 ? 'numeric' : 'text'
      };

      if (numericValues.length > 0) {
        columnStats.min = Math.min(...numericValues);
        columnStats.max = Math.max(...numericValues);
        columnStats.average = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        columnStats.sum = numericValues.reduce((a, b) => a + b, 0);
      }

      // Value frequency for text columns
      if (columnStats.dataType === 'text' && values.length > 0) {
        const frequency = {};
        values.forEach(val => {
          frequency[val] = (frequency[val] || 0) + 1;
        });
        columnStats.topValues = Object.entries(frequency)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([value, count]) => ({ value, count }));
      }

      analysis.columnAnalysis[header] = columnStats;
    });

    res.json({
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Server error during analysis' 
    });
  }
});

// @route   GET /api/excel/chart-data/:id/:sheetName
// @desc    Get chart data for specific sheet
// @access  Private
router.get('/chart-data/:id/:sheetName', auth, async (req, res) => {
  try {
    const { id, sheetName } = req.params;
    const { xColumn, yColumn, chartType = 'bar' } = req.query;

    const file = await ExcelFile.findOne({
      _id: id,
      uploadedBy: req.user._id
    });

    if (!file) {
      return res.status(404).json({ 
        error: 'File not found' 
      });
    }

    const sheet = file.sheets.find(s => s.name === sheetName);
    if (!sheet) {
      return res.status(404).json({ 
        error: 'Sheet not found' 
      });
    }

    if (!xColumn || !yColumn) {
      return res.status(400).json({ 
        error: 'X and Y columns are required' 
      });
    }

    if (!sheet.headers.includes(xColumn) || !sheet.headers.includes(yColumn)) {
      return res.status(400).json({ 
        error: 'Invalid column names' 
      });
    }

    // Prepare chart data
    const chartData = {
      labels: [],
      datasets: [{
        label: yColumn,
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    // Group data by X column and aggregate Y column
    const groupedData = {};
    sheet.data.forEach(row => {
      const xValue = row[xColumn] || 'Unknown';
      const yValue = parseFloat(row[yColumn]) || 0;
      
      if (!groupedData[xValue]) {
        groupedData[xValue] = 0;
      }
      groupedData[xValue] += yValue;
    });

    // Convert to chart format
    Object.entries(groupedData).forEach(([label, value]) => {
      chartData.labels.push(label);
      chartData.datasets[0].data.push(value);
    });

    res.json({
      chartData,
      metadata: {
        xColumn,
        yColumn,
        chartType,
        totalDataPoints: Object.keys(groupedData).length
      }
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ 
      error: 'Server error while generating chart data' 
    });
  }
});

module.exports = router; 