import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleSeoContentDetails, {
  ConsoleSeoContentDetailsInterface,
} from '../../../../../../components/console/ConsoleSeoContentDetails';
import Inner from '../../../../../../components/Inner';
import { CATALOGUE_SEO_TEXT_POSITION_TOP } from '../../../../../../config/common';
import { getConsoleRubricDetails } from '../../../../../../db/dao/rubrics/getConsoleRubricDetails';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  RubricInterface,
} from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { alwaysString } from '../../../../../../lib/arrayUtils';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import { getSeoContentBySlug } from '../../../../../../lib/seoContentUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../../../lib/ssrUtils';

interface RubricDetailsInterface extends ConsoleSeoContentDetailsInterface {
  rubric: RubricInterface;
  companySlug: string;
  pageCompany: CompanyInterface;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoContent,
  companySlug,
  showSeoFields,
  pageCompany,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany?._id,
    rubricSlug: rubric?.slug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${rubric?.name}`,
        href: links.rubrics.root,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      basePath={links.root}
      rubric={rubric}
      breadcrumbs={breadcrumbs}
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
