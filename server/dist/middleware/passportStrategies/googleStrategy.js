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
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = require("passport-google-oauth20");
// import * as dotenv from 'dotenv';
const models_1 = require("../../models");
// dotenv.config();
if (!process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CLIENT_CALLBACK) {
    throw new Error('Environment variables not defined');
}
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
};
const googleStrategy = new passport_google_oauth20_1.Strategy(googleOptions, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const user = yield models_1.User.findOne({ googleId: profile.id });
        if (!user) {
            const newUser = new models_1.User({
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                googleId: profile.id,
                firstName: (_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName,
                lastName: (_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName,
                friends: [],
                friendRequests: [],
            });
            yield newUser.save();
            return done(null, newUser);
        }
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
exports.default = googleStrategy;
