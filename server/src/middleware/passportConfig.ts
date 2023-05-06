import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJWT from 'passport-jwt';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { User, UserInterface } from '../models';

dotenv.config();
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
        const user = await User.findById(jwtPayload.id);
        return cb(null, user as UserInterface);
      } catch (error) {
        return cb(error);
      }
    },
  ),
);

const passportConfig = [passport.initialize()];
export default passportConfig;
