import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { mongoConfig, passportConfig } from './middleware';
import { usersRouter, authRouter } from './routes';

dotenv.config();
mongoConfig();
const app = express();

app.use(cors());
app.use(passportConfig);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome');
});
app.use('/api/users', usersRouter);
app.use('/api/users/auth', authRouter);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
