import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import WpTitle from 'components/WpTitle';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import { getPageGroupsSsr } from 'lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({ layoutProps, pagesGroups }) => {
  const links = getConsoleCompanyLinks({
    companyId: layoutProps.pageCompany._id,
  });
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{pageTitle}</WpTitle>
          <PageGroupsList
            companySlug={`${layoutProps.pageCompany.slug}`}
            basePath={links.pages.parentLink}
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
