import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import AppLayout from 'layout/AppLayout/AppLayout';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const CompanyShops: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Магазины компании'} pageUrls={pageUrls}>
      <Inner>
        <Title>Магазины компании</Title>
      </Inner>
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default CompanyShops;
