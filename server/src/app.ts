import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { mongoConfig, serverConfig } from './middleware';
import { usersRouter, authRouter, postsRouter, commentsRouter } from './routes';
import {
  authenticationHandler,
  registerChatHandlers,
  registerDisconnectHandlers,
} from './handlers';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  MySocket,
} from './types';

dotenv.config();
mongoConfig();
const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  MySocket
>(httpServer, {
  cors: {
    origin: '*',
  },
});

serverConfig(app);

io.use(authenticationHandler);
io.on('connection', (socket: MySocket) => {
  registerChatHandlers(io, socket);
  registerDisconnectHandlers(io, socket);
});

app.use(
  '/profile-pictures',
  express.static(path.join(__dirname, '../uploads')),
);
app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
