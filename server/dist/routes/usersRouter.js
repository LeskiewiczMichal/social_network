"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get('/friendRequests', middleware_1.verifyToken, usersController_1.getFriendRequests);
router.get('/', usersController_1.getAllUsers);
router.get('/:userId', usersController_1.getUser);
router.put('/', middleware_1.verifyToken, usersController_1.updateUserData);
router.delete('/', middleware_1.verifyToken, usersController_1.deleteUser);
router.get('/:userId/friends', middleware_1.verifyToken, usersController_1.getFriends);
router.post('/friends/:friendId', middleware_1.verifyToken, usersController_1.addFriend);
router.delete('/friends/:friendId', middleware_1.verifyToken, usersController_1.deleteFriend);
router.post('/friendRequests/:userId', middleware_1.verifyToken, usersController_1.sendFriendRequest);
exports.default = router;
