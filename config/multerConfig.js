const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const uploadsDir = 'uploads';
const tempDir = 'temp';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .doc, .docx, and .txt formats allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;