import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from 'components/console/ConsoleSeoContentsList';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { SeoContentModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getConsoleRubricDetails } from 'db/ssr/rubrics/getConsoleRubricDetails';
import { AppContentWrapperBreadCrumbs, CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricDetailsInterface extends ConsoleSeoContentsListInterface {
  rubric: RubricInterface;
  seoContents: SeoContentModel[];
  pageCompany: CompanyInterface;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoContents, pageCompany }) => {
  const links = getProjectLinks({
    companyId: pageCompany?._id,
    rubricSlug: rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.console.companyId.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.console.companyId.rubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <CmsRubricLayout hideAttributesPath rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleSeoContentsList seoContents={seoContents} />
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }
  const companySlug = props.layoutProps.pageCompany.slug;

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
      pageCompany: castDbData(props.layoutProps.pageCompany),
      companySlug,
    },
  };
};

export default RubricPage;
