import { Request, Response } from 'express';
import { User, UserInterface } from '../models';
import { handleError } from '../utils';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ error: 'Users not found' });
    }

    return res.json({ users });
  } catch (error: any) {
    return handleError(res, 'Something went wrong on the server', 500);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    return handleError(res, 'Something went wrong on the server', 500);
  }
};

const updateUserData = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
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
    return handleError(res, 'Something went wrong on the server', 500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    await User.deleteOne({ _id: user.id });
    return res.json({ message: 'User deleted succesfully' });
  } catch (error: any) {
    return handleError(res, 'Something went wrong on the server', 500);
  }
};

export { updateUserData, deleteUser, getUser, getAllUsers };
