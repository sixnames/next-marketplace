import * as React from 'react';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const Cms: NextPage = () => {
  return (
    <AppLayout title={'CMS'}>
      <Inner>
        <Title>Cms</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Cms;
