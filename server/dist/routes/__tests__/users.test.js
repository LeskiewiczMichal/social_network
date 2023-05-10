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
const __testUtils__1 = require("../../__testUtils__");
// Config test server
dotenv.config();
const app = (0, express_1.default)();
(0, middleware_1.serverConfig)(app);
app.use('/', __1.usersRouter);
describe('Users route tests', () => {
    let users;
    let db;
    let errorSpy; // This disables console error
    // Set up database
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        try {
            db = yield (0, __testUtils__1.initializeMongoServer)();
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
    describe('Querying users', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            users = yield (0, __testUtils__1.createFakeUsers)(__testUtils__1.TEST_CONSTANTS.DEFAULT_USERS_PROPS);
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('Get all users', (done) => {
            (0, supertest_1.default)(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: [users.one, users.two, users.three],
                });
            })
                .expect(200, done);
        });
        test('Get single user by id', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${__testUtils__1.TEST_CONSTANTS.USER_IDS.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: users.one,
                });
            })
                .expect(200, done);
        });
        test("returns status 404 if user with given id doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .get('/000')
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
    });
    describe('Update user data', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)(__testUtils__1.TEST_CONSTANTS.DEFAULT_USERS_PROPS);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('should update user data when verified', (done) => {
            const requestBody = {
                email: 'john@example.com',
                firstName: 'test',
                lastName: 'test',
                birthday: new Date('2000-01-01'),
            };
            (0, supertest_1.default)(app)
                .put('/')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .send(requestBody)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: {
                        firstName: 'test',
                        lastName: 'test',
                        email: 'john@example.com',
                        birthday: '2000-01-01T00:00:00.000Z',
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Delete user', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)(__testUtils__1.TEST_CONSTANTS.DEFAULT_USERS_PROPS);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('should delete user when verified', (done) => {
            (0, supertest_1.default)(app)
                .delete('/')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'User deleted succesfully' })
                .expect(200, () => {
                models_1.User.findById(users.one._id)
                    .then((docs) => {
                    expect(docs).toBeNull();
                    done();
                })
                    .catch((err) => {
                    console.error(err);
                    done(err);
                });
            });
        });
    });
    describe('Get friends', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: {
                        friends: [
                            __testUtils__1.TEST_CONSTANTS.USER_IDS.two,
                            __testUtils__1.TEST_CONSTANTS.USER_IDS.three,
                        ],
                    },
                    userTwo: {},
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('return empty array when user has no friends', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${users.three._id}/friends`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: [],
                });
            })
                .expect(200, done);
        });
        test("get all user's friends", (done) => {
            (0, supertest_1.default)(app)
                .get(`/${users.one._id}/friends`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: [users.two, users.three],
                });
            })
                .expect(200, done);
        });
    });
    describe('Add friend', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: {
                        friendRequests: [__testUtils__1.TEST_CONSTANTS.USER_IDS.two],
                    },
                    userTwo: {},
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test("returns 404 if the user doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/000`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test("returns 400 if the user isn't on friendRequests list", (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/${users.one._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: "User was not on friend's requests list" })
                .expect(400, done);
        });
        test('success', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/${users.two._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    message: 'Friend added successfully',
                    user: {
                        friends: [`${users.two._id}`],
                        friendRequests: [],
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Delete friend', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: {
                        friends: [__testUtils__1.TEST_CONSTANTS.USER_IDS.two],
                    },
                    userTwo: {},
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test("delete friend returns 404 if the user doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .delete('/friends/000')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test('delete friend returns 400 if users were not friends', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friends/${users.one._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: "User's were not friends" })
                .expect(400, done);
        });
        test('delete friend from user', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friends/${users.two._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    message: 'Friend deleted successfully',
                    user: {
                        friends: [],
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Get friend requests', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: {
                        friendRequests: [
                            __testUtils__1.TEST_CONSTANTS.USER_IDS.two,
                            __testUtils__1.TEST_CONSTANTS.USER_IDS.three,
                        ],
                    },
                    userTwo: { friendRequests: [] },
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('returns empty list on success', (done) => {
            (0, supertest_1.default)(app)
                .get('/friendRequests')
                .set('Authorization', `Bearer ${users.tokens.two}`)
                .expect('Content-Type', /json/)
                .expect({ friendRequests: [] })
                .expect(200, done);
        });
        test('returns list of people on success', (done) => {
            (0, supertest_1.default)(app)
                .get('/friendRequests')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    friendRequests: [users.two, users.three],
                });
            })
                .expect(200, done);
        });
    });
    describe('Send friend requests', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: {},
                    userTwo: { friendRequests: [__testUtils__1.TEST_CONSTANTS.USER_IDS.one] },
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('returns status 404 on wrong userId provided', (done) => {
            (0, supertest_1.default)(app)
                .post('/friendRequests/000')
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test('returns 400 if friend request was already sent', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friendRequests/${users.two._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Friend request was already sent' })
                .expect(400, done);
        });
        test('return message on success', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friendRequests/${users.three._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'Friend request was sent successfully' })
                .expect(200, done);
        });
    });
    describe('Delete friend request', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                users = yield (0, __testUtils__1.createFakeUsers)({
                    userOne: { friendRequests: [__testUtils__1.TEST_CONSTANTS.USER_IDS.two] },
                    userTwo: {},
                    userThree: {},
                    ids: __testUtils__1.TEST_CONSTANTS.USER_IDS,
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(__testUtils__1.deleteAllUsers);
        test('returns 404 if wrong userId provided', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friendRequests/000`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test('returns 404 if friend request not found', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friendRequests/${users.three._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Not found' })
                .expect(404, done);
        });
        test('returns message and friend requests on success', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friendRequests/${users.two._id}`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((req) => {
                expect(req.body).toMatchObject({
                    message: 'Friend request deleted',
                    user: { friendRequests: [] },
                });
            })
                .expect(200, done);
        });
    });
});
