import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User, UserInterface } from '../models';
import { handleError, ERROR_MESSAGE } from '../utils';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = (await User.find()) as UserInterface[];

    return res.json({ users });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'Users not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;

    res.json({ user });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const updateUserData = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  try {
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
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;
  try {
    await User.deleteOne({ _id: user.id });
    return res.json({ message: 'User deleted succesfully' });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const getFriends = async (req: Request, res: Response) => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;
    await user.populate('friends');

    return res.json({ users: user.friends });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const addFriend = async (req: Request, res: Response) => {
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
      return res
        .status(404)
        .json({ error: "User was not on friend's requests list" });
    }

    user.friends.push(newFriend.id);
    await user.save();

    return res.json({ message: 'Friend added successfully', user });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

const deleteFriend = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const friend = (await User.findById(req.params.friendId)) as UserInterface;

    if (!user.friends.includes(friend.id)) {
      return res.status(404).json({ error: "User's were not friends" });
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
    if (error instanceof mongoose.Error.CastError) {
      return handleError(res, 'User not found', 404);
    }
    return handleError(res, ERROR_MESSAGE, 500);
  }
};

export {
  updateUserData,
  deleteUser,
  getUser,
  getAllUsers,
  getFriends,
  addFriend,
  deleteFriend,
};
