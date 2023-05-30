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
const createFakePosts = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultPostOne = Object.assign({ _id: props.postIds.one, title: 'Testing', body: 'Testing post number one', author: props.authorId, comments: [], likes: [] }, props.postOne);
    const defaultPostTwo = Object.assign({ _id: props.postIds.two, title: 'TesterPost', body: 'Testing post number two', author: props.authorId, comments: [], likes: [] }, props.postTwo);
    const defaultPostThree = Object.assign({ _id: props.postIds.three, title: 'TesterPost', body: 'Testing post number three', author: props.authorId, comments: [], likes: [] }, props.postThree);
    const postOne = new models_1.Post(defaultPostOne);
    const postTwo = new models_1.Post(defaultPostTwo);
    const postThree = new models_1.Post(defaultPostThree);
    yield postOne.save();
    yield postTwo.save();
    yield postThree.save();
    const commentOne = new models_1.Comment({
        author: props.authorId,
        body: 'This is first test comment',
        post: props.postIds.one,
        likes: [],
    });
    const commentTwo = new models_1.Comment({
        author: props.authorId,
        body: 'This is the second test comment, heyo',
        post: props.postIds.one,
        likes: [],
    });
    yield commentOne.save();
    yield commentTwo.save();
    const expectedPostOne = Object.assign(Object.assign({}, defaultPostOne), { _id: props.postIds.one.toString(), author: postOne.author.toString() });
    const expectedPostTwo = Object.assign(Object.assign({}, defaultPostTwo), { _id: props.postIds.two.toString(), author: postTwo.author.toString() });
    const expectedPostThree = Object.assign(Object.assign({}, defaultPostThree), { _id: props.postIds.three.toString(), author: postThree.author.toString() });
    return {
        one: expectedPostOne,
        two: expectedPostTwo,
        three: expectedPostThree,
    };
});
exports.default = createFakePosts;
