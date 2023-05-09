import express from 'express';
import {
  updateUserData,
  deleteUser,
  getUserById,
  getAllUsers,
  getFriends,
  addFriend,
  deleteFriend,
  sendFriendRequest,
  getFriendRequests,
  deleteFriendRequest,
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

// Friend requests
router.get('/friendRequests', verifyToken, getFriendRequests);
router.post('/friendRequests/:friendId', verifyToken, sendFriendRequest);
router.delete('/friendRequests/:friendId', verifyToken, deleteFriendRequest);

// Friends
router.post('/friends/:friendId', verifyToken, addFriend);
router.delete('/friends/:friendId', verifyToken, deleteFriend);
router.get('/:userId/friends', verifyToken, getFriends);

// User
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);
router.get('/:userId', getUserById);
router.get('/', getAllUsers);

export default router;
