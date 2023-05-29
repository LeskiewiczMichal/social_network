import { Request, Response } from 'express';
import {
  User,
  UserInterface,
  UserInterfaceWithFriendRequests,
} from '../models';
import { ErrorTypes, UserTypes } from '../types';
import { handleError } from '../utils';

const getUsers = async (
  req: UserTypes.GetUsersRequest,
  res: UserTypes.GetUsersResponse,
): Promise<UserTypes.GetUsersResponse> => {
  try {
    const { usersList, limit, friendRequests } = req.query;
    const dbQuery = User.find();

    if (limit) {
      dbQuery.limit(parseInt(limit as string, 10));
    }
    if (usersList) {
      const usersArray = Array.isArray(usersList) ? usersList : [usersList];
      dbQuery.where('_id').in(usersArray);
    }
    if (friendRequests) {
      dbQuery.select('+friendRequests');
      const users: UserInterfaceWithFriendRequests[] =
        (await dbQuery.exec()) as UserInterfaceWithFriendRequests[];

      return res.json({ users });
    }

    const users: UserInterface[] = (await dbQuery.exec()) as UserInterface[];
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
    const user = req.user as UserInterfaceWithFriendRequests;
    const { removeFriend, removeFriendRequest } = req.query;
    const { email, firstName, lastName, birthday } = req.body;

    if (removeFriendRequest) {
      const { id: friendRequestId } = (await User.findById(
        removeFriendRequest,
      )) as UserInterface;

      if (!user.friendRequests.includes(friendRequestId)) {
        throw new ErrorTypes.BadRequestError(
          'User was not on friend requests list',
        );
      }

      user.friendRequests = user.friendRequests.filter(
        (id) => id.toString() !== friendRequestId.toString(),
      );
    }
    if (removeFriend) {
      const friend = (await User.findById(removeFriend)) as UserInterface;

      if (!user.friends.includes(friend.id)) {
        throw new ErrorTypes.BadRequestError("User's were not friends");
      }

      user.friends = user.friends.filter(
        (id) => id.toString() !== friend.id.toString(),
      );
      friend.friends = friend.friends.filter(
        (id) => id.toString() !== user.id.toString(),
      );
      await friend.save();
    }
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
    const user = req.user as UserInterfaceWithFriendRequests;
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

    return res.json({ message: 'Friend added successfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const uploadProfilePic = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const { file } = req;

    if (!file) {
      throw new ErrorTypes.NotFoundError();
    }

    const pictureUrl = `/photos/profilePictures/${file.filename}`;
    user.profilePicture = pictureUrl;
    await user.save();

    return res.json({ message: 'Profile picture updated successfully', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

export {
  updateUserData,
  deleteUser,
  getUserById,
  getUsers,
  getFriends,
  addFriend,
  uploadProfilePic,
};
