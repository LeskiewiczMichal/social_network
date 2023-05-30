"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setIO = void 0;
let socketIO;
function setIO(io) {
    socketIO = io;
}
exports.setIO = setIO;
function getIO() {
    return socketIO;
}
exports.getIO = getIO;
