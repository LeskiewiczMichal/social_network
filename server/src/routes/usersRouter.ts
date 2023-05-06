import express from 'express';
import {
  updateUserData,
  deleteUser,
  getUser,
  getAllUsers,
  getFriends,
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);
router.get('/:userId/friends', verifyToken, getFriends);

export default router;
