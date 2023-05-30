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
exports.deleteComment = exports.updateComment = exports.getComments = exports.addComment = void 0;
const models_1 = require("../models");
const types_1 = require("../types");
const utils_1 = require("../utils");
const socketInstance_1 = require("../utils/socketInstance");
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { limit, offset, sortOrder } = req.query;
        const dbQuery = models_1.Comment.find().where('post', postId);
        if (limit) {
            dbQuery.limit(parseInt(limit, 10));
        }
        if (offset) {
            dbQuery.skip(parseInt(offset, 10));
        }
        if (sortOrder) {
            dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
        }
        dbQuery.populate('author');
        const comments = (yield dbQuery.exec());
        return res.json({ comments });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.getComments = getComments;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req.body;
        const { postId: postParamId } = req.params;
        if (!body) {
            throw new types_1.ErrorTypes.MissingBodyError('body');
        }
        const user = req.user;
        const post = (yield models_1.Post.findById(postParamId));
        // Create comment
        const comment = new models_1.Comment({
            body,
            author: user.id,
            likes: [],
            post: post._id,
        });
        yield comment.save();
        // Update post
        post.comments.push(comment._id);
        yield post.save();
        const receiver = (yield models_1.User.findById(post.author));
        // Create notification
        const newNotification = new models_1.Notification({
            receiver: receiver.id,
            sender: user.id,
            type: models_1.NotificationTypes.POST_COMMENTED,
        });
        yield newNotification.save();
        // If post author is active emit notification
        if (receiver.socketId) {
            const io = (0, socketInstance_1.getIO)();
            if (io) {
                yield newNotification.populate('sender');
                io.to(receiver.socketId).emit('new-notification', newNotification);
            }
        }
        yield comment.populate('author');
        return res.json({ message: 'Comment successfully created', comment });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.addComment = addComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { like } = req.query;
        const { body } = req.body;
        const { id: userId } = req.user;
        const comment = (yield models_1.Comment.findById(commentId));
        if (like) {
            if (comment.likes.includes(userId)) {
                comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
            }
            else {
                comment.likes.push(userId);
                const author = (yield models_1.User.findById(comment.author));
                // Create notification
                const newNotification = new models_1.Notification({
                    receiver: author.id,
                    sender: userId,
                    type: models_1.NotificationTypes.COMMENT_LIKED,
                });
                yield newNotification.save();
                // If post author is active emit notification
                if (author.socketId) {
                    const io = (0, socketInstance_1.getIO)();
                    if (io) {
                        yield newNotification.populate('sender');
                        io.to(author.socketId).emit('new-notification', newNotification);
                    }
                }
            }
        }
        if (body) {
            if (comment.author.toString() !== userId.toString()) {
                throw new types_1.ErrorTypes.UnauthorizedError();
            }
            comment.body = body;
        }
        yield comment.save();
        return res.json({ message: 'Comment edited successfully', comment });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { id: userId } = req.user;
        const comment = (yield models_1.Comment.findById(commentId));
        if (comment.author.toString() !== userId.toString()) {
            throw new types_1.ErrorTypes.UnauthorizedError();
        }
        yield models_1.Comment.deleteOne({ comment });
        yield models_1.Post.updateMany({ comments: comment.id }, { $pull: { comments: comment.id } });
        return res.json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.deleteComment = deleteComment;
