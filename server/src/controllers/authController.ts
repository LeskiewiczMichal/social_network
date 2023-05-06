import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User, UserInterface } from '../models';
import { handleError } from '../utils';

const login = (req: Request, res: Response) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: any, user: UserInterface) => {
      try {
        if (err || !user) {
          return res.status(401).json({ error: 'Incorrect email or password' });
        }

        if (!process.env.SECRET) {
          throw new Error('Secret environment variable not defined');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
      } catch (error: any) {
        return handleError(res, 'Something went wrong on the server', 500);
      }
    },
  )(req, res);
};

const loginGoogle = (req: Request, res: Response) => {
  passport.authenticate(
    'google',
    { session: false },
    async (err: any, user: UserInterface) => {
      try {
        if (err || !user) {
          return res
            .status(404)
            .json({ error: "Couldn't find google account" });
        }

        if (!process.env.SECRET) {
          throw new Error('Secret environment variable not defined');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
      } catch (error: any) {
        return handleError(res, 'Something went wrong on the server', 500);
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
      friendRequests: [],
      birthday: req.body.birthday,
    });

    await user.save();
    return res.json({ user });
  } catch (error: any) {
    return handleError(res, 'Something went wrong on the server', 500);
  }
};

const authenticateUser = (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  res.json({ user });
};

export { createAccount, login, authenticateUser, loginGoogle };
