import ConsoleSeoContentDetails, {
  ConsoleSeoContentDetailsInterface,
} from 'components/console/ConsoleSeoContentDetails';
import Inner from 'components/Inner';
import { ROUTE_CMS, ROUTE_CONSOLE } from 'config/common';
import { getConsoleRubricDetails } from 'db/dao/rubric/getConsoleRubricDetails';
import { RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { alwaysString } from 'lib/arrayUtils';
import { getSeoContentBySlug } from 'lib/seoContentUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';

interface RubricDetailsInterface extends ConsoleSeoContentDetailsInterface {
  rubric: RubricInterface;
  companySlug: string;
  routeBasePath: string;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoContent,
  routeBasePath,
  companySlug,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      basePath={routeBasePath}
      rubric={rubric}
      breadcrumbs={breadcrumbs}
    >
      <Inner>
        <ConsoleSeoContentDetails seoContent={seoContent} companySlug={companySlug} />
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricPageInterface extends GetAppInitialDataPropsInterface, RubricDetailsInterface {}

const RubricPage: NextPage<RubricPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);
  const companySlug = props.layoutProps.pageCompany.slug;

  const payload = await getConsoleRubricDetails({
    locale: props.sessionLocale,
    rubricId: `${query.rubricId}`,
    companySlug,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  const seoContent = await getSeoContentBySlug({
    url,
    seoContentSlug,
    companySlug,
    rubricSlug: payload.rubric.slug,
  });
  if (!seoContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContent: castDbData(seoContent),
      routeBasePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}`,
      companySlug,
    },
  };
};

export default RubricPage;