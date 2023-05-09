import passportJWT from 'passport-jwt';
import { UserInterface, User } from '../../models';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const JWToptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};
const jwtStrategy = new JWTStrategy(JWToptions, async (jwtPayload, cb) => {
  try {
    const user: UserInterface = (await User.findById(
      jwtPayload.id,
    )) as UserInterface;
    return cb(null, user);
  } catch (error) {
    return cb(error);
  }
});

export default jwtStrategy;
