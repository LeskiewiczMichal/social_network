import mongoose from 'mongoose';
import { handleError } from '..';
import { ErrorTypes } from '../../types';

describe('handleError function', () => {
  test('returns the correct basic error response with status 500 on server error', () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new Error();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    handleError(error, res);

    errorSpy.mockRestore();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong on the server',
    });
  });

  test('returns 404 not found on mongoose cast error', () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new mongoose.Error.CastError('ObjectId', '1234', 'Field');

    handleError(error, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Not found',
    });
  });

  test('returns status 400 and message on BadRequestError', () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new ErrorTypes.BadRequestError('Post is already liked');

    handleError(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Post is already liked',
    });
  });

  test('returns status 401 and message on UnauthorizedError', () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new ErrorTypes.UnauthorizedError();

    handleError(error, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  test('returns status 400 and message on MissingBodyError', () => {
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new ErrorTypes.MissingBodyError('text');

    handleError(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required body field: text',
    });
  });
});
