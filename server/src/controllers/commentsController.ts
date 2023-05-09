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
  BadRequestError,
  MissingBodyError,
  UnauthorizedError,
} from '../types';
import { handleError } from '../utils';

const getAllComments = async (
  req: GetAllCommentsRequest,
  res: GetAllCommentsResponse,
): Promise<GetAllCommentsResponse> => {
  try {
    const { postId } = req.params;
    const comments: CommentInterface[] = (await Comment.find({
      post: postId,
    })) as CommentInterface[];

    return res.json({ comments });
  } catch (error) {
    return handleError(error, res);
  }
};

const addComment = async (
  req: AddCommentRequest,
  res: AddCommentResponse,
): Promise<AddCommentResponse> => {
  try {
    const { body } = req.body;
    const { postId: postParamId } = req.params;
    if (!body) {
      throw new MissingBodyError('body');
    }
    const { id: userId } = req.user as UserInterface;
    const { id: postId } = (await Post.findById(postParamId)) as PostInterface;

    const comment = new Comment({
      body,
      author: userId,
      likes: [],
      post: postId,
    });

    await comment.save();

    return res.json({ message: 'Comment successfully created', comment });
  } catch (error) {
    return handleError(error, res);
  }
};

const updateComment = async (
  req: UpdateCommentRequest,
  res: UpdateCommentResponse,
): Promise<UpdateCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { body } = req.body;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.author.toString() !== userId.toString()) {
      throw new UnauthorizedError();
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
  req: DeleteCommentRequest,
  res: DeleteCommentResponse,
): Promise<DeleteCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.author.toString() !== userId.toString()) {
      throw new UnauthorizedError();
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
  req: LikeCommentRequest,
  res: LikeCommentResponse,
): Promise<LikeCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (comment.likes.includes(userId)) {
      throw new BadRequestError('Comment is already liked');
    }

    comment.likes.push(userId);
    await comment.save();

    return res.json({ message: 'Comment liked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const dislikeComment = async (
  req: DislikeCommentRequest,
  res: DislikeCommentResponse,
): Promise<DislikeCommentResponse> => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (!comment.likes.includes(userId)) {
      throw new BadRequestError("Comment isn't liked");
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
  getAllComments,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
};
