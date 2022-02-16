import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from 'components/console/ConsoleSeoContentsList';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { SeoContentModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getConsoleRubricDetails } from 'db/ssr/rubrics/getConsoleRubricDetails';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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
  const collections = await getDbCollections();
  const seoContentsCollection = collections.seoContentsCollection();
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

  const links = getProjectLinks();
  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContents: castDbData(seoContents),
      routeBasePath: links.cms.url,
      rubricSlug: payload.rubric.slug,
      companySlug,
    },
  };
};

export default RubricPage;
