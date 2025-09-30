const express = require("express");
const router = express.Router();

const cdnController = require("../controllers/cdnController");

router.post("/upload", cdnController.upload.single("file"), cdnController.uploadFile);
router.get("/list", cdnController.listFiles);
router.delete("/delete/:filename", cdnController.deleteFile);

module.exports = router;
