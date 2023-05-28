"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const registerChatHandlers = (io, socket) => {
    const newMessage = (props) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!socket.user) {
                return;
            }
            const { body, receiverId } = props;
            const receiver = (yield models_1.User.findById(receiverId));
            const messageObject = new models_1.Message({
                body,
                sender: socket.user.id,
                receiver: receiverId,
            });
            yield messageObject.save();
            // If receiver is active emit a notification
            if (receiver.socketId) {
                // await (await messageObject.populate('receiver')).populate('sender');
                io.to(receiver.socketId).emit('message-received', messageObject);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    socket.on('send-message', newMessage);
};
exports.default = registerChatHandlers;
