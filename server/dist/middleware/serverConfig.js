"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const passportConfig_1 = __importDefault(require("./passportConfig"));
const serverConfig = (app) => {
    app.use((0, cors_1.default)());
    app.use(passportConfig_1.default);
    app.use(body_parser_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.default = serverConfig;
