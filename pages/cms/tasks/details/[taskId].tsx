import UpdateTaskForm, { UpdateTaskFormInterface } from 'components/console/UpdateTaskForm';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getCmsLinks, getConsoleTaskLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface TaskDetailsConsumerInterface extends UpdateTaskFormInterface {
  basePath: string;
}

const TaskDetailsConsumer: React.FC<TaskDetailsConsumerInterface> = ({
  basePath,
  task,
  taskVariants,
}) => {
  const links = getConsoleTaskLinks({
    basePath,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${task.name}`,
    config: [
      {
        name: 'Задачи',
        href: links.parentLink,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <UpdateTaskForm taskVariants={taskVariants} task={task} />
    </AppContentWrapper>
  );
};

interface TaskDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    TaskDetailsConsumerInterface {}

const TaskDetailsPage: React.FC<TaskDetailsPageInterface> = ({
  layoutProps,
  basePath,
  taskVariants,
  task,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <TaskDetailsConsumer basePath={basePath} taskVariants={taskVariants} task={task} />
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

  const links = getCmsLinks({});
  return {
    props: {
      ...props,
      basePath: links.root,
      task: castDbData(task),
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default TaskDetailsPage;
