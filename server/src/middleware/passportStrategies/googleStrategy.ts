import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
// import * as dotenv from 'dotenv';
import { User } from '../../models';

// dotenv.config();
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CLIENT_CALLBACK
) {
  throw new Error('Environment variables not defined');
}

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
};

const googleStrategy = new GoogleStrategy(
  googleOptions,
  async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) => {
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
);

export default googleStrategy;
