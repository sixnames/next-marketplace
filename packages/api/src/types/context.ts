import { Request, Response } from 'express';
import { User } from '../entities/User';
import { ExecutionParams } from 'subscriptions-transport-ws';
import session from 'express-session';

export type AppRequest = Request & {
  session: session.Session &
    Partial<session.SessionData> & {
      user: User | null;
      userId: string | null;
      roleId: string | null;
      cartId: string | null;
    };
};

export interface ContextInterface {
  req: AppRequest;
  res: Response;
}

export interface ApolloContextInterface extends ContextInterface {
  connection?: ExecutionParams;
}
