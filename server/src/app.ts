import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

import { mongoConfig, serverConfig } from './middleware';
import * as Routes from './routes';
import * as EventHandlers from './handlers';
import { SocketTypes } from './types';
import { setIO } from './utils/socketInstance';

// Set up server
dotenv.config();
mongoConfig();
const app = express();
const httpServer = createServer(app);
const io = new Server<
  SocketTypes.ClientToServerEvents,
  SocketTypes.ServerToClientEvents,
  SocketTypes.InterServerEvents,
  SocketTypes.MySocket
>(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});
serverConfig(app);
setIO(io);

// Set up socket server handlers
io.use(EventHandlers.authenticationHandler);
io.on('connection', (socket: SocketTypes.MySocket) => {
  EventHandlers.registerChatHandlers(io, socket);
  EventHandlers.registerDisconnectHandlers(io, socket);
  EventHandlers.registerFriendHandlers(io, socket);
});

// Set up routes
app.use('/photos', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users/auth', Routes.authRouter);
app.use('/api/users', Routes.usersRouter);
app.use('/api/posts', Routes.postsRouter);
app.use('/api/comments', Routes.commentsRouter);
app.use('/api/messages', Routes.messageRouter);
app.use('/api/notifications', Routes.notificationsRouter);
app.use('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/', 'index.html'));
});

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
