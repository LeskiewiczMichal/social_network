"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = require("../../middleware");
const models_1 = require("../../models");
const TestUtils = __importStar(require(".."));
const createFakeComments_1 = __importDefault(require("../createFakeComments"));
dotenv.config();
const app = (0, express_1.default)();
(0, middleware_1.serverConfig)(app);
const IDS = {
    one: new mongoose_1.default.Types.ObjectId(),
    two: new mongoose_1.default.Types.ObjectId(),
    three: new mongoose_1.default.Types.ObjectId(),
};
describe('Utility functions', () => {
    let db;
    let errorSpy; // This disables console error
    // Set up database
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        try {
            db = yield TestUtils.initializeMongoServer();
        }
        catch (error) {
            console.error(error);
        }
    }));
    // Stop server
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.stop();
        errorSpy.mockRestore();
    }));
    describe('Delete all users', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const userOne = new models_1.User({
                firstName: 'test',
                lastName: 'test',
                email: 'test@mail.com',
                friends: [],
                friendRequests: [],
                birthday: new Date('2000-03-09'),
                country: 'Poland',
                city: 'Sieradz',
                postalCode: '98-200',
                about: 'test',
                profilePicture: '/test/test.png',
            });
            const userTwo = new models_1.User({
                firstName: 'qwer',
                lastName: 'qwer',
                email: 'qwer@mail.com',
                friends: [],
                friendRequests: [],
                birthday: new Date('2000-03-09'),
                country: 'Poland',
                city: 'Sieradz',
                postalCode: '98-200',
                about: 'test',
                profilePicture: '/test/test.png',
            });
            yield userOne.save();
            yield userTwo.save();
        }));
        test('deletes users from database', () => {
            TestUtils.deleteAllUsers();
            models_1.User.find()
                .then((docs) => {
                expect(docs).toHaveLength(0);
            })
                .catch((error) => {
                console.error(error);
            });
        });
    });
    describe('Delete all posts', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const userOne = new models_1.User({
                _id: IDS.one,
                firstName: 'test',
                lastName: 'test',
                email: 'test@mail.com',
                friends: [],
                friendRequests: [],
                birthday: new Date('2000-03-09'),
                country: 'Poland',
                city: 'Sieradz',
                postalCode: '98-200',
                about: 'test',
                profilePicture: '/test/test.png',
            });
            yield userOne.save();
            const postOne = new models_1.Post({
                title: 'testOne',
                body: 'testing body one',
                author: IDS.one,
                comments: [],
                likes: [],
            });
            const postTwo = new models_1.Post({
                title: 'testingTwo',
                body: 'testing two',
                author: IDS.one,
                comments: [],
                likes: [],
            });
            yield postOne.save();
            yield postTwo.save();
        }));
        test('deletes posts from database', () => {
            TestUtils.deleteAllPosts();
            models_1.Post.find()
                .then((docs) => {
                expect(docs).toHaveLength(0);
            })
                .catch((error) => {
                console.error(error);
            });
        });
    });
    describe('Delete all comments', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const commentOne = new models_1.Comment({
                body: 'testing one',
                author: IDS.one,
                post: TestUtils.CONSTANTS.POST_IDS.one,
                likes: [],
            });
            const commentTwo = new models_1.Comment({
                body: 'testing two',
                author: IDS.one,
                post: TestUtils.CONSTANTS.POST_IDS.one,
                likes: [],
            });
            const commentThree = new models_1.Comment({
                body: 'testing three',
                author: IDS.one,
                post: TestUtils.CONSTANTS.POST_IDS.one,
                likes: [],
            });
            yield commentOne.save();
            yield commentTwo.save();
            yield commentThree.save();
        }));
        test('deletes comments from database', () => {
            TestUtils.deleteAllComments();
            models_1.Comment.find()
                .then((docs) => {
                expect(docs).toHaveLength(0);
            })
                .catch((error) => {
                console.error(error);
            });
        });
    });
    describe('Create fake users', () => {
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('returns proper basic users when empty props provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield TestUtils.createFakeUsers({
                userOne: {},
                userTwo: {},
                userThree: {},
                ids: IDS,
            });
            expect(typeof users.tokens.one).toBe('string');
            expect(typeof users.tokens.two).toBe('string');
            expect(typeof users.tokens.three).toBe('string');
            expect(typeof users.one._id).toBe('string');
            expect(typeof users.two._id).toBe('string');
            expect(typeof users.three._id).toBe('string');
            expect(users).toMatchObject({
                one: {
                    firstName: 'John',
                    lastName: 'Doe',
                    password: 'password123',
                    email: 'john.doe@example.com',
                    friends: [],
                    friendRequests: [],
                    birthday: '1990-01-01T00:00:00.000Z',
                },
                two: {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    password: 'password456',
                    email: 'jane.doe@example.com',
                    friends: [],
                    friendRequests: [],
                    birthday: '1995-05-04T00:00:00.000Z',
                    googleId: '5234553455',
                },
                three: {
                    firstName: 'Marry',
                    lastName: 'Christmas',
                    password: 'password90',
                    email: 'marry.christmas@example.com',
                    friends: [],
                    friendRequests: [],
                    birthday: '2000-03-09T00:00:00.000Z',
                },
            });
        }));
        test('returns proper custom users', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield TestUtils.createFakeUsers({
                userOne: {
                    firstName: 'test',
                    lastName: 'test',
                    password: 'test',
                    email: 'test',
                    friends: [IDS.two],
                    friendRequests: [IDS.three],
                    googleId: '123',
                },
                userTwo: {
                    firstName: 'ok',
                    email: 'ok',
                },
                userThree: {
                    friends: [IDS.three],
                    friendRequests: [IDS.one],
                },
                ids: IDS,
            });
            expect(typeof users.tokens.one).toBe('string');
            expect(typeof users.tokens.two).toBe('string');
            expect(typeof users.tokens.three).toBe('string');
            expect(typeof users.one._id).toBe('string');
            expect(typeof users.two._id).toBe('string');
            expect(typeof users.three._id).toBe('string');
            expect(users).toMatchObject({
                one: {
                    firstName: 'test',
                    lastName: 'test',
                    password: 'test',
                    email: 'test',
                    friends: [IDS.two],
                    friendRequests: [IDS.three],
                    birthday: '1990-01-01T00:00:00.000Z',
                    googleId: '123',
                },
                two: {
                    firstName: 'ok',
                    lastName: 'Doe',
                    password: 'password456',
                    email: 'ok',
                    friends: [],
                    friendRequests: [],
                    birthday: '1995-05-04T00:00:00.000Z',
                    googleId: '5234553455',
                },
                three: {
                    firstName: 'Marry',
                    lastName: 'Christmas',
                    password: 'password90',
                    email: 'marry.christmas@example.com',
                    friends: [IDS.three],
                    friendRequests: [IDS.one],
                    birthday: '2000-03-09T00:00:00.000Z',
                },
            });
        }));
    });
    describe('Create fake posts', () => {
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
                yield models_1.Post.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('returns proper basic post when empty props provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const posts = yield TestUtils.createFakePosts({
                postOne: {},
                postTwo: {},
                postThree: {},
                postIds: TestUtils.CONSTANTS.POST_IDS,
                authorId: TestUtils.CONSTANTS.USER_IDS.one,
            });
            expect(typeof posts.one._id).toBe('string');
            expect(typeof posts.two._id).toBe('string');
            expect(typeof posts.three._id).toBe('string');
            expect(posts).toMatchObject({
                one: {
                    title: 'Testing',
                    body: 'Testing post number one',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    comments: [],
                    likes: [],
                },
                two: {
                    title: 'TesterPost',
                    body: 'Testing post number two',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    comments: [],
                    likes: [],
                },
                three: {
                    title: 'TesterPost',
                    body: 'Testing post number three',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    comments: [],
                    likes: [],
                },
            });
        }));
        test('returns proper custom posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const posts = yield TestUtils.createFakePosts({
                postOne: {
                    title: 'test',
                    body: 'test',
                    author: TestUtils.CONSTANTS.USER_IDS.two,
                    likes: [TestUtils.CONSTANTS.USER_IDS.three],
                },
                postTwo: {
                    title: 'ok',
                    body: 'ok',
                },
                postThree: {
                    author: TestUtils.CONSTANTS.USER_IDS.three,
                    likes: [
                        TestUtils.CONSTANTS.USER_IDS.one,
                        TestUtils.CONSTANTS.USER_IDS.three,
                    ],
                },
                postIds: TestUtils.CONSTANTS.POST_IDS,
                authorId: TestUtils.CONSTANTS.USER_IDS.one,
            });
            expect(typeof posts.one._id).toBe('string');
            expect(typeof posts.two._id).toBe('string');
            expect(typeof posts.three._id).toBe('string');
            expect(posts).toMatchObject({
                one: {
                    title: 'test',
                    body: 'test',
                    author: TestUtils.CONSTANTS.USER_IDS.two.toString(),
                    likes: [TestUtils.CONSTANTS.USER_IDS.three],
                },
                two: {
                    title: 'ok',
                    body: 'ok',
                },
                three: {
                    author: TestUtils.CONSTANTS.USER_IDS.three.toString(),
                    likes: [
                        TestUtils.CONSTANTS.USER_IDS.one,
                        TestUtils.CONSTANTS.USER_IDS.three,
                    ],
                },
            });
        }));
    });
    describe('Create fake comments', () => {
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
                yield models_1.Comment.deleteMany({});
                yield models_1.Post.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('returns proper basic comments when empty props provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const comments = yield (0, createFakeComments_1.default)({
                commentOne: {},
                commentTwo: {},
                commentThree: {},
                commentIds: TestUtils.CONSTANTS.COMMENT_IDS,
                postId: TestUtils.CONSTANTS.POST_IDS.one,
                authorId: TestUtils.CONSTANTS.USER_IDS.one,
            });
            expect(typeof comments.one._id).toBe('string');
            expect(typeof comments.two._id).toBe('string');
            expect(typeof comments.three._id).toBe('string');
            expect(comments).toMatchObject({
                one: {
                    body: 'Testing comment number one',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
                    likes: [],
                },
                two: {
                    body: 'Testing comment number two',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
                    likes: [],
                },
                three: {
                    body: 'Testing comment number three',
                    author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
                    likes: [],
                },
            });
        }));
        test('returns proper custom comments', () => __awaiter(void 0, void 0, void 0, function* () {
            const comments = yield (0, createFakeComments_1.default)({
                commentOne: {
                    body: 'test',
                    post: TestUtils.CONSTANTS.POST_IDS.two,
                    author: TestUtils.CONSTANTS.USER_IDS.two,
                    likes: [TestUtils.CONSTANTS.USER_IDS.two],
                },
                commentTwo: {
                    body: 'ok',
                },
                commentThree: {
                    author: TestUtils.CONSTANTS.USER_IDS.three,
                    post: TestUtils.CONSTANTS.POST_IDS.two,
                    likes: [
                        TestUtils.CONSTANTS.USER_IDS.one,
                        TestUtils.CONSTANTS.USER_IDS.three,
                    ],
                },
                commentIds: TestUtils.CONSTANTS.COMMENT_IDS,
                authorId: TestUtils.CONSTANTS.USER_IDS.one,
                postId: TestUtils.CONSTANTS.POST_IDS.one,
            });
            expect(typeof comments.one._id).toBe('string');
            expect(typeof comments.two._id).toBe('string');
            expect(typeof comments.three._id).toBe('string');
            expect(comments).toMatchObject({
                one: {
                    body: 'test',
                    post: TestUtils.CONSTANTS.POST_IDS.two.toString(),
                    author: TestUtils.CONSTANTS.USER_IDS.two.toString(),
                    likes: [TestUtils.CONSTANTS.USER_IDS.two],
                },
                two: {
                    body: 'ok',
                },
                three: {
                    author: TestUtils.CONSTANTS.USER_IDS.three.toString(),
                    post: TestUtils.CONSTANTS.POST_IDS.two.toString(),
                    likes: [
                        TestUtils.CONSTANTS.USER_IDS.one,
                        TestUtils.CONSTANTS.USER_IDS.three,
                    ],
                },
            });
        }));
    });
});
