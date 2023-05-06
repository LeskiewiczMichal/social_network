"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleError = (res, message, statusCode) => {
    console.error(message);
    return res.status(statusCode).json({ message });
};
exports.default = handleError;
