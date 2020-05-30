import { Request, Response } from 'express';

export interface ContextInterface {
  req: Request;
  res: Response;
}
