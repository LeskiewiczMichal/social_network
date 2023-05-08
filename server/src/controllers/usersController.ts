import { Request, Response } from 'express';
import { User, UserInterface } from '../models';
import { handleError } from '../utils';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = (await User.find()) as UserInterface[];

    return res.json({ users });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;

    res.json({ user });
  } catch (error: any) {
    return handleError(error, res);
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
    return handleError(error, res);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;
  try {
    await User.deleteOne({ _id: user.id });
    return res.json({ message: 'User deleted succesfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriends = async (req: Request, res: Response) => {
  try {
    const user = (await User.findById(req.params.userId)) as UserInterface;
    await user.populate('friends');

    return res.json({ users: user.friends });
  } catch (error: any) {
    return handleError(error, res);
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
    return handleError(error, res);
  }
};

const deleteFriend = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const friend = (await User.findById(req.params.friendId)) as UserInterface;

    if (!user.friends.includes(friend.id)) {
      return res.status(400).json({ error: "User's were not friends" });
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

const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const friend = (await User.findById(req.params.userId)) as UserInterface;

    if (friend.friendRequests.includes(user.id)) {
      return res.status(400).json({ error: 'Friend request was already sent' });
    }

    friend.friendRequests.push(user.id);
    await friend.save();

    return res.json({ message: 'Friend request was sent successfully' });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    await user.populate('friendRequests');

    return res.json({ friendRequests: user.friendRequests });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const deleteFriendRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const friendRequest = (await User.findById(
      req.params.userId,
    )) as UserInterface;

    if (!user.friendRequests.includes(friendRequest.id)) {
      return res.status(404).json({ error: 'Friend request not found' });
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
  getUser,
  getAllUsers,
  getFriends,
  addFriend,
  deleteFriend,
  sendFriendRequest,
  getFriendRequests,
  deleteFriendRequest,
};
