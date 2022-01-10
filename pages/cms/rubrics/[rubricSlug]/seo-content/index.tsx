import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from '../../../../../components/console/ConsoleSeoContentsList';
import Inner from '../../../../../components/Inner';
import {
  DEFAULT_COMPANY_SLUG,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CMS,
} from '../../../../../config/common';
import { COL_SEO_CONTENTS } from '../../../../../db/collectionNames';
import { getConsoleRubricDetails } from '../../../../../db/dao/rubrics/getConsoleRubricDetails';
import { SeoContentModel } from '../../../../../db/dbModels';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, RubricInterface } from '../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getConsoleRubricLinks } from '../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface RubricDetailsInterface extends ConsoleSeoContentsListInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoContents: SeoContentModel[];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoContents,
  routeBasePath,
  rubricSlug,
}) => {
  const { parentLink, root } = getConsoleRubricLinks({
    rubricSlug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Рубрикатор',
        href: parentLink,
      },
      {
        name: `${rubric.name}`,
        href: root,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleSeoContentsList
          seoContents={seoContents}
          routeBasePath={routeBasePath}
          rubricSlug={rubricSlug}
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
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }
  const companySlug = DEFAULT_COMPANY_SLUG;

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
      routeBasePath: ROUTE_CMS,
      rubricSlug: payload.rubric.slug,
      companySlug,
    },
  };
};

export default RubricPage;
