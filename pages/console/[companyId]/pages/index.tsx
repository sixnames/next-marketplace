import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import PageGroupsList, {
  PageGroupsListInterface,
} from '../../../../components/Pages/PageGroupsList';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../config/common';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getPageGroupsSsr } from '../../../../lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({ layoutProps, pagesGroups }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{pageTitle}</WpTitle>
          <PageGroupsList
            companySlug={`${layoutProps.pageCompany.slug}`}
            basePath={`${ROUTE_CONSOLE}/${layoutProps.pageCompany._id}/pages`}
            pagesGroups={pagesGroups}
          />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const pagesGroups = await getPageGroupsSsr({
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
    },
  };
};

export default PageGroupsPage;
