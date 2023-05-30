import { Request, Response } from 'express';
import { PostTypes, ErrorTypes } from '../types';
import { Comment, Post, PostInterface, UserInterface } from '../models';
import { handleError } from '../utils';

const getPosts = async (
  req: PostTypes.GetPostsRequest,
  res: PostTypes.GetPostsResponse,
): Promise<PostTypes.GetPostsResponse> => {
  try {
    const user = req.user as UserInterface;
    const { sortOrder, limit, offset, author, inFriends } = req.query;
    const dbQuery = Post.find();

    if (limit) {
      dbQuery.limit(parseInt(limit as string, 10));
    }
    if (offset) {
      dbQuery.skip(parseInt(offset as string, 10));
    }
    if (author) {
      dbQuery.where('author', author);
    }
    if (inFriends === 'true') {
      dbQuery.where('author').in(user.friends);
    }
    if (sortOrder) {
      dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
    }
    dbQuery.populate('author');

    const posts: PostInterface[] = (await dbQuery.exec()) as PostInterface[];

    return res.json({ posts });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getPostById = async (
  req: PostTypes.GetPostByIdRequest,
  res: PostTypes.GetPostByIdResponse,
): Promise<PostTypes.GetPostByIdResponse> => {
  try {
    const { postId } = req.params;
    const post = (await Post.findById(postId)) as PostInterface;

    return res.json({ post });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const createPost = async (
  req: PostTypes.CreatePostRequest,
  res: PostTypes.CreatePostResponse,
): Promise<PostTypes.CreatePostResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { body, title } = req.body;
    const { file } = req;

    if (!title) {
      throw new ErrorTypes.MissingBodyError('title');
    } else if (!body) {
      throw new ErrorTypes.MissingBodyError('body');
    }

    const post = new Post({
      title,
      body,
      author: userId,
      comments: [],
      likes: [],
    });

    // Add path to photo if it was uploaded
    if (file) {
      const photoUrl = `/photos/posts/${file.filename}`;
      post.photo = photoUrl;
    }

    await post.save();
    return res.json({ message: 'Post successfully created', post });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const updatePost = async (
  req: PostTypes.UpdatePostRequest,
  res: PostTypes.UpdatePostResponse,
): Promise<PostTypes.UpdatePostResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { title, body } = req.body;
    const { like } = req.query;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    // If user is not author, can't change some elemnets
    if (title || body) {
      if (post.author.toString() !== userId.toString()) {
        throw new ErrorTypes.UnauthorizedError();
      }
    }

    if (like) {
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId.toString(),
        );
      } else {
        post.likes.push(userId);
      }
    }

    if (title) {
      post.title = title;
    }
    if (body) {
      post.body = body;
    }

    await post.save();
    return res.json({ post });
  } catch (error) {
    return handleError(error, res);
  }
};

const deletePost = async (
  req: PostTypes.DeletePostRequest,
  res: PostTypes.DeletePostResponse,
): Promise<PostTypes.DeletePostResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { postId } = req.params;
    const post = (await Post.findById(postId)) as PostInterface;

    if (post.author.toString() !== userId.toString()) {
      throw new ErrorTypes.UnauthorizedError();
    }

    await Comment.deleteMany({ post: postId });
    await Post.deleteOne({ _id: postId });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const { file } = req;

    if (!file) {
      throw new ErrorTypes.NotFoundError();
    }

    const photoUrl = `/photos/photos/${file.filename}`;

    return res.json({ message: 'Photo updated successfully', url: photoUrl });
  } catch (error: any) {
    return handleError(error, res);
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  uploadPhoto,
};
