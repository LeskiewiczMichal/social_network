import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const url = process.env.MONGO_DB;

if (!url) {
  throw new Error('Environment variables not set');
}

const uploadDir = path.join(__dirname, '../../uploads');
const generateFilename = (filename: string) => {
  const ext = path.extname(filename);
  return `${uuidv4()}${ext}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;
