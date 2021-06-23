import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Title from 'components/Title';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

const ErrorPage: NextPage = () => {
  const router = useRouter();
  return (
    <Inner className='mt-8'>
      <Title>404 Стараница не найдена</Title>
      <div className='flex'>
        <Link href={`/`}>На главную</Link>
        <div className='ml-4 cursor-pointer' onClick={() => router.back()}>
          Назад
        </div>
      </div>
    </Inner>
  );
};

export default ErrorPage;
