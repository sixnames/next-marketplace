import ConsoleTasksList, { ConsoleTasksListInterface } from 'components/console/ConsoleTasksList';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getCompanyTasksListSsr } from 'db/ssr/company/getCompanyTasksListSsr';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

const pageTitle = 'Задачи';
interface TasksListConsumerInterface extends ConsoleTasksListInterface {}

const TasksListConsumer: React.FC<TasksListConsumerInterface> = ({ basePath, tasks }) => {
  return (
    <AppContentWrapper>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <ConsoleTasksList basePath={basePath} tasks={tasks} />
      </Inner>
    </AppContentWrapper>
  );
};

interface TasksListPageInterface
  extends GetAppInitialDataPropsInterface,
    TasksListConsumerInterface {}

const TasksListPage: React.FC<TasksListPageInterface> = ({ layoutProps, tasks, basePath }) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <TasksListConsumer tasks={tasks} basePath={basePath} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TasksListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getCompanyTasksListSsr({
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });

  if (!payload) {
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
      tasks: castDbData(payload),
      basePath: links.root,
    },
  };
};

export default TasksListPage;
