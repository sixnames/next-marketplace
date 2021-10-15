import AppContentWrapper from 'layout/AppContentWrapper';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner';
import Title from 'components/Title';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const Cms: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout title={'CMS'} pageUrls={pageUrls}>
      <AppContentWrapper>
        <Inner>
          <Title>Cms</Title>
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default Cms;
