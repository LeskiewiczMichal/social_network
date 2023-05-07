import mongoose from 'mongoose';
import { handleError, ERROR_MESSAGE, handleNotFound } from '..';
import { User, UserInterface } from '../../models';

const userId = new mongoose.Types.ObjectId();
const mockUser = {
  _id: userId,
  email: 'test.user@example.com',
  firstName: 'Test',
  lastName: 'Surname',
  birthday: '1000-05-05T00:00:00.000Z',
  password: 'password123',
};

describe('handleError function', () => {
  test('should return the correct error response', () => {
    const statusCode = 500;
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    handleError(res, ERROR_MESSAGE, statusCode);

    errorSpy.mockRestore();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGE });
  });
});

describe('handleNotFound function', () => {
  test('should do nothing if resource was found', () => {
    const data = new User(mockUser) as UserInterface;
    const message = 'User not found';
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    handleNotFound({ res, data, message });

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return the correct error response', () => {
    const data = null;
    const message = 'User not found';
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    handleNotFound({ res, data, message });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: message });
  });
});
