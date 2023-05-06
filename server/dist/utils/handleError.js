"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGE = void 0;
exports.ERROR_MESSAGE = 'Something went wrong on the server';
const handleError = (res, message, statusCode) => {
    console.error(message);
    return res.status(statusCode).json({ error: message });
};
exports.default = handleError;
