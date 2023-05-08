import express from 'express';
import {
  addComment,
  deleteComment,
  getAllComments,
  updateComment,
  likeComment,
  dislikeComment,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/:postId', addComment);
router.get('/:postId', getAllComments);
router.post('/:commentId/likes', likeComment);
router.delete('/:commentId/likes', dislikeComment);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
