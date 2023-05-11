"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPhoto = exports.profilePicture = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const url = process.env.MONGO_DB;
if (!url) {
    throw new Error('Environment variables not set');
}
const generateFilename = (filename) => {
    const ext = path_1.default.extname(filename);
    return `${(0, uuid_1.v4)()}${ext}`;
};
const profilePicsDir = path_1.default.join(__dirname, '../../uploads/profilePictures');
const profilePicsStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePicsDir);
    },
    filename: (req, file, cb) => {
        const filename = generateFilename(file.originalname);
        cb(null, filename);
    },
});
const postPhotoDir = path_1.default.join(__dirname, '../../uploads/photos');
const postPhotoStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, postPhotoDir);
    },
    filename: (req, file, cb) => {
        const filename = generateFilename(file.originalname);
        cb(null, filename);
    },
});
const profilePicture = (0, multer_1.default)({ storage: profilePicsStorage });
exports.profilePicture = profilePicture;
const postPhoto = (0, multer_1.default)({ storage: postPhotoStorage });
exports.postPhoto = postPhoto;
