import express from 'express';
import {
  addComment,
  deleteComment,
  getAllComments,
  updateComment,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/:postId', addComment);
router.get('/:postId', getAllComments);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);

export default router;
