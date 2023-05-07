import express from 'express';
import { createPost, getPosts } from '../controllers/postsController';
import { verifyToken } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/', getPosts);
router.post('/', createPost);

export default router;
