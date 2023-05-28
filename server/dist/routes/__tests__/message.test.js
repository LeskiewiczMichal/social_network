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
const TestUtils = __importStar(require("../../__testUtils__"));
// Config test server
dotenv.config();
const app = (0, express_1.default)();
(0, middleware_1.serverConfig)(app);
app.use('/', __1.messageRouter);
const clearDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield TestUtils.deleteAllMessages();
});
describe('Comments route tests', () => {
    let users;
    let messages;
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
    describe('Querying messages', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            messages = yield TestUtils.createFakeMessages(Object.assign({}, TestUtils.CONSTANTS.DEFAULT_MESSAGES_PROPS));
        }));
        afterAll(clearDB);
        test('returns error when no friend/user id provided', (done) => {
            (0, supertest_1.default)(app)
                .get(`/`)
                .set('Authorization', `Bearer ${users.tokens.one}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    error: 'No user id or friend id provided',
                });
            })
                .expect(400, done);
        });
        test('returns messages on success', (done) => {
            (0, supertest_1.default)(app)
                .get(`/?friendId=${TestUtils.CONSTANTS.USER_IDS.one}`)
                .set('Authorization', `Bearer ${users.tokens.two}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    messages: [Object.assign({}, messages.one), Object.assign({}, messages.two)],
                });
            })
                .expect(200, done);
        });
        test('returns limited messages when query added', (done) => {
            (0, supertest_1.default)(app)
                .get(`/?friendId=${TestUtils.CONSTANTS.USER_IDS.one}&limit=1`)
                .set('Authorization', `Bearer ${users.tokens.two}`)
                .expect('Content-Type', /json/)
                .expect((res) => {
                expect(res.body).toMatchObject({
                    messages: [Object.assign({}, messages.one)],
                });
            })
                .expect(200, done);
        });
    });
});
