import { Response } from 'express';

export const ERROR_MESSAGE = 'Something went wrong on the server';

const handleError = (res: Response, message: string, statusCode: number) => {
  console.error(message);
  return res.status(statusCode).json({ error: message });
};

export default handleError;
