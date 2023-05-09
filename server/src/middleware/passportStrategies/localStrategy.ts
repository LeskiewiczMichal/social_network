import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcryptjs';
import { User, UserInterface } from '../../models';

const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email: string, password: string, done: any) => {
    try {
      const user = (await User.findOne({ email })) as UserInterface;
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
);

export default localStrategy;
