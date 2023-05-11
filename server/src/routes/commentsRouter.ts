import express from 'express';
import * as CommentsController from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/:postId', CommentsController.addComment);
router.get('/:postId', CommentsController.getAllComments);
router.post('/:commentId/likes', CommentsController.likeComment);
router.delete('/:commentId/likes', CommentsController.dislikeComment);
router.put('/:commentId', CommentsController.updateComment);
router.delete('/:commentId', CommentsController.deleteComment);

export default router;
