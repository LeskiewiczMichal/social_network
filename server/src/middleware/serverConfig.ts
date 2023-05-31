import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import passportConfig from './passportConfig';

const serverConfig = (app: Express) => {
  app.use(cors());
  app.use(passportConfig);
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../../../client/build')));
};

export default serverConfig;
