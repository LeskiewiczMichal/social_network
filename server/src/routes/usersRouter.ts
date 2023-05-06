import express from 'express';
import {
  login,
  createAccount,
  authenticateUser,
  updateUserData,
  deleteUser,
  getUser,
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.get('/:userId', getUser);
router.post('/', createAccount);
router.post('/login', login);
router.post('/authenticate', verifyToken, authenticateUser);
router.put('/', verifyToken, updateUserData);
router.delete('/', verifyToken, deleteUser);

export default router;
