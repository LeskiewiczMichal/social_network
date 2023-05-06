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
exports.login = exports.createAccount = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const models_1 = require("../models");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        if (!process.env.SECRET) {
            throw new Error('Secret environment variable not defined');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET);
        return res.json({ user, token });
    }
    catch (error) {
        return res.json({ error: error.message });
    }
});
exports.login = login;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email ||
        !req.body.password ||
        !req.body.birthday ||
        !req.body.firstName ||
        !req.body.lastName) {
        return res
            .status(400)
            .json({ error: 'Not all neccessery fields were provided' });
    }
    try {
        const hash = yield bcrypt.hash(req.body.password, 10);
        const user = new models_1.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            email: req.body.email,
            firends: [],
            posts: [],
            friendRequests: [],
            birthday: req.body.birthday,
        });
        yield user.save();
        return res.json({ user });
    }
    catch (error) {
        return res.json({ error: error.message });
    }
});
exports.createAccount = createAccount;
