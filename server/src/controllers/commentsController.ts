import {
  Comment,
  CommentInterface,
  Post,
  PostInterface,
  UserInterface,
} from '../models';
import { CommentTypes, ErrorTypes } from '../types';
import { handleError } from '../utils';

const getComments = async (
  req: CommentTypes.GetAllCommentsRequest,
  res: CommentTypes.GetAllCommentsResponse,
): Promise<CommentTypes.GetAllCommentsResponse> => {
  try {
    const { postId } = req.params;
    const { limit, offset, sortOrder } = req.query;
    const dbQuery = Comment.find().where('post', postId);

    if (limit) {
      dbQuery.limit(parseInt(limit as string, 10));
    }
    if (offset) {
      dbQuery.skip(parseInt(offset as string, 10));
    }
    if (sortOrder) {
      dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
    }
    dbQuery.populate('author');

    const comments: CommentInterface[] =
      (await dbQuery.exec()) as CommentInterface[];

    return res.json({ comments });
  } catch (error) {
    return handleError(error, res);
  }
};

const addComment = async (
  req: CommentTypes.AddCommentRequest,
  res: CommentTypes.AddCommentResponse,
): Promise<CommentTypes.AddCommentResponse> => {
  try {
    const { body } = req.body;
    const { postId: postParamId } = req.params;
    if (!body) {
      throw new ErrorTypes.MissingBodyError('body');
    }
    const { id: userId } = req.user as UserInterface;
    const post = (await Post.findById(postParamId)) as PostInterface;

    // Create comment
    const comment = new Comment({
      body,
      author: userId,
      likes: [],
      post: post._id,
    });
    await comment.save();

    // Update post
    post.comments.push(comment._id);
    await post.save();

    await comment.populate('author');
    return res.json({ message: 'Comment successfully created', comment });
  } catch (error) {
    return handleError(error, res);
  }
};

const updateComment = async (
  req: CommentTypes.UpdateCommentRequest,
  res: CommentTypes.UpdateCommentResponse,
): Promise<CommentTypes.UpdateCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.author.toString() !== userId.toString()) {
      throw new ErrorTypes.UnauthorizedError();
    }

    if (body) {
      comment.body = body;
    }

    await comment.save();
    return res.json({ message: 'Comment edited successfully', comment });
  } catch (error) {
    return handleError(error, res);
  }
};

const deleteComment = async (
  req: CommentTypes.DeleteCommentRequest,
  res: CommentTypes.DeleteCommentResponse,
): Promise<CommentTypes.DeleteCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.author.toString() !== userId.toString()) {
      throw new ErrorTypes.UnauthorizedError();
    }

    await Comment.deleteOne({ comment });
    await Post.updateMany(
      { comments: comment.id },
      { $pull: { comments: comment.id } },
    );

    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const likeComment = async (
  req: CommentTypes.LikeCommentRequest,
  res: CommentTypes.LikeCommentResponse,
): Promise<CommentTypes.LikeCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.likes.includes(userId)) {
      throw new ErrorTypes.BadRequestError('Comment is already liked');
    }

    comment.likes.push(userId);
    await comment.save();

    return res.json({ message: 'Comment liked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const dislikeComment = async (
  req: CommentTypes.DislikeCommentRequest,
  res: CommentTypes.DislikeCommentResponse,
): Promise<CommentTypes.DislikeCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (!comment.likes.includes(userId)) {
      throw new ErrorTypes.BadRequestError("Comment isn't liked");
    }

    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString(),
    );
    await comment.save();

    return res.json({ message: 'Comment unliked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

export {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
};
