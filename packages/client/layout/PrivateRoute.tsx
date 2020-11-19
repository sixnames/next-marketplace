import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ROUTE_SIGN_IN } from '../config';
import Spinner from '../components/Spinner/Spinner';

interface PrivateRouteInterface {
  condition?: (pathname: string) => boolean;
  redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteInterface> = ({
  children,
  redirectPath = ROUTE_SIGN_IN,
  condition,
}) => {
  const [allow, setAllow] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const pathnameArr = router.pathname.split('/[');
    const realPathname = pathnameArr[0];

    if (condition && condition(realPathname)) {
      setAllow(true);
    }

    if (condition && !condition(realPathname)) {
      router.replace(redirectPath).catch((e) => console.log(e));
    }
  }, [condition, redirectPath, router]);

  if (!allow) {
    return <Spinner wide />;
  }

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
