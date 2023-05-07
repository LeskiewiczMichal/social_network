import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Post, PostInterface, UserInterface } from '../models';
import { handleError, ERROR_MESSAGE } from '../utils';

const handlePostsError = (res: Response, error: any) => {
  if (error instanceof mongoose.Error.CastError) {
    return handleError(res, 'Post not found', 404);
  }
  return handleError(res, ERROR_MESSAGE, 500);
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = (await Post.find()) as PostInterface[];

    return res.json({ posts });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    return res.json({ post });
  } catch (error: any) {
    return handlePostsError(res, error);
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
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

export { createPost, getPosts, getPostById };
