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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_io_client_1 = require("socket.io-client");
const TestUtils = __importStar(require("../../__testUtils__"));
const middleware_1 = require("../../middleware");
const EventHandlers = __importStar(require(".."));
const models_1 = require("../../models");
describe('User authentication handlers', () => {
    let io;
    let serverSocket;
    let clientSocket;
    let db;
    let users;
    // Config database and server
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dotenv.config();
            db = yield TestUtils.initializeMongoServer();
            users = yield TestUtils.createFakeUsers(TestUtils.CONSTANTS.DEFAULT_USERS_PROPS);
            const app = (0, express_1.default)();
            const httpServer = (0, http_1.createServer)(app);
            io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*',
                },
            });
            (0, middleware_1.serverConfig)(app);
            io.use(EventHandlers.authenticationHandler);
            io.on('connection', (socket) => {
                EventHandlers.registerChatHandlers(io, socket);
                EventHandlers.registerDisconnectHandlers(io, socket);
            });
            yield new Promise((resolve, reject) => {
                httpServer.listen(() => {
                    const { port } = httpServer.address();
                    io.on('connection', (socket) => {
                        serverSocket = socket;
                    });
                    clientSocket = new socket_io_client_1.Manager(`http://localhost:${port}`).socket('/', {
                        auth: { token: users.tokens.one },
                    });
                    clientSocket.on('connect', resolve);
                    clientSocket.on('connect-error', (error) => reject(error));
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        io.close();
        clientSocket.close();
    }));
    test('User in database has updated socketId when connected', (done) => {
        models_1.User.findById(TestUtils.CONSTANTS.USER_IDS.one)
            .then((user) => {
            if (user) {
                expect(user.socketId).not.toBeNull();
                done();
            }
            else {
                throw new Error('User not found');
            }
        })
            .catch((err) => {
            console.error(err);
            done(err);
        });
    });
    test('User in database socketId is null when disconnected', (done) => {
        clientSocket.close();
        setTimeout(() => {
            models_1.User.findById(TestUtils.CONSTANTS.USER_IDS.one)
                .then((user) => {
                if (user) {
                    expect(user.socketId).toBeNull();
                    done();
                }
                else {
                    throw new Error('User not found');
                }
            })
                .catch((err) => {
                console.error(err);
                done(err);
            });
        }, 500);
    });
});
