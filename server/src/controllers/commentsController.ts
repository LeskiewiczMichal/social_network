import {
  Comment,
  CommentInterface,
  NotificationInterface,
  Post,
  PostInterface,
  User,
  UserInterface,
  Notification,
  NotificationTypes,
} from '../models';
import { CommentTypes, ErrorTypes } from '../types';
import { handleError } from '../utils';
import { getIO } from '../utils/socketInstance';

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
    const user = req.user as UserInterface;
    const post = (await Post.findById(postParamId)) as PostInterface;

    // Create comment
    const comment = new Comment({
      body,
      author: user.id,
      likes: [],
      post: post._id,
    });
    await comment.save();

    // Update post
    post.comments.push(comment._id);
    await post.save();

    const receiver = (await User.findById(post.author)) as UserInterface;

    // Create notification
    const newNotification: NotificationInterface = new Notification({
      receiver: receiver.id,
      sender: user.id,
      type: NotificationTypes.POST_COMMENTED,
    });
    await newNotification.save();
    // If post author is active emit notification
    if (receiver.socketId) {
      const io = getIO();
      if (io) {
        await newNotification.populate('sender');
        io.to(receiver.socketId).emit('new-notification', newNotification);
      }
    }

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
    const { like } = req.query;
    const { body } = req.body;
    const { id: userId } = req.user as UserInterface;
    const comment = (await Comment.findById(commentId)) as CommentInterface;

    if (like) {
      if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter(
          (id) => id.toString() !== userId.toString(),
        );
      } else {
        comment.likes.push(userId);

        const author = (await User.findById(comment.author)) as UserInterface;

        // Create notification
        const newNotification: NotificationInterface = new Notification({
          receiver: author.id,
          sender: userId,
          type: NotificationTypes.COMMENT_LIKED,
        });
        await newNotification.save();
        // If post author is active emit notification
        if (author.socketId) {
          const io = getIO();
          if (io) {
            await newNotification.populate('sender');
            io.to(author.socketId).emit('new-notification', newNotification);
          }
        }
      }
    }

    if (body) {
      if (comment.author.toString() !== userId.toString()) {
        throw new ErrorTypes.UnauthorizedError();
      }
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

export { addComment, getComments, updateComment, deleteComment };
