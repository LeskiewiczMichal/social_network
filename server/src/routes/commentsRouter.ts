import express from 'express';
import * as CommentsController from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/:postId', CommentsController.addComment);
router.get('/:postId', CommentsController.getComments);
router.put('/:commentId', CommentsController.updateComment);
router.delete('/:commentId', CommentsController.deleteComment);

export default router;
