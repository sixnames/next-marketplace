import Inner from 'components/Inner';
import { NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Error from 'next/error';

const ErrorPage: NextPage<PagePropsInterface> = () => {
  return (
    <Inner>
      <Error statusCode={500} />
    </Inner>
  );
};

export default ErrorPage;
