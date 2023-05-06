import { Response } from 'express';

const handleError = (res: Response, message: string, statusCode: number) => {
  console.error(message);
  return res.status(statusCode).json({ error: message });
};

export default handleError;
