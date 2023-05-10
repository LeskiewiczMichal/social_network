"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.BadRequestError = exports.UnauthorizedError = exports.MissingBodyError = void 0;
class MissingBodyError extends Error {
    constructor(field) {
        super(`Missing required body field: ${field}`);
        this.name = 'MissingBodyError';
        this.status = 400;
    }
}
exports.MissingBodyError = MissingBodyError;
class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized');
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.status = 400;
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
    constructor() {
        super('Not found');
        this.name = 'NotFoundError';
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
