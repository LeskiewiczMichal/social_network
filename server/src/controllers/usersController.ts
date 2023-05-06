import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
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

const login = (req: Request, res: Response) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: any, user: UserInterface) => {
      try {
        if (err || !user) {
          return res.status(400).json({ error: 'Incorrect email or password' });
        }

        if (!process.env.SECRET) {
          throw new Error('Secret environment variable not defined');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
      } catch (error: any) {
        return res.json({ error: error.message });
      }
    },
  )(req, res);
};

const createAccount = async (req: Request, res: Response) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.birthday ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res
      .status(400)
      .json({ error: 'Not all neccessery fields were provided' });
  }

  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      email: req.body.email,
      firends: [],
      posts: [],
      friendRequests: [],
      birthday: req.body.birthday,
    });

    await user.save();
    return res.json({ user });
  } catch (error: any) {
    return res.json({ error: error.message });
  }
};

const authenticateUser = (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  res.json({ user });
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

export {
  createAccount,
  login,
  authenticateUser,
  updateUserData,
  deleteUser,
  getUser,
};
