import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getCmsSsrProps } from 'lib/ssrUtils';

const Cms: NextPage = () => {
  return (
    <AppLayout title={'CMS'}>
      <Inner>
        <Title>Cms</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = getCmsSsrProps;

export default Cms;
