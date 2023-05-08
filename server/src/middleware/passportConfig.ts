import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import passportJWT from 'passport-jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserInterface } from '../models';

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CLIENT_CALLBACK
) {
  throw new Error('Environment variables not defined');
}
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Normal authentication
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done: any) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { error: 'Incorrect username' });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return done(null, false, { errror: 'Incorrect password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Token authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async (jwtPayload, cb) => {
      try {
        const user: UserInterface = (await User.findById(
          jwtPayload.id,
        )) as UserInterface;
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: any,
    ) {
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const newUser = new User({
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            friends: [],
            friendRequests: [],
          });

          await newUser.save();
          return done(null, newUser);
        }

        return done(null, user);
      } catch (error: any) {
        done(error);
      }
    },
  ),
);

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

const passportConfig = [passport.initialize()];
export default passportConfig;
