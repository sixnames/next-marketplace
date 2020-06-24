import { SessionOptions } from 'express-session';
import { IN_PROD } from './app';

const ONE_HOUR = 1000 * 60 * 60;
const SIX_HOURS = ONE_HOUR * 6;

const { env } = process;

export const { SESS_SECRET = 'please keep this secret, mate', SESS_NAME = 'sid' } = env;

export const SESS_ABSOLUTE_TIMEOUT = +(env.SESS_ABSOLUTE_TIMEOUT || SIX_HOURS);

export const SESS_OPTIONS: SessionOptions = {
  name: SESS_NAME,
  secret: SESS_SECRET,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    maxAge: +SESS_ABSOLUTE_TIMEOUT,
    sameSite: true,
    secure: IN_PROD,
  },
};
