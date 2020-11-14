import { Request, Response } from 'express';
import { InitializedSession } from 'express-session';
import { User } from '../entities/User';
import { ExecutionParams } from 'subscriptions-transport-ws';

export type AppRequest = Request & {
  session: InitializedSession & {
    user: User | null;
    userId: string | null;
    roleId: string | null;
  };
};

export interface ContextInterface {
  req: AppRequest;
  res: Response;
}

export interface ApolloContextInterface extends ContextInterface {
  connection?: ExecutionParams;
}
