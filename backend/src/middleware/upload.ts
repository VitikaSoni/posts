import multer from "multer";

// Configure multer for file uploads - only extract metadata, don't store files
const upload = multer({
  storage: multer.memoryStorage(), // Process files in memory only
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default upload;
