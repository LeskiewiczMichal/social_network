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
exports.loginGoogle = exports.authenticateUser = exports.login = exports.createAccount = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcryptjs"));
const types_1 = require("../types");
const models_1 = require("../models");
const utils_1 = require("../utils");
const login = (req, res) => {
    passport_1.default.authenticate('local', { session: false }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                throw new types_1.ErrorTypes.BadRequestError('Incorrect email or password');
            }
            if (!process.env.SECRET) {
                throw new Error('Secret environment variable not defined');
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET);
            return res.json({ user, token });
        }
        catch (error) {
            return (0, utils_1.handleError)(error, res);
        }
    }))(req, res);
};
exports.login = login;
const loginGoogle = (req, res) => {
    passport_1.default.authenticate('google', { session: false }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                throw new types_1.ErrorTypes.BadRequestError("Couldn't find google account");
            }
            if (!process.env.SECRET) {
                throw new Error('Secret environment variable not defined');
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET);
            return res.json({ user, token });
        }
        catch (error) {
            return (0, utils_1.handleError)(error, res);
        }
    }))(req, res);
};
exports.loginGoogle = loginGoogle;
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, birthday, firstName, lastName } = req.body;
        if (!email) {
            throw new types_1.ErrorTypes.MissingBodyError('email');
        }
        if (!password) {
            throw new types_1.ErrorTypes.MissingBodyError('password');
        }
        if (!birthday) {
            throw new types_1.ErrorTypes.MissingBodyError('birthday');
        }
        if (!firstName) {
            throw new types_1.ErrorTypes.MissingBodyError('firstName');
        }
        if (!lastName) {
            throw new types_1.ErrorTypes.MissingBodyError('lastName');
        }
        const hash = yield bcrypt.hash(password, 10);
        const user = new models_1.User({
            firstName,
            lastName,
            password: hash,
            email,
            firends: [],
            friendRequests: [],
            birthday,
        });
        yield user.save();
        return res.json({ user });
    }
    catch (error) {
        return (0, utils_1.handleError)(error, res);
    }
});
exports.createAccount = createAccount;
const authenticateUser = (req, res) => {
    const user = req.user;
    return res.json({ user });
};
exports.authenticateUser = authenticateUser;
