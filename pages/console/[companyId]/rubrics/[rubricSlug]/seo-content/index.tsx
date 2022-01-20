import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleSeoContentsList, {
  ConsoleSeoContentsListInterface,
} from '../../../../../../components/console/ConsoleSeoContentsList';
import Inner from '../../../../../../components/Inner';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from '../../../../../../config/common';
import { COL_SEO_CONTENTS } from '../../../../../../db/collectionNames';
import { getConsoleRubricDetails } from '../../../../../../db/dao/rubrics/getConsoleRubricDetails';
import { SeoContentModel } from '../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  RubricInterface,
} from '../../../../../../db/uiInterfaces';
import CmsRubricLayout from '../../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../../../lib/ssrUtils';

interface RubricDetailsInterface extends ConsoleSeoContentsListInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoContents: SeoContentModel[];
  pageCompany: CompanyInterface;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoContents,
  routeBasePath,
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
        <ConsoleSeoContentsList
          seoContents={seoContents}
          routeBasePath={routeBasePath}
          rubricSlug={links.root}
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

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
  });
  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContents: castDbData(seoContents),
      pageCompany: castDbData(props.layoutProps.pageCompany),
      routeBasePath: links.root,
      rubricSlug: `${payload.rubric.slug}`,
      companySlug,
    },
  };
};

export default RubricPage;
