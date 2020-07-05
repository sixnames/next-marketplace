import { ServerResponse } from 'http';
import { ROUTE_SIGN_IN, ROUTE_TEMPORARY_REDIRECT_CODE } from '../config';

const privateRouteHandler = (res: ServerResponse) => {
  res.statusCode = ROUTE_TEMPORARY_REDIRECT_CODE;
  res.setHeader('Location', ROUTE_SIGN_IN);
};

export default privateRouteHandler;
