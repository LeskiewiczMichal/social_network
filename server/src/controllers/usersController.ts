import { Request, Response } from 'express';
import { User, UserInterface } from '../models';

const getUser = async (req: Request, res: Response) => {
  try {
    const user = User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    return res.json({ error: error.message });
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
    return res.json({ error: error.message });
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
    return res.json({ error: error.message });
  }
};

export { updateUserData, deleteUser, getUser };
