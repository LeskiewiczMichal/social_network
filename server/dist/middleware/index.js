"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportConfig = exports.mongoConfig = void 0;
const mongoConfig_1 = __importDefault(require("./mongoConfig"));
exports.mongoConfig = mongoConfig_1.default;
const passportConfig_1 = __importDefault(require("./passportConfig"));
exports.passportConfig = passportConfig_1.default;
