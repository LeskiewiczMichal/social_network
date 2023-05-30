"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MESSAGES_PROPS = exports.MESSAGE_IDS = exports.DEFAULT_COMMENTS_PROPS = exports.COMMENT_IDS = exports.DEFAULT_POSTS_PROPS = exports.DEFAULT_USERS_PROPS = exports.POST_IDS = exports.USER_IDS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const USER_IDS = {
    one: new mongoose_1.default.Types.ObjectId(),
    two: new mongoose_1.default.Types.ObjectId(),
    three: new mongoose_1.default.Types.ObjectId(),
};
exports.USER_IDS = USER_IDS;
const POST_IDS = {
    one: new mongoose_1.default.Types.ObjectId(),
    two: new mongoose_1.default.Types.ObjectId(),
    three: new mongoose_1.default.Types.ObjectId(),
};
exports.POST_IDS = POST_IDS;
const COMMENT_IDS = {
    one: new mongoose_1.default.Types.ObjectId(),
    two: new mongoose_1.default.Types.ObjectId(),
    three: new mongoose_1.default.Types.ObjectId(),
};
exports.COMMENT_IDS = COMMENT_IDS;
const MESSAGE_IDS = {
    one: new mongoose_1.default.Types.ObjectId(),
    two: new mongoose_1.default.Types.ObjectId(),
    three: new mongoose_1.default.Types.ObjectId(),
};
exports.MESSAGE_IDS = MESSAGE_IDS;
const DEFAULT_USERS_PROPS = {
    userOne: {},
    userTwo: {},
    userThree: {},
    ids: USER_IDS,
};
exports.DEFAULT_USERS_PROPS = DEFAULT_USERS_PROPS;
const DEFAULT_POSTS_PROPS = {
    postOne: {},
    postTwo: {},
    postThree: {},
    postIds: POST_IDS,
    authorId: USER_IDS.one,
};
exports.DEFAULT_POSTS_PROPS = DEFAULT_POSTS_PROPS;
const DEFAULT_COMMENTS_PROPS = {
    commentOne: {},
    commentTwo: {},
    commentThree: {},
    commentIds: COMMENT_IDS,
    authorId: USER_IDS.one,
    postId: POST_IDS.one,
};
exports.DEFAULT_COMMENTS_PROPS = DEFAULT_COMMENTS_PROPS;
const DEFAULT_MESSAGES_PROPS = {
    messageOne: {},
    messageTwo: {},
    messageThree: {},
    messageIds: MESSAGE_IDS,
    senderId: USER_IDS.one,
    receiverId: USER_IDS.two,
    userThreeId: USER_IDS.three,
};
exports.DEFAULT_MESSAGES_PROPS = DEFAULT_MESSAGES_PROPS;
