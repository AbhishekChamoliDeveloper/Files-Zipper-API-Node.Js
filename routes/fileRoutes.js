const express = require("express");
const fileController = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", fileController.uploadFiles, fileController.createZip);

router.get("/:id", fileController.getFile);

module.exports = router;
