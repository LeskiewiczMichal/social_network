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
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.get('/friendRequests', verifyToken, getFriendRequests);
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);
router.get('/:userId/friends', verifyToken, getFriends);
router.post('/friends/:friendId', verifyToken, addFriend);
router.delete('/friends/:friendId', verifyToken, deleteFriend);
router.post('/friendRequests/:userId', verifyToken, sendFriendRequest);

export default router;
