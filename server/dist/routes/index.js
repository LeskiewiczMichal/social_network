"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRouter = exports.messageRouter = exports.commentsRouter = exports.postsRouter = exports.authRouter = exports.usersRouter = void 0;
const usersRouter_1 = __importDefault(require("./usersRouter"));
exports.usersRouter = usersRouter_1.default;
const authRouter_1 = __importDefault(require("./authRouter"));
exports.authRouter = authRouter_1.default;
const postsRouter_1 = __importDefault(require("./postsRouter"));
exports.postsRouter = postsRouter_1.default;
const commentsRouter_1 = __importDefault(require("./commentsRouter"));
exports.commentsRouter = commentsRouter_1.default;
const messageRouter_1 = __importDefault(require("./messageRouter"));
exports.messageRouter = messageRouter_1.default;
const notificationsRouter_1 = __importDefault(require("./notificationsRouter"));
exports.notificationsRouter = notificationsRouter_1.default;
