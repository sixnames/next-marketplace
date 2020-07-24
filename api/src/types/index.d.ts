import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      lang: string;
      city: string;
      defaultLang: string;
    }
  }
}
