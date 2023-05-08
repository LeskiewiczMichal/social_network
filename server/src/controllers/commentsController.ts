import mongoose from 'mongoose';
import { Request, Response } from 'express';
import {
  Comment,
  CommentInterface,
  Post,
  PostInterface,
  UserInterface,
} from '../models';
import { handleError, ERROR_MESSAGE } from '../utils';

// const handleCommentsError = (res: Response, error: any) => {};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = (await Comment.find({
      post: req.params.postId,
    })) as CommentInterface[];

    return res.json({ comments });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Post not found', 404);
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

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (comment.author.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.body.body) {
      comment.body = req.body.body;
    }

    await comment.save();
    return res.json({ message: 'Comment edited successfully', comment });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Comment not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (comment.author.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Comment.deleteOne({ comment });
    await Post.updateMany(
      { comments: comment.id },
      { $pull: { comments: comment.id } },
    );

    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Comment not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

export { addComment, getAllComments, updateComment, deleteComment };
