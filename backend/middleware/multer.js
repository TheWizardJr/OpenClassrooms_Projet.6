const multer = require("multer");

const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, makeFilename(req, file));
  },
});

function makeFilename(req, file) {
  const filename = Date.now() + "-" + file.originalname;
  file.fileName = filename;
  return filename;
}
const upload = multer({ storage });

module.exports = { upload };
