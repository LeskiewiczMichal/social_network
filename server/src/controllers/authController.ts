import { Request } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestError,
  CreateAccountRequest,
  LoginGoogleResponse,
  LoginRequest,
  LoginResponse,
  CreateAccountResponse,
  MissingBodyError,
  AuthenticateUserResponse,
} from '../types';
import { User, UserInterface } from '../models';
import { handleError } from '../utils';

const login = (req: LoginRequest, res: LoginResponse): void => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: any, user: UserInterface): Promise<LoginResponse> => {
      try {
        if (err || !user) {
          throw new BadRequestError('Incorrect email or password');
        }

        if (!process.env.SECRET) {
          throw new BadRequestError('Secret environment variable not defined');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
      } catch (error: any) {
        return handleError(error, res);
      }
    },
  )(req, res);
};

const loginGoogle = (req: Request, res: LoginGoogleResponse): void => {
  passport.authenticate(
    'google',
    { session: false },
    async (err: any, user: UserInterface): Promise<LoginGoogleResponse> => {
      try {
        if (err || !user) {
          throw new BadRequestError("Couldn't find google account");
        }

        if (!process.env.SECRET) {
          throw new Error('Secret environment variable not defined');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
      } catch (error: any) {
        return handleError(error, res);
      }
    },
  )(req, res);
};

const createAccount = async (
  req: CreateAccountRequest,
  res: CreateAccountResponse,
): Promise<CreateAccountResponse> => {
  try {
    const { email, password, birthday, firstName, lastName } = req.body;

    if (!email) {
      throw new MissingBodyError('email');
    }
    if (!password) {
      throw new MissingBodyError('password');
    }
    if (!birthday) {
      throw new MissingBodyError('birthday');
    }
    if (!firstName) {
      throw new MissingBodyError('firstName');
    }
    if (!lastName) {
      throw new MissingBodyError('lastName');
    }
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      password: hash,
      email,
      firends: [],
      friendRequests: [],
      birthday,
    });

    await user.save();
    return res.json({ user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const authenticateUser = (
  req: Request,
  res: AuthenticateUserResponse,
): AuthenticateUserResponse => {
  const user = req.user as UserInterface;

  return res.json({ user });
};

export { createAccount, login, authenticateUser, loginGoogle };
