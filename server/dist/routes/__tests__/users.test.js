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
const userId = new mongoose_1.default.Types.ObjectId();
const usersExample = [
    {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('1990-01-01'),
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'password456',
        email: 'jane.doe@example.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('1995-05-04'),
        googleId: '5234553455',
    },
    {
        firstName: 'Marry',
        lastName: 'Christmas',
        password: 'password90',
        email: 'marry.christmas@example.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
    },
];
describe('Users route tests', () => {
    let db;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            db = yield (0, mongoConfigTesting_1.default)();
            yield models_1.User.insertMany(usersExample);
            token = jwt.sign({ id: userId }, process.env.SECRET, {
                expiresIn: '1h',
            });
        }
        catch (error) {
            console.error(error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.stop();
    }));
    describe('Querying users', () => {
        test('Get all users', (done) => {
            (0, supertest_1.default)(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    users: [
                        {
                            firstName: 'John',
                            lastName: 'Doe',
                            password: 'password123',
                            email: 'john.doe@example.com',
                            friends: [],
                            friendRequests: [],
                            birthday: '1990-01-01T00:00:00.000Z',
                        },
                        {
                            firstName: 'Jane',
                            lastName: 'Doe',
                            password: 'password456',
                            email: 'jane.doe@example.com',
                            friends: [],
                            friendRequests: [],
                            birthday: '1995-05-04T00:00:00.000Z',
                            googleId: '5234553455',
                        },
                        {
                            firstName: 'Marry',
                            lastName: 'Christmas',
                            password: 'password90',
                            email: 'marry.christmas@example.com',
                            friends: [],
                            friendRequests: [],
                            birthday: '2000-03-09T00:00:00.000Z',
                        },
                    ],
                });
            })
                .expect(200, done);
        });
        test('Get single user by id', (done) => {
            (0, supertest_1.default)(app)
                .get(`/${userId}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: {
                        firstName: 'John',
                        lastName: 'Doe',
                        password: 'password123',
                        email: 'john.doe@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: '1990-01-01T00:00:00.000Z',
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Update user data', () => {
        test('should return status 401 when JWT not provided', (done) => {
            (0, supertest_1.default)(app).put('/').expect(401, done);
        });
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
                        password: 'password123',
                        email: 'john@example.com',
                        friends: [],
                        friendRequests: [],
                        birthday: '2000-01-01T00:00:00.000Z',
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Delete user', () => {
        test('should return status 401 when JWT not provided', (done) => {
            (0, supertest_1.default)(app).delete('/').expect(401, done);
        });
        test('should delete user when verified', (done) => {
            (0, supertest_1.default)(app)
                .delete('/')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect({ message: 'User deleted succesfully' })
                .expect(200, () => {
                models_1.User.findById(userId)
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
});
