const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const datetime = 
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
    
    cb(null, `${datetime}.png`);
  },
});


const upload = multer({ storage });

async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `/cdn/${req.file.filename}`,
  });
}

async function listFiles(req, res) {
  const files = fs.readdirSync(uploadDir);
  res.json(files);
}

async function deleteFile(req, res) {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
}

module.exports = {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
};
