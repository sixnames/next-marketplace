import UpdateTaskForm, { UpdateTaskFormInterface } from 'components/console/UpdateTaskForm';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface TaskDetailsConsumerInterface extends UpdateTaskFormInterface {
  pageCompany: CompanyInterface;
}

const TaskDetailsConsumer: React.FC<TaskDetailsConsumerInterface> = ({
  task,
  taskVariants,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${task.name}`,
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
      <UpdateTaskForm taskVariants={taskVariants} task={task} />
    </CmsCompanyLayout>
  );
};

interface TaskDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    TaskDetailsConsumerInterface {}

const TaskDetailsPage: React.FC<TaskDetailsPageInterface> = ({
  layoutProps,
  pageCompany,
  taskVariants,
  task,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <TaskDetailsConsumer pageCompany={pageCompany} taskVariants={taskVariants} task={task} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TaskDetailsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const task = await getCompanyTaskSsr({
    locale: props.sessionLocale,
    taskId: `${context.query.taskId}`,
  });
  if (!task) {
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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

  return {
    props: {
      ...props,
      pageCompany: castDbData(companyResult),
      task: castDbData(task),
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default TaskDetailsPage;
