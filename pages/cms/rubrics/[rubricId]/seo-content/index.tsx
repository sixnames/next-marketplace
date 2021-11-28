import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Table, { TableColumn } from 'components/Table';
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

interface RubricDetailsInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoContents: SeoContentModel[];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoContents }) => {
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

  const columns: TableColumn<SeoContentModel>[] = [
    {
      accessor: 'url',
      headTitle: 'Ссылка',
      render: ({ cellData }) => {
        return (
          <Link target={'_blank'} href={cellData}>
            {cellData}
          </Link>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.slug}
              updateTitle={'Редактировать текст'}
              updateHandler={() => {
                window.open(
                  `${ROUTE_CMS}/rubrics/${rubric._id}/seo-content/${dataItem.slug}`,
                  '_blank',
                );
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-seo-content-list'}>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<SeoContentModel>
            columns={columns}
            data={seoContents}
            onRowDoubleClick={(dataItem) => {
              window.open(
                `${ROUTE_CMS}/rubrics/${rubric._id}/seo-content/${dataItem.slug}`,
                '_blank',
              );
            }}
          />
        </div>
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
      companySlug,
    },
  };
};

export default RubricPage;
