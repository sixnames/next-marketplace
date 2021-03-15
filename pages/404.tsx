import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { NextPage } from 'next';
import * as React from 'react';

const ErrorPage: NextPage = () => {
  return (
    <Inner>
      <Title>Page not found</Title>
    </Inner>
  );
};

export default ErrorPage;
