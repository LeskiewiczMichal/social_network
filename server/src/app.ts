import * as dotenv from 'dotenv';
import express from 'express';
import { mongoConfig, serverConfig } from './middleware';
import { usersRouter, authRouter } from './routes';

dotenv.config();
mongoConfig();
const app = express();

serverConfig(app);

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users', usersRouter);
app.use('/api/users/auth', authRouter);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
