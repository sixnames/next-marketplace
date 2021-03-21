import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import Title from 'components/Title/Title';
import { NextPage } from 'next';
import * as React from 'react';

const ErrorPage: NextPage = () => {
  return (
    <Inner>
      <Title>404 Стараница не найдена</Title>
      <Link href={`/`}>На главную</Link>
    </Inner>
  );
};

export default ErrorPage;
