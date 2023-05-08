import mongoose from 'mongoose';
import { Response } from 'express';
import {
  BadRequestError,
  UnauthorizedError,
  MissingBodyError,
} from '../../types/errors';
import { handleError, ERROR_MESSAGE } from '../../utils';

function handleCommentsError(error: any, res: Response) {
  if (error instanceof mongoose.Error.CastError) {
    return handleError(res, 'Not found', 404);
  }
  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof MissingBodyError
  ) {
    return handleError(res, error.message, error.status);
  }

  return handleError(res, ERROR_MESSAGE, 500);
}

export { handleCommentsError };
