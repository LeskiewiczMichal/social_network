import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
} from '../controllers/postsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/:postId', getPostById);
router.get('/', getPosts);
router.post('/', createPost);

export default router;
