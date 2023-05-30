"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGE = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errors_1 = require("../types/errors");
exports.ERROR_MESSAGE = 'Something went wrong on the server';
function handleError(error, res) {
    if (error instanceof mongoose_1.default.Error.CastError) {
        return res.status(404).json({ error: 'Not found' });
    }
    if (error instanceof errors_1.BadRequestError ||
        error instanceof errors_1.UnauthorizedError ||
        error instanceof errors_1.MissingBodyError ||
        error instanceof errors_1.NotFoundError) {
        return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Something went wrong on the server' });
}
// export { handleCommentsError };
// const handleError = (res: Response, message: string, statusCode: number) => {
//   console.error(message);
//   return res.status(statusCode).json({ error: message });
// };
exports.default = handleError;
