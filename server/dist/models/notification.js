"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypes = void 0;
const mongoose_1 = require("mongoose");
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes["FRIEND_REQUEST"] = "friendRequest";
    NotificationTypes["NEW_FRIEND"] = "newFriend";
    NotificationTypes["POST_LIKED"] = "postLiked";
    NotificationTypes["POST_COMMENTED"] = "postCommented";
    NotificationTypes["COMMENT_LIKED"] = "commentLiked";
})(NotificationTypes = exports.NotificationTypes || (exports.NotificationTypes = {}));
const notificationSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: Object.values(NotificationTypes),
        required: true,
    },
}, { timestamps: true });
const Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;
