import express from 'express';
import {
  updateUserData,
  deleteUser,
  getUser,
  getAllUsers,
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);

export default router;
