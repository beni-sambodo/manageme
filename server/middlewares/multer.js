import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../utils/aws-s3.js";
import { bucket } from "../config/const.config.js";
import File from "../models/File.js";

const generateUniqueKey = async (dir, file) => {
  let unique = Math.floor(Math.random() * 1000000);
  let key = `${dir}/${Date.now()}-${unique}.${file.mimetype.split("/")[1]}`;
  let existingFile = await File.findOne({ key });

  while (existingFile) {
    unique = Math.floor(Math.random() * 1000000);
    key = `${dir}/${Date.now()}-${unique}.${file.mimetype.split("/")[1]}`;
    existingFile = await File.findOne({ key });
  }

  return key;
};

const createMulter = (dir) => {
  return multer({
    storage: multerS3({
      s3,
      bucket,
      metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname });
      },
      key: async function (req, file, cb) {
        try {
          const uniqueKey = await generateUniqueKey(dir, file);
          cb(null, "manageme/" + uniqueKey);
        } catch (error) {
          cb(error);
        }
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
  });
};

const uploadToFolder = async (req, res, next) => {
  const folder = req.params.folder;
  const multerInstance = createMulter(folder);

  try {
    if (req.files && req.files.length === 1) {
      multerInstance.single("file")(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload failed", error: err.message });
        }
        next();
      });
    } else {
      multerInstance.array("file", 10)(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload failed", error: err.message });
        }
        next();
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export default uploadToFolder;
