import AppContentWrapper from 'layout/AppContentWrapper';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner';
import Title from 'components/Title';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const Cms: NextPage<PagePropsInterface> = ({ layoutProps }) => {
  return (
    <ConsoleLayout title={'CMS'} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <Title>Cms</Title>
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default Cms;
