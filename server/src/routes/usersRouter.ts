import express from 'express';
import passport from 'passport';
import { login, createAccount } from '../controllers/usersController';

const router = express.Router();

router.post('/', createAccount);
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  login,
);

export default router;
