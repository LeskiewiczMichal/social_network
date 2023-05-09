import { Request } from 'express';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostByIdRequest,
  LikePostRequest,
  UnlikePostRequest,
  UpdatePostRequest,
  GetPostsResponse,
  GetPostByIdResponse,
  CreatePostResponse,
  UpdatePostResponse,
  DeletePostResponse,
  LikePostResponse,
  UnlikePostResponse,
  MissingBodyError,
  UnauthorizedError,
  BadRequestError,
} from '../types';
import { Comment, Post, PostInterface, UserInterface } from '../models';
import { handleError } from '../utils';

const getPosts = async (
  req: Request,
  res: GetPostsResponse,
): Promise<GetPostsResponse> => {
  try {
    const posts = (await Post.find()) as PostInterface[];

    return res.json({ posts });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getPostById = async (
  req: GetPostByIdRequest,
  res: GetPostByIdResponse,
): Promise<GetPostByIdResponse> => {
  try {
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    return res.json({ post });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const createPost = async (
  req: CreatePostRequest,
  res: CreatePostResponse,
): Promise<CreatePostResponse> => {
  try {
    const user = req.user as UserInterface;

    if (!req.body.title) {
      throw new MissingBodyError('title');
    } else if (!req.body.body) {
      throw new MissingBodyError('body');
    }

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

const updatePost = async (
  req: UpdatePostRequest,
  res: UpdatePostResponse,
): Promise<UpdatePostResponse> => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.author.toString() !== user.id.toString()) {
      throw new UnauthorizedError();
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

const deletePost = async (
  req: DeletePostRequest,
  res: DeletePostResponse,
): Promise<DeletePostResponse> => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.author.toString() !== user.id.toString()) {
      throw new UnauthorizedError();
    }

    await Comment.deleteMany({ post: req.params.postId });
    await Post.deleteOne({ _id: req.params.postId });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const likePost = async (
  req: LikePostRequest,
  res: LikePostResponse,
): Promise<LikePostResponse> => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (post.likes.includes(user.id)) {
      throw new BadRequestError('Post is already liked');
    }

    post.likes.push(user.id);
    await post.save();

    return res.json({ message: 'Post liked successfully' });
  } catch (error) {
    return handleError(error, res);
  }
};

const unlikePost = async (
  req: UnlikePostRequest,
  res: UnlikePostResponse,
): Promise<UnlikePostResponse> => {
  try {
    const user = req.user as UserInterface;
    const post = (await Post.findById(req.params.postId)) as PostInterface;

    if (!post.likes.includes(user.id)) {
      throw new BadRequestError('Post is not liked');
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
