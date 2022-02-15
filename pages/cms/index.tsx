import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import AppContentWrapper from '../../components/layout/AppContentWrapper';
import ConsoleLayout from '../../components/layout/cms/ConsoleLayout';
import { getAppInitialData, GetAppInitialDataPropsInterface } from '../../lib/ssrUtils';

const Cms: NextPage<GetAppInitialDataPropsInterface> = ({ layoutProps }) => {
  return (
    <ConsoleLayout title={'CMS'} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>Cms</WpTitle>
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default Cms;
