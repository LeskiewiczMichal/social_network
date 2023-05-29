import express from 'express';
import * as NotificationsController from '../controllers/notificationsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', NotificationsController.getNotifications);

export default router;
