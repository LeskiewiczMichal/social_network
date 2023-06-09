import * as jwt from 'jsonwebtoken';
import {
  User,
  UserInterface,
  UserInterfaceWithFriendRequests,
} from '../models';
import { SocketTypes } from '../types';

const authenticationHandler = async (
  socket: SocketTypes.MySocket,
  next: any,
) => {
  const { token } = socket.handshake.auth;

  if (!token) {
    socket.disconnect();
    return;
  }

  if (!process.env.SECRET) {
    throw new Error('Environment variables not defined');
  }

  try {
    const tokenString = token.substring(7, token.length);
    const decodedToken = jwt.verify(
      tokenString,
      process.env.SECRET,
    ) as jwt.JwtPayload;

    const user = (await User.findByIdAndUpdate(
      decodedToken.id,
      { socketId: socket.id },
      { new: true },
    ).select('+friendRequests')) as UserInterfaceWithFriendRequests;

    if (!user) {
      socket.disconnect();
      return;
    }

    socket.user = user;

    next();
  } catch (error) {
    socket.disconnect();
  }
};

export default authenticationHandler;
