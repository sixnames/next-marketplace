// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      lang: string;
      city: string;
      defaultLang: string;
      roleRules: any[];
    }
  }
}
