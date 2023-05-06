"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Post = exports.User = void 0;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const post_1 = __importDefault(require("./post"));
exports.Post = post_1.default;
const comment_1 = __importDefault(require("./comment"));
exports.Comment = comment_1.default;
