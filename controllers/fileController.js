const multer = require("multer");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadFiles = upload.array("files");

exports.createZip = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const zip = archiver("zip");
    const zipFileName = `${uuidv4()}.zip`;

    zip.on("error", (err) => {
      throw err;
    });

    const output = fs.createWriteStream(`./uploads/${zipFileName}`);

    zip.pipe(output);

    for (const file of req.files) {
      zip.append(file.buffer, { name: file.originalname });
    }

    await zip.finalize();

    const zipFileURL = `${req.protocol}://${req.get("host")}/${zipFileName}`;
    res.status(200).json({ url: zipFileURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFile = async (req, res) => {
  const { id } = req.params;
  const filePath = `./uploads/${id}`;

  try {
    if (fs.existsSync(filePath)) {
      const stream = fs.createReadStream(filePath);

      res.setHeader("Content-Type", "application/zip");

      stream.pipe(res);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
