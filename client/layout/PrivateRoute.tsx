import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ROUTE_SIGN_IN } from '../config';
import Spinner from '../components/Spinner/Spinner';

interface PrivateRouteInterface {
  condition?: (pathname: string) => boolean;
}

const PrivateRoute: React.FC<PrivateRouteInterface> = ({ children, condition }) => {
  const [allow, setAllow] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (condition && condition(router.pathname)) {
      setAllow(true);
    }

    if (condition && !condition(router.pathname)) {
      router.replace(ROUTE_SIGN_IN);
    }
  }, [condition, router]);

  if (!allow) {
    return <Spinner wide />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
