"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passportStrategies_1 = require("./passportStrategies");
passport_1.default.use(passportStrategies_1.localStrategy);
passport_1.default.use(passportStrategies_1.jwtStrategy);
passport_1.default.use(passportStrategies_1.googleStrategy);
const passportConfig = [passport_1.default.initialize()];
exports.default = passportConfig;
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
