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
const models_1 = require("../models");
const createFakeComments = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultCommentOne = Object.assign({ _id: props.commentIds.one, body: 'Testing comment number one', author: props.authorId, post: props.postId, likes: [] }, props.commentOne);
    const defaultCommentTwo = Object.assign({ _id: props.commentIds.two, body: 'Testing comment number two', author: props.authorId, post: props.postId, likes: [] }, props.commentTwo);
    const defaultCommentThree = Object.assign({ _id: props.commentIds.three, body: 'Testing comment number three', author: props.authorId, post: props.postId, likes: [] }, props.commentThree);
    const commentOne = new models_1.Comment(defaultCommentOne);
    const commentTwo = new models_1.Comment(defaultCommentTwo);
    const commentThree = new models_1.Comment(defaultCommentThree);
    yield commentOne.save();
    yield commentTwo.save();
    yield commentThree.save();
    const newPost = new models_1.Post({
        _id: props.postId,
        body: 'Testing comments post',
        title: 'Testing',
        author: props.authorId,
        likes: [],
        comments: [
            props.commentIds.one,
            props.commentIds.two,
            props.commentIds.three,
        ],
    });
    yield newPost.save();
    return {
        one: Object.assign(Object.assign({}, defaultCommentOne), { _id: props.commentIds.one.toString(), author: commentOne.author.toString(), post: commentOne.post.toString() }),
        two: Object.assign(Object.assign({}, defaultCommentTwo), { _id: props.commentIds.two.toString(), author: commentTwo.author.toString(), post: commentTwo.post.toString() }),
        three: Object.assign(Object.assign({}, defaultCommentThree), { _id: props.commentIds.three.toString(), author: commentThree.author.toString(), post: commentThree.post.toString() }),
        post: {
            _id: props.postId,
            body: 'Testing comments post',
            title: 'Testing',
            author: props.authorId,
            post: props.postId,
            likes: [],
            comment: [
                props.commentIds.one,
                props.commentIds.two,
                props.commentIds.three,
            ],
        },
    };
});
exports.default = createFakeComments;
