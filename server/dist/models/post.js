"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const Post = (0, mongoose_1.model)('Post', postSchema);
exports.default = Post;
