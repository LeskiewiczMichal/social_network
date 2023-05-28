import express from 'express';
import * as MessageController from '../controllers/messagesController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', MessageController.getMessages);

export default router;
