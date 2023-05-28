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
Object.defineProperty(exports, "__esModule", { value: true });
const TestUtils = __importStar(require("../../__testUtils__"));
const models_1 = require("../../models");
describe('Chat handlers', () => {
    let io;
    let serverSocket;
    let clientSocket;
    let db;
    let users;
    // Config database and server
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const server = yield TestUtils.setupSocketServer();
        io = server.io;
        serverSocket = server.serverSocket;
        clientSocket = server.clientSocket;
        db = server.db;
        users = server.users;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        io.close();
        clientSocket.close();
    }));
    test('Sending and receiving messages', (done) => {
        clientSocket.on('message-received', (msg) => {
            try {
                expect(msg).toMatchObject({
                    body: 'test',
                    sender: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                    receiver: TestUtils.CONSTANTS.USER_IDS.one.toString(),
                });
                done();
            }
            catch (err) {
                console.error(err);
                done(err);
            }
        });
        clientSocket.emit('send-message', {
            body: 'test',
            receiver: TestUtils.CONSTANTS.USER_IDS.one,
            sender: TestUtils.CONSTANTS.USER_IDS.one,
        });
    });
    test('creates new message in database', (done) => {
        clientSocket.on('message-received', (msg) => {
            try {
                models_1.Message.findById(msg._id).then((message) => {
                    if (message) {
                        expect(message).toMatchObject({
                            body: 'test',
                            sender: TestUtils.CONSTANTS.USER_IDS.one,
                            receiver: TestUtils.CONSTANTS.USER_IDS.one,
                        });
                        done();
                    }
                    else {
                        throw new Error('Message not found in database');
                    }
                });
            }
            catch (err) {
                console.error(err);
                done(err);
            }
        });
        clientSocket.emit('send-message', {
            body: 'test',
            receiver: TestUtils.CONSTANTS.USER_IDS.one,
            sender: TestUtils.CONSTANTS.USER_IDS.one,
        });
    });
});
