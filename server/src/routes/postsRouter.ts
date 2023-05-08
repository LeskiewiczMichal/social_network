import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from '../controllers/postsController';
import { addComment, getAllComments } from '../controllers/commentsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

// Comments
router.post('/:postId/comments/', addComment);
router.get('/:postId/comments/', getAllComments);

// Posts
router.post('/:postId/likes', likePost);
router.delete('/:postId/likes', unlikePost);
router.get('/:postId', getPostById);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.get('/', getPosts);
router.post('/', createPost);

export default router;
