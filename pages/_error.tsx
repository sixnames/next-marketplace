import { NextPage } from 'next';
import * as React from 'react';
import Error from 'next/error';
import Inner from '../components/Inner';
import { PagePropsInterface } from './_app';

const ErrorPage: NextPage<PagePropsInterface> = () => {
  return (
    <Inner>
      <Error statusCode={500} />
    </Inner>
  );
};

export default ErrorPage;
