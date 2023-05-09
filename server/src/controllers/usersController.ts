import { Request } from 'express';
import { User, UserInterface } from '../models';
import {
  BadRequestError,
  GetFriendsRequest,
  GetUserByIdRequest,
  UpdateUserDataRequest,
} from '../types';
import { handleError } from '../utils';
import {
  AddFriendRequest,
  DeleteFriendRequest,
  RequestDeleteFriendRequest,
  RequestSendFriendRequest,
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
} from '../types/users';
import { NotFoundError } from '../types/errors';

const getAllUsers = async (
  req: Request,
  res: GetAllUsersResponse,
): Promise<GetAllUsersResponse> => {
  try {
    const users = (await User.find()) as UserInterface[];

    return res.json({ users });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getUserById = async (
  req: GetUserByIdRequest,
  res: GetUserByIdResponse,
): Promise<GetUserByIdResponse> => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;

    return res.json({ user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const updateUserData = async (
  req: UpdateUserDataRequest,
  res: UpdateUserDataResponse,
): Promise<UpdateUserDataResponse> => {
  try {
    const user = req.user as UserInterface;

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }

    if (req.body.birthday) {
      user.birthday = req.body.birthday;
    }

    await user.save();
    return res.json({ message: 'Update successfull', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteUser = async (
  req: Request,
  res: DeleteUserResponse,
): Promise<DeleteUserResponse> => {
  try {
    const user = req.user as UserInterface;
    await User.deleteOne({ _id: user.id });
    return res.json({ message: 'User deleted succesfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriends = async (
  req: GetFriendsRequest,
  res: GetFriendsResponse,
): Promise<GetFriendsResponse> => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;
    await user.populate('friends');

    return res.json({ users: user.friends });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const addFriend = async (
  req: AddFriendRequest,
  res: AddFriendResponse,
): Promise<AddFriendResponse> => {
  try {
    const user = req.user as UserInterface;
    const newFriend = (await User.findById(
      req.params.friendId,
    )) as UserInterface;

    const friendIdIndex = user.friendRequests.indexOf(newFriend.id);
    if (friendIdIndex !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      user.friendRequests.splice(friendIdIndex, 1)[0];
    } else {
      throw new BadRequestError("User was not on friend's requests list");
    }

    user.friends.push(newFriend.id);
    await user.save();

    return res.json({ message: 'Friend added successfully', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteFriend = async (
  req: DeleteFriendRequest,
  res: DeleteFriendResponse,
): Promise<DeleteFriendResponse> => {
  try {
    const user = req.user as UserInterface;
    const friend = (await User.findById(req.params.friendId)) as UserInterface;

    if (!user.friends.includes(friend.id)) {
      throw new BadRequestError("User's were not friends");
    }

    user.friends = user.friends.filter(
      (id) => id.toString() !== friend.id.toString(),
    );
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== user.id.toString(),
    );
    await user.save();
    await friend.save();

    return res.json({ message: 'Friend deleted successfully', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const sendFriendRequest = async (
  req: RequestSendFriendRequest,
  res: SendFriendRequestResponse,
): Promise<SendFriendRequestResponse> => {
  try {
    const user = req.user as UserInterface;
    const friend = (await User.findById(req.params.friendId)) as UserInterface;

    if (friend.friendRequests.includes(user.id)) {
      throw new BadRequestError('Friend request was already sent');
    }

    friend.friendRequests.push(user.id);
    await friend.save();

    return res.json({ message: 'Friend request was sent successfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriendRequests = async (
  req: Request,
  res: GetFriendRequestsResponse,
): Promise<GetFriendRequestsResponse> => {
  try {
    const user = req.user as UserInterface;
    await user.populate('friendRequests');

    return res.json({ friendRequests: user.friendRequests });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteFriendRequest = async (
  req: RequestDeleteFriendRequest,
  res: DeleteFriendRequestResponse,
): Promise<DeleteFriendRequestResponse> => {
  try {
    const user = req.user as UserInterface;
    const friendRequest = (await User.findById(
      req.params.friendId,
    )) as UserInterface;

    if (!user.friendRequests.includes(friendRequest.id)) {
      throw new NotFoundError();
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendRequest.id.toString(),
    );

    await user.save();

    return res.json({ message: 'Friend request deleted', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

export {
  updateUserData,
  deleteUser,
  getUserById,
  getAllUsers,
  getFriends,
  addFriend,
  deleteFriend,
  sendFriendRequest,
  getFriendRequests,
  deleteFriendRequest,
};
