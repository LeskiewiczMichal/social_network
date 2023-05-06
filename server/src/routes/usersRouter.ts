import express from 'express';
import {
  login,
  createAccount,
  authenticateUser,
} from '../controllers/usersController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.post('/', createAccount);
router.post('/login', login);
router.post('/authenticate', verifyToken, authenticateUser);

export default router;
