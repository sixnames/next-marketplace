import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { PassportContext } from 'graphql-passport';
import { User } from '../entities/User';
import { SignInInput } from '../resolvers/user/SignInInput';

export type ContextInterface = PassportContext<User, SignInInput, ExpressRequest> & {
  res: ExpressResponse;
};
