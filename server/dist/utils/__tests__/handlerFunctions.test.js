"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const types_1 = require("../../types");
describe('handleError function', () => {
    test('returns the correct basic error response with status 500 on server error', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const error = new Error();
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (0, __1.handleError)(error, res);
        errorSpy.mockRestore();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong on the server',
        });
    });
    test('returns 404 not found on mongoose cast error', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const error = new mongoose_1.default.Error.CastError('ObjectId', '1234', 'Field');
        (0, __1.handleError)(error, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Not found',
        });
    });
    test('returns status 400 and message on BadRequestError', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const error = new types_1.ErrorTypes.BadRequestError('Post is already liked');
        (0, __1.handleError)(error, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Post is already liked',
        });
    });
    test('returns status 401 and message on UnauthorizedError', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const error = new types_1.ErrorTypes.UnauthorizedError();
        (0, __1.handleError)(error, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Unauthorized',
        });
    });
    test('returns status 400 and message on MissingBodyError', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const error = new types_1.ErrorTypes.MissingBodyError('text');
        (0, __1.handleError)(error, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Missing required body field: text',
        });
    });
});
