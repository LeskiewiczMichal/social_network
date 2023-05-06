"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }],
    friendRequests: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    birthday: { type: Date, required: true },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;