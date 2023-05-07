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
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = __importStar(require("jsonwebtoken"));
const __1 = require("..");
const middleware_1 = require("../../middleware");
const mongoConfigTesting_1 = __importDefault(require("./mongoConfigTesting"));
const models_1 = require("../../models");
dotenv.config();
const app = (0, express_1.default)();
(0, middleware_1.serverConfig)(app);
app.use('/', __1.usersRouter);
const userIdOne = new mongoose_1.default.Types.ObjectId();
const userIdTwo = new mongoose_1.default.Types.ObjectId();
const userIdThree = new mongoose_1.default.Types.ObjectId();
const usersExample = [
    {
        _id: userIdOne,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        friends: [`${userIdTwo}`, `${userIdThree}`],
        friendRequests: [],
        birthday: new Date('1990-01-01'),
    },
    {
        _id: userIdTwo,
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'password456',
        email: 'jane.doe@example.com',
        friends: [],
        friendRequests: [`${userIdOne}`, `${userIdThree}`],
        birthday: new Date('1995-05-04'),
        googleId: '5234553455',
    },
    {
        _id: userIdThree,
        firstName: 'Marry',
        lastName: 'Christmas',
        password: 'password90',
        email: 'marry.christmas@example.com',
        friends: [],
        friendRequests: [`${userIdOne}`],
        birthday: new Date('2000-03-09'),
    },
];
const EXPECTED_USERS = [
    {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        friends: [`${userIdTwo}`, `${userIdThree}`],
        friendRequests: [],
        birthday: '1990-01-01T00:00:00.000Z',
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'password456',
        email: 'jane.doe@example.com',
        friends: [],
        friendRequests: [`${userIdOne}`, `${userIdThree}`],
        birthday: '1995-05-04T00:00:00.000Z',
        googleId: '5234553455',
    },
    {
        firstName: 'Marry',
        lastName: 'Christmas',
        password: 'password90',
        email: 'marry.christmas@example.com',
        friends: [],
        friendRequests: [`${userIdOne}`],
        birthday: '2000-03-09T00:00:00.000Z',
    },
];
describe('Users route tests', () => {
    let db;
    let token;
    let errorSpy; // This disables console error
    // Set up database
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        try {
            db = yield (0, mongoConfigTesting_1.default)();
            token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                expiresIn: '1h',
            });
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
            try {
                yield models_1.User.insertMany(usersExample);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('Get all users', (done) => {
            (0, supertest_1.default)(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: EXPECTED_USERS,
                });
            })
                .expect(200, done);
        });
        test('Get single user by id', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${userIdOne}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: EXPECTED_USERS[0],
                });
            })
                .expect(200, done);
        });
        test("returns status 404 if user with given id doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .get('/000')
                .expect('Content-Type', /json/)
                .expect({ error: 'User not found' })
                .expect(404, done);
        });
    });
    describe('Update user data', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.insertMany(usersExample);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('should update user data when verified', (done) => {
            const requestBody = {
                email: 'john@example.com',
                firstName: 'test',
                lastName: 'test',
                birthday: new Date('2000-01-01'),
            };
            (0, supertest_1.default)(app)
                .put('/')
                .set('Authorization', `Bearer ${token}`)
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
                yield models_1.User.insertMany(usersExample);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('should delete user when verified', (done) => {
            (0, supertest_1.default)(app)
                .delete('/')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'User deleted succesfully' })
                .expect(200, () => {
                models_1.User.findById(userIdOne)
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
                yield models_1.User.insertMany(usersExample);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('return empty array when user has no friends', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${userIdThree}/friends`)
                .set('Authorization', `Bearer ${token}`)
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
                .get(`/${userIdOne}/friends`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: [EXPECTED_USERS[1], EXPECTED_USERS[2]],
                });
            })
                .expect(200, done);
        });
    });
    describe('Add friend', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.insertMany([
                    {
                        _id: userIdOne,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [`${userIdTwo}`],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdTwo,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [`${userIdTwo}`],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                ]);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test("returns 404 if the user doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/000`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'User not found' })
                .expect(404, done);
        });
        test("returns 404 if the user isn't on friendRequests list", (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/${userIdOne}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: "User was not on friend's requests list" })
                .expect(404, done);
        });
        test('success', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friends/${userIdTwo}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    message: 'Friend added successfully',
                    user: {
                        friends: [`${userIdTwo}`],
                        friendRequests: [],
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Delte friend', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.insertMany([
                    {
                        _id: userIdOne,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [`${userIdTwo}`],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdTwo,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [`${userIdOne}`],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                ]);
                token = jwt.sign({ id: userIdOne }, process.env.SECRET, {
                    expiresIn: '1h',
                });
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test("delete friend returns 404 if the user doesn't exist", (done) => {
            (0, supertest_1.default)(app)
                .delete('/friends/000')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'User not found' })
                .expect(404, done);
        });
        test('delete friend returns 404 if users were not friends', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friends/${userIdOne}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: "User's were not friends" })
                .expect(404, done);
        });
        test('delete friend from user', (done) => {
            (0, supertest_1.default)(app)
                .delete(`/friends/${userIdTwo}`)
                .set('Authorization', `Bearer ${token}`)
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
    describe('Send friend requests', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.insertMany([
                    {
                        _id: userIdOne,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdTwo,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [userIdOne],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdThree,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                ]);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('returns status 404 on wrong userId provided', (done) => {
            (0, supertest_1.default)(app)
                .get('/friendRequests')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('Send friend requests', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.insertMany([
                    {
                        _id: userIdOne,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdTwo,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [userIdOne],
                        birthday: new Date('1990-01-01'),
                    },
                    {
                        _id: userIdThree,
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: new Date('1990-01-01'),
                    },
                ]);
            }
            catch (error) {
                console.error(error);
            }
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield models_1.User.deleteMany({});
            }
            catch (error) {
                console.error(error);
            }
        }));
        test('returns status 404 on wrong userId provided', (done) => {
            (0, supertest_1.default)(app)
                .post('/friendRequests/000')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'User not found' })
                .expect(404, done);
        });
        test('returns 400 if friend request was already sent', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friendRequests/${userIdTwo}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Friend request was already sent' })
                .expect(400, done);
        });
        test('return message on success', (done) => {
            (0, supertest_1.default)(app)
                .post(`/friendRequests/${userIdThree}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'Friend request was sent successfully' })
                .expect(200, done);
        });
    });
});
