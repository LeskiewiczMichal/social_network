"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newFriendRequest_1 = __importDefault(require("./newFriendRequest"));
const addFriend_1 = __importDefault(require("./addFriend"));
const registerFriendHandlers = (io, socket) => {
    socket.on('send-friend-request', (data) => {
        (0, newFriendRequest_1.default)({ newFriendId: data.newFriendId, socket, io });
    });
    socket.on('add-friend', (data) => {
        (0, addFriend_1.default)({ newFriendId: data.newFriendId, io, socket });
    });
};
exports.default = registerFriendHandlers;
