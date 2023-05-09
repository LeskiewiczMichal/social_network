import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { UserInterface } from '../models';

// Requests
interface GetUserByIdRequest extends Request {
  params: {
    userId: string;
  };
}

interface UpdateUserDataRequest extends Request {
  body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    birthday?: Date;
  };
}

interface GetFriendsRequest extends Request {
  params: {
    userId: string;
  };
}

interface AddFriendRequest extends Request {
  params: {
    friendId: string;
  };
}

interface DeleteFriendRequest extends Request {
  params: {
    friendId: string;
  };
}

interface RequestSendFriendRequest extends Request {
  params: {
    friendId: string;
  };
}

interface RequestDeleteFriendRequest extends Request {
  params: {
    friendId: string;
  };
}

type GetAllUsersResponse = Response<{ users: UserInterface[] }>;
type GetUserByIdResponse = Response<{ user: UserInterface }>;
type UpdateUserDataResponse = Response<{
  message: string;
  user: UserInterface;
}>;
type DeleteUserResponse = Response<{ message: string }>;
type GetFriendsResponse = Response<{ users: mongoose.Schema.Types.ObjectId[] }>;
type AddFriendResponse = Response<{ message: string; user: UserInterface }>;
type DeleteFriendResponse = Response<{ message: string; user: UserInterface }>;
type SendFriendRequestResponse = Response<{ message: string }>;
type GetFriendRequestsResponse = Response<{
  friendRequests: mongoose.Schema.Types.ObjectId[];
}>;
type DeleteFriendRequestResponse = Response<{
  message: string;
  user: UserInterface;
}>;

export {
  GetUserByIdRequest,
  UpdateUserDataRequest,
  GetFriendsRequest,
  AddFriendRequest,
  DeleteFriendRequest,
  RequestSendFriendRequest,
  RequestDeleteFriendRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserDataResponse,
  DeleteUserResponse,
  GetFriendsResponse,
  AddFriendResponse,
  DeleteFriendResponse,
  SendFriendRequestResponse,
  GetFriendRequestsResponse,
  DeleteFriendRequestResponse,
};
