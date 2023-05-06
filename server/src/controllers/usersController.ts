import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User, UserInterface } from '../models';

const login = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!process.env.SECRET) {
      throw new Error('Secret environment variable not defined');
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET);
    return res.json({ user, token });
  } catch (error: any) {
    return res.json({ error: error.message });
  }
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

export { createAccount, login };
