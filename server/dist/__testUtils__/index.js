"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_CONSTANTS = exports.deleteAllComments = exports.createFakePosts = exports.deleteAllPosts = exports.createFakeUsers = exports.initializeMongoServer = exports.deleteAllUsers = void 0;
const deleteAllUsers_1 = __importDefault(require("./deleteAllUsers"));
exports.deleteAllUsers = deleteAllUsers_1.default;
const mongoConfigTesting_1 = __importDefault(require("./mongoConfigTesting"));
exports.initializeMongoServer = mongoConfigTesting_1.default;
const createFakeUsers_1 = __importDefault(require("./createFakeUsers"));
exports.createFakeUsers = createFakeUsers_1.default;
const createFakePosts_1 = __importDefault(require("./createFakePosts"));
exports.createFakePosts = createFakePosts_1.default;
const deleteAllPosts_1 = __importDefault(require("./deleteAllPosts"));
exports.deleteAllPosts = deleteAllPosts_1.default;
const deleteAllComments_1 = __importDefault(require("./deleteAllComments"));
exports.deleteAllComments = deleteAllComments_1.default;
const constants_1 = require("./constants");
const TEST_CONSTANTS = {
    USER_IDS: constants_1.USER_IDS,
    POST_IDS: constants_1.POST_IDS,
    COMMENT_IDS: constants_1.COMMENT_IDS,
    DEFAULT_USERS_PROPS: constants_1.DEFAULT_USERS_PROPS,
    DEFAULT_POSTS_PROPS: constants_1.DEFAULT_POSTS_PROPS,
    DEFAULT_COMMENTS_PROPS: constants_1.DEFAULT_COMMENTS_PROPS,
};
exports.TEST_CONSTANTS = TEST_CONSTANTS;
