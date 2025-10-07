const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Gagal membuat folder upload:', err);
  }
})();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const datetime =
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());

    cb(null, `${datetime}_${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({ storage });

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
    }

    res.status(200).json({
      message: 'File berhasil diunggah!',
      filename: req.file.filename,
      url: `/cdn/${req.file.filename}`,
    });
  } catch (err) {
    console.error('uploadFile error', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file.' });
  }
}

async function listFiles(req, res) {
  try {
    const files = await fs.readdir(uploadDir);
    res.status(200).json(files);
  } catch (err) {
    console.error('listFiles error', err);
    res.status(500).json({ message: 'Gagal membaca daftar file.' });
  }
}

async function deleteFile(req, res) {
  try {
    const filePath = path.join(uploadDir, req.params.filename);
    await fs.access(filePath); 
    await fs.unlink(filePath);

    res.status(200).json({ message: 'File berhasil dihapus.' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ message: 'File tidak ditemukan.' });
    }
    console.error('deleteFile error', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus file.' });
  }
}

module.exports = {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
};
