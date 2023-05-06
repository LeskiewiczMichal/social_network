import express from 'express';
import passport from 'passport';
import {
  login,
  loginGoogle,
  createAccount,
  authenticateUser,
} from '../controllers/authController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.post('/', createAccount);
router.post('/login', login);
router.get('/token', verifyToken, authenticateUser);
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
router.get('/google/callback', loginGoogle);

export default router;
