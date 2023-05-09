import passport from 'passport';
import {
  googleStrategy,
  jwtStrategy,
  localStrategy,
} from './passportStrategies';

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);

const passportConfig = [passport.initialize()];
export default passportConfig;

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
