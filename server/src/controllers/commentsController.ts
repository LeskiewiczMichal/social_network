import {
  Comment,
  CommentInterface,
  Post,
  PostInterface,
  UserInterface,
} from '../models';
import {
  GetAllCommentsRequest,
  AddCommentRequest,
  UpdateCommentRequest,
  DeleteCommentRequest,
  LikeCommentRequest,
  DislikeCommentRequest,
  GetAllCommentsResponse,
  AddCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
  LikeCommentResponse,
  DislikeCommentResponse,
} from '../types/comments';
import {
  BadRequestError,
  MissingBodyError,
  UnauthorizedError,
} from '../types/errors';
import { handleCommentsError } from './controllersUtils';

const getAllComments = async (
  req: GetAllCommentsRequest,
  res: GetAllCommentsResponse,
): Promise<GetAllCommentsResponse> => {
  try {
    const comments: CommentInterface[] = (await Comment.find({
      post: req.params.postId,
    })) as CommentInterface[];

    return res.json({ comments });
  } catch (error) {
    return handleCommentsError(error, res);
  }
};

const addComment = async (
  req: AddCommentRequest,
  res: AddCommentResponse,
): Promise<AddCommentResponse> => {
  try {
    if (!req.body.body) {
      throw new MissingBodyError('body');
    }
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
    return handleCommentsError(error, res);
  }
};

const updateComment = async (
  req: UpdateCommentRequest,
  res: UpdateCommentResponse,
): Promise<UpdateCommentResponse> => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (comment.author.toString() !== user.id.toString()) {
      throw new UnauthorizedError();
    }

    if (req.body.body) {
      comment.body = req.body.body;
    }

    await comment.save();
    return res.json({ message: 'Comment edited successfully', comment });
  } catch (error) {
    return handleCommentsError(error, res);
  }
};

const deleteComment = async (
  req: DeleteCommentRequest,
  res: DeleteCommentResponse,
): Promise<DeleteCommentResponse> => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (comment.author.toString() !== user.id.toString()) {
      throw new UnauthorizedError();
    }

    await Comment.deleteOne({ comment });
    await Post.updateMany(
      { comments: comment.id },
      { $pull: { comments: comment.id } },
    );

    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return handleCommentsError(error, res);
  }
};

const likeComment = async (
  req: LikeCommentRequest,
  res: LikeCommentResponse,
): Promise<LikeCommentResponse> => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (comment.likes.includes(user.id)) {
      throw new BadRequestError('Comment is already liked');
    }

    comment.likes.push(user.id);
    await comment.save();

    return res.json({ message: 'Comment liked successfully' });
  } catch (error) {
    return handleCommentsError(error, res);
  }
};

const dislikeComment = async (
  req: DislikeCommentRequest,
  res: DislikeCommentResponse,
): Promise<DislikeCommentResponse> => {
  try {
    const user = req.user as UserInterface;
    const comment = (await Comment.findById(
      req.params.commentId,
    )) as CommentInterface;

    if (!comment.likes.includes(user.id)) {
      throw new BadRequestError("Comment isn't liked");
    }

    comment.likes = comment.likes.filter(
      (id) => id.toString() !== user.id.toString(),
    );
    await comment.save();

    return res.json({ message: 'Comment unliked successfully' });
  } catch (error) {
    return handleCommentsError(error, res);
  }
};

export {
  addComment,
  getAllComments,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
};
