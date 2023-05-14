import { Request } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthTypes, ErrorTypes } from '../types';
import { User, UserInterface } from '../models';
import { handleError } from '../utils';

const login = (
  req: AuthTypes.LoginRequest,
  res: AuthTypes.LoginResponse,
): void => {
  passport.authenticate(
    'local',
    { session: false },
    async (err: any, user: UserInterface): Promise<AuthTypes.LoginResponse> => {
      try {
        if (err || !user) {
          throw new ErrorTypes.BadRequestError('Incorrect email or password');
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

const loginGoogle = (
  req: Request,
  res: AuthTypes.LoginGoogleResponse,
): void => {
  passport.authenticate(
    'google',
    { session: false },
    async (
      err: any,
      user: UserInterface,
    ): Promise<AuthTypes.LoginGoogleResponse> => {
      try {
        if (err || !user) {
          throw new ErrorTypes.BadRequestError("Couldn't find google account");
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
  req: AuthTypes.CreateAccountRequest,
  res: AuthTypes.CreateAccountResponse,
): Promise<AuthTypes.CreateAccountResponse> => {
  try {
    const {
      email,
      password,
      birthday,
      firstName,
      lastName,
      country,
      city,
      postalCode,
      about,
    } = req.body;
    const { file } = req;


    if (!email) {
      throw new ErrorTypes.MissingBodyError('email');
    }
    if (!password) {
      throw new ErrorTypes.MissingBodyError('password');
    }
    if (!birthday) {
      throw new ErrorTypes.MissingBodyError('birthday');
    }
    if (!firstName) {
      throw new ErrorTypes.MissingBodyError('firstName');
    }
    if (!lastName) {
      throw new ErrorTypes.MissingBodyError('lastName');
    }
    if (!country) {
      throw new ErrorTypes.MissingBodyError('country');
    }
    if (!city) {
      throw new ErrorTypes.MissingBodyError('city');
    }
    if (!postalCode) {
      throw new ErrorTypes.MissingBodyError('postalCode');
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
      country,
      city,
      postalCode,
      about,
    });

    // Add path to user's profile picture if it was uploaded
    if (file) {
      const pictureUrl = `/photos/profilePictures/${file.filename}`;
      user.profilePicture = pictureUrl;
    }

    await user.save();
    return res.json({ message: 'Account created successfully', user });
  } catch (error: any) {
    return handleError(error, res);
  }
};

const authenticateUser = (
  req: Request,
  res: AuthTypes.AuthenticateUserResponse,
): AuthTypes.AuthenticateUserResponse => {
  const user = req.user as UserInterface;

  return res.json({ user });
};

export { createAccount, login, authenticateUser, loginGoogle };
