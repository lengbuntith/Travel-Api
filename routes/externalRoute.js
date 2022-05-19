const { Router } = require("express");
const externalController = require("../controllers/externalController");
const router = Router();
const multer = require("multer");

const storageImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "." + file.mimetype.replace("image/", "");
    console.log("filename", name);
    cb(null, name);
  },
});
const uploadImage = multer({ storage: storageImages });

router.post(
  "/upload-image",
  uploadImage.single("file"),
  externalController.upload_image
);

module.exports = router;
