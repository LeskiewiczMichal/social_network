import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

import { mongoConfig, serverConfig } from './middleware';
import * as Routes from './routes';
import * as EventHandlers from './handlers';
import { SocketTypes } from './types';

/// TODO: on connection add socket and return user ///
/// TODO: when creating user, capitalize first letter, etc... ///

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
  },
});
serverConfig(app);

// Set up socket server handlers
io.use(EventHandlers.authenticationHandler);
io.on('connection', (socket: SocketTypes.MySocket) => {
  EventHandlers.registerChatHandlers(io, socket);
  EventHandlers.registerDisconnectHandlers(io, socket);
});

// Set up routes
app.use('/photos', express.static(path.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users/auth', Routes.authRouter);
app.use('/api/users', Routes.usersRouter);
app.use('/api/posts', Routes.postsRouter);
app.use('/api/comments', Routes.commentsRouter);
app.use('/api/messages', Routes.messageRouter);

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
