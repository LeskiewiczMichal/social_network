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
exports.uploadPhoto = exports.unlikePost = exports.likePost = exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const types_1 = require("../types");
const models_1 = require("../models");
const utils_1 = require("../utils");
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = (yield models_1.Post.find().populate('author'));
        return res.json({ posts });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.getPosts = getPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const post = (yield models_1.Post.findById(postId));
        return res.json({ post });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.getPostById = getPostById;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { body, title } = req.body;
        const { file } = req;
        if (!title) {
            throw new types_1.ErrorTypes.MissingBodyError('title');
        }
        else if (!body) {
            throw new types_1.ErrorTypes.MissingBodyError('body');
        }
        const post = new models_1.Post({
            title,
            body,
            author: userId,
            comments: [],
            likes: [],
        });
        // Add path to photo if it was uploaded
        if (file) {
            const photoUrl = `/photos/posts/${file.filename}`;
            post.photo = photoUrl;
        }
        yield post.save();
        return res.json({ message: 'Post successfully created', post });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { title, body } = req.body;
        const post = (yield models_1.Post.findById(req.params.postId));
        if (post.author.toString() !== userId.toString()) {
            throw new types_1.ErrorTypes.UnauthorizedError();
        }
        if (title) {
            post.title = title;
        }
        if (body) {
            post.body = body;
        }
        yield post.save();
        return res.json({ post });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { postId } = req.params;
        const post = (yield models_1.Post.findById(postId));
        if (post.author.toString() !== userId.toString()) {
            throw new types_1.ErrorTypes.UnauthorizedError();
        }
        yield models_1.Comment.deleteMany({ post: postId });
        yield models_1.Post.deleteOne({ _id: postId });
        return res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { postId } = req.params;
        const post = (yield models_1.Post.findById(postId));
        if (post.likes.includes(userId)) {
            throw new types_1.ErrorTypes.BadRequestError('Post is already liked');
        }
        post.likes.push(userId);
        yield post.save();
        return res.json({ message: 'Post liked successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.likePost = likePost;
const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { postId } = req.params;
        const post = (yield models_1.Post.findById(postId));
        if (!post.likes.includes(userId)) {
            throw new types_1.ErrorTypes.BadRequestError('Post is not liked');
        }
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        yield post.save();
        return res.json({ message: 'Post unliked successfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.unlikePost = unlikePost;
const uploadPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        if (!file) {
            throw new types_1.ErrorTypes.NotFoundError();
        }
        const photoUrl = `/photos/photos/${file.filename}`;
        return res.json({ message: 'Photo updated successfully', url: photoUrl });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.uploadPhoto = uploadPhoto;
