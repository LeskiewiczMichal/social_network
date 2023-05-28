"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFriendHandlers = exports.registerDisconnectHandlers = exports.registerChatHandlers = exports.authenticationHandler = void 0;
const authenticationHandler_1 = __importDefault(require("./authenticationHandler"));
exports.authenticationHandler = authenticationHandler_1.default;
const chatHandler_1 = __importDefault(require("./chatHandler/chatHandler"));
exports.registerChatHandlers = chatHandler_1.default;
const disconnectionHandler_1 = __importDefault(require("./disconnectionHandler"));
exports.registerDisconnectHandlers = disconnectionHandler_1.default;
const friendHandlers_1 = __importDefault(require("./friendHandler/friendHandlers"));
exports.registerFriendHandlers = friendHandlers_1.default;
