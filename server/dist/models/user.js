"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: false, select: false },
    email: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    about: { type: String, required: true },
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        select: false,
    },
    birthday: { type: Date, required: false },
    profilePicture: {
        type: String,
        default: '/photos/profilePictures/default.png',
    },
    notifications: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Notification' }],
        select: false,
        default: [],
    },
    googleId: { type: String, requried: false, select: false },
    socketId: { type: String, required: false, default: null },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
