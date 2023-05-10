import * as jwt from 'jsonwebtoken';
import { User, UserInterface } from '../models';
import { MySocket } from '../types';

const authenticationHandler = async (socket: MySocket, next: any) => {
  const { token } = socket.handshake.auth;
  if (!token) {
    socket.disconnect();
    return;
  }

  if (!process.env.SECRET) {
    throw new Error('Environment variables not defined');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET,
    ) as jwt.JwtPayload;
    const user = (await User.findByIdAndUpdate(
      decodedToken.id,
      { socketId: socket.id },
      { new: true },
    )) as UserInterface;

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
