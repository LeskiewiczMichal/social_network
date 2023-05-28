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
const types_1 = require("../types");
const models_1 = require("../models");
const notification_1 = require("../models/notification");
const registerFriendHandlers = (io, socket) => {
    const newFriendRequest = (props) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!socket.user) {
                return;
            }
            const { newFriendId } = props;
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
    const addFriend = (props) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { newFriendId } = props;
            const { user } = socket;
            if (!user) {
                return;
            }
            const friend = (yield models_1.User.findById(newFriendId));
            // Remove from friend requests
            const friendIdIndex = (_a = user.friendRequests) === null || _a === void 0 ? void 0 : _a.indexOf(friend.id);
            if (friendIdIndex !== -1) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                user.friendRequests.splice(friendIdIndex, 1)[0];
            }
            else {
                throw new types_1.ErrorTypes.BadRequestError("User was not on friend's requests list");
            }
            // Add to friends
            user.friends.push(friend.id);
            yield user.save();
            // Create notification
            const newNotification = new models_1.Notification({
                receiver: friend.id,
                sender: user.id,
                type: notification_1.NotificationTypes.NEW_FRIEND,
            });
            yield newNotification.save();
            // If receiver is active emit a notification
            if (friend.socketId) {
                // await (await messageObject.populate('receiver')).populate('sender');
                io.to(friend.socketId).emit('new-notification', newNotification);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    socket.on('send-friend-request', newFriendRequest);
    socket.on('add-friend', addFriend);
};
exports.default = registerFriendHandlers;
