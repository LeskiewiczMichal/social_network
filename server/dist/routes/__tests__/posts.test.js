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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const __1 = require("..");
const middleware_1 = require("../../middleware");
const models_1 = require("../../models");
const TestUtils = __importStar(require("../../__testUtils__"));
// Config test server
dotenv.config();
const app = (0, express_1.default)();
(0, middleware_1.serverConfig)(app);
app.use('/', __1.postsRouter);
const clearDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield TestUtils.deleteAllPosts();
    yield TestUtils.deleteAllComments();
});
describe('Posts route tests', () => {
    let posts;
    let users;
    let db;
    let errorSpy; // This disables console error
    // Set up database
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        try {
            db = yield TestUtils.initializeMongoServer();
            users = yield TestUtils.createFakeUsers(TestUtils.CONSTANTS.DEFAULT_USERS_PROPS);
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
    describe('Querying posts', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                posts = yield TestUtils.createFakePosts(TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(clearDB);
        test('Get all posts', (done) => {
            (0, supertest_1.default)(app)
                .get('/')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    posts: [
                        Object.assign(Object.assign({}, posts.one), { author: users.one }),
                        Object.assign(Object.assign({}, posts.two), { author: users.one }),
                        Object.assign(Object.assign({}, posts.three), { author: users.one }),
                    ],
                });
            })
                .expect(200, done);
        });
        test('Get single post by id', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    post: posts.one,
                });
            })
                .expect(200, done);
        });
        test("returns status 404 if post with given id doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .get('/000')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
    });
    describe('Create post', () => {
        afterAll(clearDB);
        test('returns status 400 on body not provided', (done) => {
            (0, supertest_1.default)(app)
                .post('/')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Missing required body field: title' })
                .expect(400, done);
        });
        test('returns post on success', (done) => {
            const requestBody = {
                title: 'Testing',
                body: 'This post is for testing',
                author: TestUtils.CONSTANTS.USER_IDS.one,
            };
            (0, supertest_1.default)(app)
                .post('/')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .send(requestBody)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    post: {
                        title: 'Testing',
                        body: 'This post is for testing',
                        author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Update post', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                posts = yield TestUtils.createFakePosts(TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(clearDB);
        test("returns status 401 if user is not post's creator", (done) => {
            const requestBody = { title: 'Modified', body: 'modified' };
            (0, supertest_1.default)(app)
                .put(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.two}`)
                .send(requestBody)
                .expect('Content-Type', /json/)
                .expect({ error: 'Unauthorized' })
                .expect(401, done);
        });
        test('returns status 404 if post is not found', (done) => {
            (0, supertest_1.default)(app)
                .put('/000')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test('returns modified post on success', (done) => {
            const requestBody = { title: 'Modified', body: 'modified' };
            (0, supertest_1.default)(app)
                .put(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .send(requestBody)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    post: {
                        title: 'Modified',
                        body: 'modified',
                    },
                });
            })
                .expect(200, done);
        });
        test('post liking functionality', (done) => {
            (0, supertest_1.default)(app)
                .put(`/${TestUtils.CONSTANTS.POST_IDS.one}?like=${users.one._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    post: {
                        likes: [users.one._id],
                    },
                });
            })
                .expect(200, done);
        });
        test('posts disliking', (done) => {
            (0, supertest_1.default)(app)
                .put(`/${TestUtils.CONSTANTS.POST_IDS.one}?like=${users.one._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    post: {
                        likes: [],
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Delete posts', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                posts = yield TestUtils.createFakePosts(TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(clearDB);
        test("returns status 401 if user is not post's creator", (done) => {
            (0, supertest_1.default)(app)
                .delete(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.two}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Unauthorized' })
                .expect(401, done);
        });
        test('returns status 404 if post is not found', (done) => {
            (0, supertest_1.default)(app)
                .delete('/000')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test("deletes all post's comments", (done) => {
            (0, supertest_1.default)(app)
                .delete(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect(200, () => {
                models_1.Comment.find({ post: TestUtils.CONSTANTS.POST_IDS.one })
                    .then((docs) => {
                    expect(docs).toHaveLength(0);
                    done();
                })
                    .catch((error) => {
                    console.error(error);
                    done(error);
                });
            });
        });
        test('returns message on success', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/${TestUtils.CONSTANTS.POST_IDS.two}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'Post deleted successfully' })
                .expect(200, done);
        });
    });
});
