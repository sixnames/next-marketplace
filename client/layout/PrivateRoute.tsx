import React, { useEffect } from 'react';
import { useUserContext } from '../context/userContext';
import Router from 'next/router';
import { ROUTE_SIGN_IN } from '../config';
import { useAppContext } from '../context/appContext';

interface PrivateRouteInterface {
  children: any;
}

const PrivateRoute: React.FC<PrivateRouteInterface> = ({ children }) => {
  const { me } = useUserContext();
  const { hideLoading } = useAppContext();

  useEffect(() => {
    if (!me) {
      hideLoading();
      Router.replace(ROUTE_SIGN_IN);
    }
  }, [me, hideLoading]);

  return children;
};

export default PrivateRoute;
