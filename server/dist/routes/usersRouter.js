"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsersController = __importStar(require("../controllers/usersController"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
// Friends
router.post('/friends/:friendId', middleware_1.verifyToken, UsersController.addFriend);
router.get('/:userId/friends', middleware_1.verifyToken, UsersController.getFriends);
// User
router.post('/profile-picture', middleware_1.verifyToken, middleware_1.FileUploads.profilePicture.single('picture'), UsersController.uploadProfilePic);
router.put('/', middleware_1.verifyToken, UsersController.updateUserData);
router.delete('/', middleware_1.verifyToken, UsersController.deleteUser);
router.get('/:userId', UsersController.getUserById);
router.get('/', UsersController.getUsers);
exports.default = router;
