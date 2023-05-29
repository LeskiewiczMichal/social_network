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
const models_1 = require("../../models");
const notification_1 = require("../../models/notification");
const newFriendRequest = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { socket, io, newFriendId } = props;
        if (!socket.user || newFriendId === socket.user.id) {
            return;
        }
        const userId = socket.user.id;
        const friend = (yield models_1.User.findById(newFriendId).select('+friendRequests'));
        // Check if user is not already in requests.
        if (friend.friendRequests.includes(userId)) {
            return;
        }
        friend.friendRequests.push(userId);
        yield friend.save();
        const newNotification = new models_1.Notification({
            receiver: friend.id,
            sender: userId,
            type: notification_1.NotificationTypes.FRIEND_REQUEST,
        });
        yield newNotification.save();
        // If receiver is active emit a notification
        if (friend.socketId) {
            // await (await messageObject.populate('receiver')).populate('sender');
            io.to(friend.socketId).emit('new-notification', newNotification);
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = newFriendRequest;
