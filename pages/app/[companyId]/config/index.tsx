import Inner from 'components/Inner/Inner';
import AppConfigsLayout from 'layout/AppLayout/AppConfigsLayout';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

const ConfigConsumer: React.FC = () => {
  return (
    <AppConfigsLayout>
      <Inner>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam modi officiis quasi
        sint vero. Consequatur consequuntur et, itaque iusto pariatur suscipit! Cumque eos excepturi
        maiores molestias quisquam! Eos, fugiat fugit!
      </Inner>
    </AppConfigsLayout>
  );
};

const Config: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Настройки сайта'} pageUrls={pageUrls}>
      <ConfigConsumer />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default Config;
