import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Comment, Post, PostInterface, UserInterface } from '../models';
import { handleError, ERROR_MESSAGE } from '../utils';

// const handleCommentsError = (res: Response, error: any) => {};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const post = (await Post.findById(req.params.postId).populate(
      'comments',
    )) as PostInterface;

    return res.json({ comments: post.comments });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Posts not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const addComment = async (req: Request, res: Response) => {
  if (!req.body.body) {
    return res
      .status(400)
      .json({ error: 'Not all neccessery fields were provided' });
  }

  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    const comment = new Comment({
      body: req.body.body,
      author: user.id,
      likes: [],
      post: post.id,
    });

    await comment.save();

    return res.json({ message: 'Comment successfully created', comment });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Post not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

export { addComment, getAllComments };
