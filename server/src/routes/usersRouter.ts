import express from 'express';
import * as UsersController from '../controllers/usersController';
import { verifyToken, FileUploads } from '../middleware';

const router = express.Router();

// Friend requests
router.post(
  '/friendRequests/:friendId',
  verifyToken,
  UsersController.sendFriendRequest,
);
router.delete(
  '/friendRequests/:friendId',
  verifyToken,
  UsersController.deleteFriendRequest,
);

// Friends
router.post('/friends/:friendId', verifyToken, UsersController.addFriend);
router.delete('/friends/:friendId', verifyToken, UsersController.deleteFriend);
router.get('/:userId/friends', verifyToken, UsersController.getFriends);

// User
router.post(
  '/profile-picture',
  verifyToken,
  FileUploads.profilePicture.single('picture'),
  UsersController.uploadProfilePic,
);
router.put('/', verifyToken, UsersController.updateUserData);
router.delete('/', verifyToken, UsersController.deleteUser);
router.get('/:userId', UsersController.getUserById);
router.get('/', UsersController.getUsers);

export default router;
