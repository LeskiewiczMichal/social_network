import { Request, Response } from 'express';
import { User, UserInterface } from '../models';
import { ErrorTypes, UserTypes } from '../types';
import { handleError } from '../utils';
import { NotFoundError } from '../types/errors';

const getAllUsers = async (
  req: Request,
  res: UserTypes.GetAllUsersResponse,
): Promise<UserTypes.GetAllUsersResponse> => {
  try {
    const users = (await User.find()) as UserInterface[];

    return res.json({ users });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getUserById = async (
  req: UserTypes.GetUserByIdRequest,
  res: UserTypes.GetUserByIdResponse,
): Promise<UserTypes.GetUserByIdResponse> => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;

    return res.json({ user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const updateUserData = async (
  req: UserTypes.UpdateUserDataRequest,
  res: UserTypes.UpdateUserDataResponse,
): Promise<UserTypes.UpdateUserDataResponse> => {
  try {
    const user = req.user as UserInterface;
    const { email, firstName, lastName, birthday } = req.body;

    if (email) {
      user.email = email;
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (birthday) {
      user.birthday = birthday;
    }

    await user.save();
    return res.json({ message: 'Update successfull', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteUser = async (
  req: Request,
  res: UserTypes.DeleteUserResponse,
): Promise<UserTypes.DeleteUserResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    await User.deleteOne({ _id: userId });
    return res.json({ message: 'User deleted succesfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriends = async (
  req: UserTypes.GetFriendsRequest,
  res: UserTypes.GetFriendsResponse,
): Promise<UserTypes.GetFriendsResponse> => {
  try {
    const { userId } = req.params;
    const user = (await User.findById(userId)) as UserInterface;
    await user.populate('friends');

    return res.json({ users: user.friends });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const addFriend = async (
  req: UserTypes.AddFriendRequest,
  res: UserTypes.AddFriendResponse,
): Promise<UserTypes.AddFriendResponse> => {
  try {
    const { friendId } = req.params;
    const user = req.user as UserInterface;
    const { id: newFriendId } = (await User.findById(
      friendId,
    )) as UserInterface;

    const friendIdIndex = user.friendRequests.indexOf(newFriendId);
    if (friendIdIndex !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      user.friendRequests.splice(friendIdIndex, 1)[0];
    } else {
      throw new ErrorTypes.BadRequestError(
        "User was not on friend's requests list",
      );
    }

    user.friends.push(newFriendId);
    await user.save();

    return res.json({ message: 'Friend added successfully', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteFriend = async (
  req: UserTypes.DeleteFriendRequest,
  res: UserTypes.DeleteFriendResponse,
): Promise<UserTypes.DeleteFriendResponse> => {
  try {
    const user = req.user as UserInterface;
    const { friendId } = req.params;
    const friend = (await User.findById(friendId)) as UserInterface;

    if (!user.friends.includes(friend.id)) {
      throw new ErrorTypes.BadRequestError("User's were not friends");
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
  req: UserTypes.RequestSendFriendRequest,
  res: UserTypes.SendFriendRequestResponse,
): Promise<UserTypes.SendFriendRequestResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { friendId } = req.params;
    const friend = (await User.findById(friendId)) as UserInterface;

    if (friend.friendRequests.includes(userId)) {
      throw new ErrorTypes.BadRequestError('Friend request was already sent');
    }

    friend.friendRequests.push(userId);
    await friend.save();

    return res.json({ message: 'Friend request was sent successfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriendRequests = async (
  req: Request,
  res: UserTypes.GetFriendRequestsResponse,
): Promise<UserTypes.GetFriendRequestsResponse> => {
  try {
    const user = req.user as UserInterface;
    await user.populate('friendRequests');

    return res.json({ friendRequests: user.friendRequests });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteFriendRequest = async (
  req: UserTypes.RequestDeleteFriendRequest,
  res: UserTypes.DeleteFriendRequestResponse,
): Promise<UserTypes.DeleteFriendRequestResponse> => {
  try {
    const user = req.user as UserInterface;
    const { friendId } = req.params;
    const { id: friendRequestId } = (await User.findById(
      friendId,
    )) as UserInterface;

    if (!user.friendRequests.includes(friendRequestId)) {
      throw new NotFoundError();
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== friendRequestId.toString(),
    );

    await user.save();

    return res.json({ message: 'Friend request deleted', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const uploadProfilePic = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const { file } = req;

    if (!file) {
      throw new NotFoundError();
    }

    const pictureUrl = `/profile-pictures/${file.filename}`;
    user.profilePicture = pictureUrl;
    await user.save();

    return res.json({ message: 'Profile picture updated correctly', user });
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
  uploadProfilePic,
};
