import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from 'components/console/ConsoleSeoContentsList';
import Inner from 'components/Inner';
import { DEFAULT_COMPANY_SLUG, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CMS } from 'config/common';
import { COL_SEO_CONTENTS } from 'db/collectionNames';
import { getConsoleRubricDetails } from 'db/dao/rubric/getConsoleRubricDetails';
import { SeoContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface RubricDetailsInterface extends ConsoleSeoContentsListInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoContents: SeoContentModel[];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoContents, basePath }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: basePath,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleSeoContentsList seoContents={seoContents} basePath={basePath} />
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
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }
  const companySlug = DEFAULT_COMPANY_SLUG;

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

  const seoContents = await seoContentsCollection
    .find({
      companySlug,
      rubricSlug: payload.rubric.slug,
      content: {
        $ne: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    })
    .toArray();

  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContents: castDbData(seoContents),
      basePath: `${ROUTE_CMS}/rubrics/${payload.rubric._id}`,
      companySlug,
    },
  };
};

export default RubricPage;
