import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import Title from 'components/Title/Title';
import { DEFAULT_CITY } from 'config/common';
import { NextPage } from 'next';
import * as React from 'react';

const ErrorPage: NextPage = () => {
  return (
    <Inner>
      <Title>404 Стараница не найдена</Title>
      <Link href={`/${DEFAULT_CITY}`}>На главную</Link>
    </Inner>
  );
};

export default ErrorPage;
