import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import CreateTaskForm, {
  CreateTaskFormInterface,
} from '../../../../../components/console/CreateTaskForm';
import { DEFAULT_COMPANY_SLUG } from '../../../../../config/common';
import { COL_COMPANIES } from '../../../../../db/collectionNames';
import { getCompanyTaskVariantsListSsr } from '../../../../../db/dao/ssr/getCompanyTaskVariantsListSsr';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface CreateTaskConsumerInterface extends CreateTaskFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskConsumer: React.FC<CreateTaskConsumerInterface> = ({
  companySlug,
  basePath,
  taskVariants,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание задачи',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
      {
        name: 'Задачи',
        href: links.tasks.parentLink,
      },
    ],
  };
  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <CreateTaskForm companySlug={companySlug} taskVariants={taskVariants} basePath={basePath} />
    </CmsCompanyLayout>
  );
};

interface CreateTaskPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskConsumerInterface {}

const CreateTaskPage: React.FC<CreateTaskPageInterface> = ({
  layoutProps,
  basePath,
  companySlug,
  taskVariants,
  pageCompany,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskConsumer
        pageCompany={pageCompany}
        basePath={basePath}
        taskVariants={taskVariants}
        companySlug={companySlug}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreateTaskPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const taskVariants = await getCompanyTaskVariantsListSsr({
    locale: props.sessionLocale,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!taskVariants) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.companyId}`),
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      basePath: links.root,
      companySlug: companyResult.slug,
      pageCompany: castDbData(companyResult),
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default CreateTaskPage;
