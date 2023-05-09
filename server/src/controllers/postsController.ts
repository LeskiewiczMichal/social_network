import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Comment, Post, PostInterface, UserInterface } from '../models';
import { handleError } from '../utils';

const handlePostsError = (res: Response, error: any) => {
  if (error instanceof mongoose.Error.CastError) {
    return handleError(error, res);
  }
  return handleError(error, res);
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = (await Post.find()) as PostInterface[];

    return res.json({ posts });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    return res.json({ post });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const createPost = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  if (!req.body.title || !req.body.body) {
    return res
      .status(400)
      .json({ error: 'Not all neccessery fields were provided' });
  }

  try {
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: user.id,
      comments: [],
      likes: [],
    });

    await post.save();
    return res.json({ message: 'Post successfully created', post });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.author.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.body) {
      post.body = req.body.body;
    }

    await post.save();
    return res.json({ post });
  } catch (error) {
    return handleError(error, res);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.author.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Comment.deleteMany({ post: req.params.postId });
    await Post.deleteOne({ _id: req.params.postId });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const likePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.likes.includes(user.id)) {
      return res.status(400).json({ error: 'Post is already liked' });
    }

    post.likes.push(user.id);
    await post.save();

    return res.json({ message: 'Post liked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const unlikePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (!post.likes.includes(user.id)) {
      return res.status(400).json({ error: 'Post is not liked' });
    }

    post.likes = post.likes.filter(
      (id) => id.toString() !== user.id.toString(),
    );
    await post.save();

    return res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};
