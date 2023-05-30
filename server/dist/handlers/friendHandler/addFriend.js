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
const types_1 = require("../../types");
const addFriend = (props) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newFriendId, io, socket } = props;
        const { user } = socket;
        if (!user || newFriendId === user.id) {
            return;
        }
        const friend = (yield models_1.User.findById(newFriendId));
        // Remove from friend requests
        const friendIdIndex = user.friendRequests.indexOf(friend.id);
        if (friendIdIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            user.friendRequests.splice(friendIdIndex, 1)[0];
        }
        else {
            throw new types_1.ErrorTypes.BadRequestError("User was not on friend's requests list");
        }
        // Add to friends
        user.friends.push(friend.id);
        friend.friends.push(user.id);
        yield user.save();
        yield friend.save();
        // Create notification
        const newNotification = new models_1.Notification({
            receiver: friend.id,
            sender: user.id,
            type: notification_1.NotificationTypes.NEW_FRIEND,
        });
        yield newNotification.save();
        // If receiver is active emit a notification
        if (friend.socketId) {
            yield newNotification.populate('sender');
            // await (await messageObject.populate('receiver')).populate('sender');
            io.to(friend.socketId).emit('new-notification', newNotification);
        }
    }
    catch (err) {
        console.error(err);
    }
});
exports.default = addFriend;
