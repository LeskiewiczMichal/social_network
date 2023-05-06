import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passportConfig from './passportConfig';

const serverConfig = (app: Express) => {
  app.use(cors());
  app.use(passportConfig);
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
};

export default serverConfig;
