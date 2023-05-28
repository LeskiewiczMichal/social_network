import express from 'express';
import * as PostsController from '../controllers/postsController';
import { verifyToken, FileUploads } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.get('/:postId', PostsController.getPostById);
router.put('/:postId', PostsController.updatePost);
router.delete('/:postId', PostsController.deletePost);
router.get('/', PostsController.getPosts);
router.post(
  '/',
  FileUploads.postPhoto.single('photo'),
  PostsController.createPost,
);

export default router;
