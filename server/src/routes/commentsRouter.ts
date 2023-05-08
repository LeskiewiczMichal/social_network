import express from 'express';
import {
  addComment,
  getAllComments,
  updateComment,
} from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/:postId', addComment);
router.get('/:postId', getAllComments);
router.put('/:commentId', updateComment);

export default router;
