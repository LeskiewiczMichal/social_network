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
app.use('/', __1.authRouter);
const userId = new mongoose_1.default.Types.ObjectId();
const mockUser = {
    _id: userId,
    email: 'test.user@example.com',
    firstName: 'Test',
    lastName: 'Surname',
    birthday: '1000-05-05T00:00:00.000Z',
    password: 'password123',
};
describe('Auth route tests', () => {
    let db;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            db = yield (0, mongoConfigTesting_1.default)();
            const user = new models_1.User(mockUser);
            yield user.save();
        }
        catch (error) {
            console.error(error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.stop();
    }));
    describe('Register user', () => {
        test('returns error on body not provided ', (done) => {
            (0, supertest_1.default)(app)
                .post('/')
                .expect('Content-Type', /json/)
                .expect({
                error: 'Not all neccessery fields were provided',
            })
                .expect(400, done);
        });
        test('successfull', (done) => {
            const requestBody = {
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                birthday: new Date('2000-01-01'),
                password: 'example123',
            };
            (0, supertest_1.default)(app)
                .post('/')
                .send(requestBody)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: {
                        email: 'john.doe@example.com',
                        firstName: 'John',
                        lastName: 'Doe',
                        birthday: '2000-01-01T00:00:00.000Z',
                        friends: [],
                        friendRequests: [],
                    },
                });
            })
                .expect(200, done);
        });
    });
    describe('Login', () => {
        test('returns error when wrong password provided', (done) => {
            const body = { email: 'test.user@example.com', password: 'password' };
            (0, supertest_1.default)(app)
                .post('/login')
                .send(body)
                .expect('Content-Type', /json/)
                .expect({ error: 'Incorrect email or password' })
                .expect(401, done);
        });
        test('returns token and user on success', (done) => {
            const body = { email: 'john.doe@example.com', password: 'example123' };
            (0, supertest_1.default)(app)
                .post('/login')
                .send(body)
                .expect('Content-Type', /json/)
                .expect((res) => {
                const { token, user } = res.body;
                expect(typeof token).toBe('string');
                expect(user).toMatchObject({
                    email: 'john.doe@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    birthday: '2000-01-01T00:00:00.000Z',
                    friends: [],
                    friendRequests: [],
                });
            })
                .expect(200, done);
        });
    });
    describe('Token authentication', () => {
        const token = jwt.sign({ id: userId }, process.env.SECRET);
        test('Returns 401 when token not provided', (done) => {
            (0, supertest_1.default)(app)
                .get('/token')
                .expect('Content-Type', /json/)
                .expect({ error: 'Unauthorized' })
                .expect(401, done);
        });
        test('Returns 401 when wrong token provided', (done) => {
            (0, supertest_1.default)(app)
                .get('/token')
                .set('Authorization', `Bearer WRONG${token}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Unauthorized' })
                .expect(401, done);
        });
        test('Returns user when proper token is provided', (done) => {
            (0, supertest_1.default)(app)
                .get('/token')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    user: {
                        email: 'test.user@example.com',
                        firstName: 'Test',
                        lastName: 'Surname',
                        birthday: '1000-05-05T00:00:00.000Z',
                        password: 'password123',
                    },
                });
            })
                .expect(200, done);
        });
    });
});
