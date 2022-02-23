import ConsoleSeoContentDetails, {
  ConsoleSeoContentDetailsInterface,
} from 'components/console/ConsoleSeoContentDetails';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getConsoleRubricDetails } from 'db/ssr/rubrics/getConsoleRubricDetails';
import { AppContentWrapperBreadCrumbs, CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { alwaysString } from 'lib/arrayUtils';
import { CATALOGUE_SEO_TEXT_POSITION_TOP } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getSeoContentBySlug } from 'lib/seoContentUtils';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricDetailsInterface extends ConsoleSeoContentDetailsInterface {
  rubric: RubricInterface;
  companySlug?: string;
  pageCompany: CompanyInterface;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoContent,
  companySlug,
  showSeoFields,
  pageCompany,
}) => {
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);
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
      pageCompany: castDbData(props.layoutProps.pageCompany),
      showSeoFields: seoContentSlug.indexOf(CATALOGUE_SEO_TEXT_POSITION_TOP) > -1,
      companySlug,
    },
  };
};

export default RubricPage;
