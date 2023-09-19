const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");

const fileRoutes = require("./routes/fileRoutes");

const app = express();
const port = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/", fileRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ error: "No routes found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
