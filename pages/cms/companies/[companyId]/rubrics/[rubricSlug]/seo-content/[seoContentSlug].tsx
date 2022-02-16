import ConsoleSeoContentDetails, {
  ConsoleSeoContentDetailsInterface,
} from 'components/console/ConsoleSeoContentDetails';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getConsoleRubricDetails } from 'db/ssr/rubrics/getConsoleRubricDetails';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import { alwaysString } from 'lib/arrayUtils';
import { CATALOGUE_SEO_TEXT_POSITION_TOP } from 'lib/config/common';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getSeoContentBySlug } from 'lib/seoContentUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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
  showSeoFields,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${routeBasePath}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      rubric={rubric}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <Inner>
        <ConsoleSeoContentDetails
          seoContent={seoContent}
          companySlug={companySlug}
          showSeoFields={showSeoFields}
        />
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
  const { props } = await getAppInitialData({ context });
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  if (!props) {
    return {
      notFound: true,
    };
  }

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const payload = await getConsoleRubricDetails({
    locale: props.sessionLocale,
    rubricSlug: `${query.rubricSlug}`,
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContent: castDbData(seoContent),
      routeBasePath: links.root,
      showSeoFields: seoContentSlug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1,
      companySlug,
    },
  };
};

export default RubricPage;
