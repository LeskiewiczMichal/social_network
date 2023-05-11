import express from 'express';
import * as PostsController from '../controllers/postsController';
import { verifyToken, FileUploads } from '../middleware';

const router = express.Router();

router.use(verifyToken);

router.post(
  '/upload-picture',
  FileUploads.profilePicture.single('photo'),
  PostsController.uploadPhoto,
);
router.post('/:postId/likes', PostsController.likePost);
router.delete('/:postId/likes', PostsController.unlikePost);
router.get('/:postId', PostsController.getPostById);
router.put('/:postId', PostsController.updatePost);
router.delete('/:postId', PostsController.deletePost);
router.get('/', PostsController.getPosts);
router.post('/', PostsController.createPost);

export default router;
