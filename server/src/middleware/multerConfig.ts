import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const url = process.env.MONGO_DB;

if (!url) {
  throw new Error('Environment variables not set');
}

const generateFilename = (filename: string) => {
  const ext = path.extname(filename);
  return `${uuidv4()}${ext}`;
};

const profilePicsDir = path.join(__dirname, '../../uploads/profilePictures');
const profilePicsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicsDir);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  },
});

const postPhotoDir = path.join(__dirname, '../../uploads/photos');
const postPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postPhotoDir);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  },
});

const profilePicture = multer({ storage: profilePicsStorage });
const postPhoto = multer({ storage: postPhotoStorage });

export { profilePicture, postPhoto };
