import multer from "multer";
import sharp from "sharp";
import fs from "fs"; // 1. Add this
import path from "path"; // 2. Add this

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const resizePostImage = async (req, res, next) => {
  if (!req.file) return next();

  // 3. Define the absolute path to ensure Render knows where to look
  const uploadDir = path.join(process.cwd(), "public/image/posts");

  // 4. Create the folder if it's missing (The "Hero" fix)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  req.body.coverImage = `post-${req.user.id}-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(1200, 630)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, req.body.coverImage)); // Use the safe path

    next();
  } catch (err) {
    // Catch any Sharp errors specifically to prevent a full server crash
    next(err);
  }
};

export const uploadPostImage = upload.single("coverImage");
