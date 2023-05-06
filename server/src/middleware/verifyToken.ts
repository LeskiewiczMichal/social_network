import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserInterface } from '../models';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: any, user: UserInterface) => {
        if (err || !user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = user;
        next();
      },
    )(req, res);
  } catch (error: any) {
    return res.json({ error: error.message });
  }
};

export default verifyToken;
