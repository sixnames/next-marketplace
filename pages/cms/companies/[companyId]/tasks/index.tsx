import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsoleTasksList, { ConsoleTasksListInterface } from 'components/console/ConsoleTasksList';
import Inner from 'components/Inner';
import { COL_COMPANIES } from 'db/collectionNames';
import { getCompanyTasksListSsr } from 'db/dao/ssr/getCompanyTasksListSsr';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

const pageTitle = 'Задачи';
interface TasksListConsumerInterface extends ConsoleTasksListInterface {
  pageCompany: CompanyInterface;
}

const TasksListConsumer: React.FC<TasksListConsumerInterface> = ({
  basePath,
  pageCompany,
  tasks,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleTasksList basePath={basePath} tasks={tasks} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface TasksListPageInterface
  extends GetAppInitialDataPropsInterface,
    TasksListConsumerInterface {}

const TasksListPage: React.FC<TasksListPageInterface> = ({
  layoutProps,
  pageCompany,
  tasks,
  basePath,
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <TasksListConsumer tasks={tasks} basePath={basePath} pageCompany={pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TasksListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
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

  const payload = await getCompanyTasksListSsr({
    locale: props.sessionLocale,
    companySlug: companyResult.slug,
  });

  if (!payload) {
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
      tasks: castDbData(payload),
      pageCompany: castDbData(companyResult),
      basePath: links.root,
    },
  };
};

export default TasksListPage;
