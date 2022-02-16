import CompanyRubricDetails, {
  CompanyRubricDetailsInterface,
} from 'components/company/CompanyRubricDetails';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, RubricInterface } from 'db/uiInterfaces';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import { getRubricAllSeoContents } from 'lib/seoContentUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricDetailsInterface extends CompanyRubricDetailsInterface {}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoDescriptionBottom,
  seoDescriptionTop,
  pageCompany,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      rubric={rubric}
      breadcrumbs={breadcrumbs}
      basePath={links.root}
    >
      <CompanyRubricDetails
        routeBasePath={links.root}
        rubric={rubric}
        pageCompany={pageCompany}
        seoDescriptionTop={seoDescriptionTop}
        seoDescriptionBottom={seoDescriptionBottom}
      />
    </CmsRubricLayout>
  );
};

interface RubricPageInterface extends GetConsoleInitialDataPropsInterface, RubricDetailsInterface {}

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
  const rubricsCollection = collections.rubricsCollection();

  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }
  const companySlug = props.layoutProps.pageCompany.slug;

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          slug: `${query.rubricSlug}`,
        },
      },
      {
        $project: {
          views: false,
        },
      },
    ])
    .toArray();
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const { sessionLocale } = props;
  const rubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  const seoDescriptionTop = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    locale: sessionLocale,
  });

  const seoDescriptionBottom = await getRubricAllSeoContents({
    rubricSlug: rubric.slug,
    rubricId: rubric._id,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    locale: sessionLocale,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return {
      notFound: true,
    };
  }

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
  });

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(seoDescriptionBottom),
      seoDescriptionTop: castDbData(seoDescriptionTop),
      rubric: castDbData(rubric),
      routeBasePath: links.parentLink,
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default RubricPage;
