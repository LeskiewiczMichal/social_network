"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    body: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = Comment;
