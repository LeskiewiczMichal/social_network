import { Response } from 'express';
import mongoose from 'mongoose';
import {
  BadRequestError,
  UnauthorizedError,
  MissingBodyError,
} from '../types/errors';

export const ERROR_MESSAGE = 'Something went wrong on the server';

function handleError(error: any, res: Response) {
  if (error instanceof mongoose.Error.CastError) {
    // return handleError(res, 'Not found', 404);
    return res.status(404).json({ error: 'Not found' });
  }
  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof MissingBodyError
  ) {
    // return handleError(res, error.message, error.status);
    return res.status(error.status).json({ error: error.message });
  }

  // return handleError(res, ERROR_MESSAGE, 500);
  return res.status(500).json({ error: 'Something went wrong on the server' });
}

// export { handleCommentsError };

// const handleError = (res: Response, message: string, statusCode: number) => {
//   console.error(message);
//   return res.status(statusCode).json({ error: message });
// };

export default handleError;
