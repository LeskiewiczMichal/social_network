import express from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/authController';
import { verifyToken, FileUploads } from '../middleware';

const router = express.Router();

router.post(
  '/',
  FileUploads.profilePicture.single('profilePicture'),
  AuthController.createAccount,
);
router.post('/login', AuthController.login);
router.get('/token', verifyToken, AuthController.authenticateUser);
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
router.get('/google/callback', AuthController.loginGoogle);

export default router;
