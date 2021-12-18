import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import Title from 'components/Title';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

const ErrorPage: NextPage = () => {
  const router = useRouter();
  return (
    <Inner className='mt-8'>
      <Title>404 Страница не найдена</Title>
      <div className='flex'>
        <WpLink href={`/`}>На главную</WpLink>
        <div className='ml-4 cursor-pointer' onClick={() => router.back()}>
          Назад
        </div>
      </div>
    </Inner>
  );
};

export default ErrorPage;
