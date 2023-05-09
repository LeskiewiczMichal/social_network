import * as dotenv from 'dotenv';
import express from 'express';
import { mongoConfig, serverConfig } from './middleware';
import { usersRouter, authRouter, postsRouter, commentsRouter } from './routes';

dotenv.config();
mongoConfig();
const app = express();

serverConfig(app);

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
