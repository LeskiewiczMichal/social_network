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
exports.dislikeComment = exports.likeComment = exports.deleteComment = exports.updateComment = exports.getComments = exports.addComment = void 0;
const models_1 = require("../models");
const types_1 = require("../types");
const utils_1 = require("../utils");
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
        const { id: userId } = req.user;
        const { id: postId } = (yield models_1.Post.findById(postParamId));
        const comment = new models_1.Comment({
            body,
            author: userId,
            likes: [],
            post: postId,
        });
        yield comment.save();
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
        const { body } = req.body;
        const { id: userId } = req.user;
        const comment = (yield models_1.Comment.findById(commentId));
        if (comment.author.toString() !== userId.toString()) {
            throw new types_1.ErrorTypes.UnauthorizedError();
        }
        if (body) {
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
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { id: userId } = req.user;
        const comment = (yield models_1.Comment.findById(commentId));
        if (comment.likes.includes(userId)) {
            throw new types_1.ErrorTypes.BadRequestError('Comment is already liked');
        }
        comment.likes.push(userId);
        yield comment.save();
        return res.json({ message: 'Comment liked successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.likeComment = likeComment;
const dislikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { id: userId } = req.user;
        const comment = (yield models_1.Comment.findById(commentId));
        if (!comment.likes.includes(userId)) {
            throw new types_1.ErrorTypes.BadRequestError("Comment isn't liked");
        }
        comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
        yield comment.save();
        return res.json({ message: 'Comment unliked successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.dislikeComment = dislikeComment;
