import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { mongoConfig, serverConfig } from './middleware';
import { usersRouter, authRouter, postsRouter, commentsRouter } from './routes';
import { authenticationHandler, registerChatHandlers } from './handlers';
import { MySocket } from './types';

dotenv.config();
mongoConfig();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

serverConfig(app);

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

authenticationHandler(io);

const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket: MySocket) => {
  registerChatHandlers(io, socket);
});

httpServer.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
