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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const middleware_1 = require("./middleware");
const routes_1 = require("./routes");
const handlers_1 = require("./handlers");
dotenv.config();
(0, middleware_1.mongoConfig)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
(0, middleware_1.serverConfig)(app);
io.use(handlers_1.authenticationHandler);
io.on('connection', (socket) => {
    (0, handlers_1.registerChatHandlers)(io, socket);
    (0, handlers_1.registerDisconnectHandlers)(io, socket);
});
app.use('/profile-pictures', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
    res.send('Welcome');
});
app.use('/api/users/auth', routes_1.authRouter);
app.use('/api/users', routes_1.usersRouter);
app.use('/api/posts', routes_1.postsRouter);
app.use('/api/comments', routes_1.commentsRouter);
httpServer.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
