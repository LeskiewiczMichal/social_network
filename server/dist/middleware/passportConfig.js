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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const bcrypt = __importStar(require("bcryptjs"));
const models_1 = require("../models");
if (!process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_CLIENT_CALLBACK) {
    throw new Error('Environment variables not defined');
}
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
// Normal authentication
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { error: 'Incorrect username' });
        }
        const result = yield bcrypt.compare(password, user.password);
        if (!result) {
            return done(null, false, { errror: 'Incorrect password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
// Token authentication
passport_1.default.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
}, (jwtPayload, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(jwtPayload.id);
        return cb(null, user);
    }
    catch (error) {
        return cb(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
}, function (accessToken, refreshToken, profile, done) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}));
// Facebook authentication
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: 'http://www.localhost:8080/api/users/auth/facebook/callback',
//     },
//     async function (
//       accessToken: string,
//       refreshToken: string,
//       profile: Profile,
//       done: any,
//     ) {
//       try {
//         const user = await User.findOne({ facebookId: profile.id });
//         if (!user) {
//           const newUser = new User({
//             email: profile.emails?.[0]?.value,
//             facebookId: profile.id,
//             firstName: profile.name?.givenName,
//             lastName: profile.name?.familyName,
//             birthday: profile.birthday,
//             friends: [],
//             posts: [],
//             friendRequests: [],
//           });
//           await newUser.save();
//           return done(null, newUser);
//         }
//         return done(null, user);
//       } catch (error: any) {
//         done(error);
//       }
//     },
//   ),
// );
const passportConfig = [passport_1.default.initialize()];
exports.default = passportConfig;
