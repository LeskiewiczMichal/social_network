import { Request, Response } from 'express';
import { PostInterface } from '../models';

// Requests
interface GetPostByIdRequest extends Request {
  params: {
    postId: string;
  };
}

interface CreatePostRequest extends Request {
  body: {
    title: string;
    body: string;
  };
}

interface UpdatePostRequest extends Request {
  params: {
    postId: string;
  };
  body: {
    title?: string;
    body?: string;
  };
}

interface DeletePostRequest extends Request {
  params: {
    postId: string;
  };
}

interface LikePostRequest extends Request {
  params: {
    postId: string;
  };
}

interface UnlikePostRequest extends Request {
  params: {
    postId: string;
  };
}

// Responses
type GetPostsResponse = Response<{ posts: PostInterface[] }>;
type GetPostByIdResponse = Response<{ post: PostInterface }>;
type CreatePostResponse = Response<{ message: string; post: PostInterface }>;
type UpdatePostResponse = Response<{ post: PostInterface }>;
type DeletePostResponse = Response<{ message: string }>;
type LikePostResponse = Response<{ message: string }>;
type UnlikePostResponse = Response<{ message: string }>;

export {
  GetPostByIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
  DeletePostRequest,
  LikePostRequest,
  UnlikePostRequest,
  GetPostsResponse,
  GetPostByIdResponse,
  CreatePostResponse,
  UpdatePostResponse,
  DeletePostResponse,
  LikePostResponse,
  UnlikePostResponse,
};
