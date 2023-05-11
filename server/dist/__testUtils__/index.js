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
exports.CONSTANTS = exports.createFakeComments = exports.deleteAllComments = exports.createFakePosts = exports.deleteAllPosts = exports.createFakeUsers = exports.initializeMongoServer = exports.deleteAllUsers = void 0;
const deleteAllUsers_1 = __importDefault(require("./deleteAllUsers"));
exports.deleteAllUsers = deleteAllUsers_1.default;
const mongoConfigTesting_1 = __importDefault(require("./mongoConfigTesting"));
exports.initializeMongoServer = mongoConfigTesting_1.default;
const createFakeUsers_1 = __importDefault(require("./createFakeUsers"));
exports.createFakeUsers = createFakeUsers_1.default;
const createFakePosts_1 = __importDefault(require("./createFakePosts"));
exports.createFakePosts = createFakePosts_1.default;
const createFakeComments_1 = __importDefault(require("./createFakeComments"));
exports.createFakeComments = createFakeComments_1.default;
const deleteAllPosts_1 = __importDefault(require("./deleteAllPosts"));
exports.deleteAllPosts = deleteAllPosts_1.default;
const deleteAllComments_1 = __importDefault(require("./deleteAllComments"));
exports.deleteAllComments = deleteAllComments_1.default;
const CONSTANTS = __importStar(require("./constants"));
exports.CONSTANTS = CONSTANTS;
