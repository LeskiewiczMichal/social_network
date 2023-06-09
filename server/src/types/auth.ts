import { Request, Response } from 'express';
import { UserInterface } from '../models';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface CreateAccountRequest extends Request {
  body: {
    email: string;
    password: string;
    birthday: Date;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    postalCode: string;
    about: string;
  };
}

type LoginResponse = Response<{ user: UserInterface; token: string }>;
type LoginGoogleResponse = Response<{ user: UserInterface; token: string }>;
type CreateAccountResponse = Response<{ user: UserInterface; message: string }>;
type AuthenticateUserResponse = Response<{ user: UserInterface }>;

export {
  LoginRequest,
  LoginResponse,
  LoginGoogleResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  AuthenticateUserResponse,
};
