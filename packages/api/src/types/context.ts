import { Request as ExpressRequest, Response } from 'express';

export interface Request extends ExpressRequest{
  city: string
}

export interface ContextInterface {
  req: Request;
  res: Response;
}
