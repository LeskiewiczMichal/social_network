"use strict";
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
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const models_1 = require("../../models");
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
const JWToptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
};
const jwtStrategy = new JWTStrategy(JWToptions, (jwtPayload, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield models_1.User.findById(jwtPayload.id));
        return cb(null, user);
    }
    catch (error) {
        return cb(error);
    }
}));
exports.default = jwtStrategy;
