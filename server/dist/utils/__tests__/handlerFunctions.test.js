"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const models_1 = require("../../models");
const userId = new mongoose_1.default.Types.ObjectId();
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
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        (0, __1.handleError)(res, __1.ERROR_MESSAGE, statusCode);
        errorSpy.mockRestore();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: __1.ERROR_MESSAGE });
    });
});
describe('handleNotFound function', () => {
    test('should do nothing if resource was found', () => {
        const data = new models_1.User(mockUser);
        const message = 'User not found';
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        (0, __1.handleNotFound)({ res, data, message });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    test('should return the correct error response', () => {
        const data = null;
        const message = 'User not found';
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        (0, __1.handleNotFound)({ res, data, message });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: message });
    });
});
