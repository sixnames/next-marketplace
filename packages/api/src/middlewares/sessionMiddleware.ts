import session from 'express-session';
import connectMongo from 'connect-mongo';
import { SESS_OPTIONS } from '../config';

const MongoStore = connectMongo(session);

export const sessionMiddleware = (req: any, res: any, next: any) => {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  });
  return session({
    store: mongoStore,
    ...SESS_OPTIONS,
  })(req, res, next);
};
