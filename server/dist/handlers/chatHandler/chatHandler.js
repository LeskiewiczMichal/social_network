"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newMessage_1 = __importDefault(require("./newMessage"));
const registerChatHandlers = (io, socket) => {
    socket.on('send-message', (data) => {
        (0, newMessage_1.default)({ socket, io, body: data.body, receiverId: data.receiverId });
    });
};
exports.default = registerChatHandlers;
