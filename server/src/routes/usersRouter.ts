import express from 'express';
import {
  updateUserData,
  deleteUser,
  getUser,
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
router.post('/friendRequests/:userId', verifyToken, sendFriendRequest);
router.delete('/friendRequests/:userId', verifyToken, deleteFriendRequest);

// Friends
router.post('/friends/:friendId', verifyToken, addFriend);
router.delete('/friends/:friendId', verifyToken, deleteFriend);
router.get('/:userId/friends', verifyToken, getFriends);

// User
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);
router.get('/:userId', getUser);
router.get('/', getAllUsers);

export default router;
