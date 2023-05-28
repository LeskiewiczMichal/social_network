import { Request, Response } from 'express';
import { CommentInterface } from '../models';

// Requests
interface GetAllCommentsRequest extends Request {
  params: {
    postId: string;
  };
  query: {
    limit?: string;
    offset?: string;
    sortOrder?: 'asc' | 'desc';
  };
}

interface AddCommentRequest extends Request {
  body: {
    body: string;
  };
  params: {
    postId: string;
  };
}

interface UpdateCommentRequest extends Request {
  body: {
    body?: string;
  };
  query: {
    like?: string;
  };
  params: {
    commentId: string;
  };
}

interface DeleteCommentRequest extends Request {
  params: {
    commentId: string;
  };
}

interface LikeCommentRequest extends Request {
  params: {
    commentId: string;
  };
}

interface DislikeCommentRequest extends Request {
  params: {
    commentId: string;
  };
}

// Responses
type GetAllCommentsResponse = Response<{ comments: CommentInterface[] }>;
type AddCommentResponse = Response<{
  message: string;
  comment: CommentInterface;
}>;
type UpdateCommentResponse = Response<{
  message: string;
  comment: CommentInterface;
}>;
type DeleteCommentResponse = Response<{ message: string }>;
type LikeCommentResponse = Response<{ message: string }>;
type DislikeCommentResponse = Response<{ message: string }>;

export {
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
};
