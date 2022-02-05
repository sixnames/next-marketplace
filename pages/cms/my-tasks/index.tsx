import ConsoleMyTasksList, {
  ConsoleMyTasksListInterface,
} from 'components/console/ConsoleMyTasksList';
import Inner from 'components/Inner';
import WpTitle from 'components/WpTitle';
import { getMyTasksListSsr } from 'db/dao/ssr/getMyTasksListSsr';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/getProjectLinks';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

const pageTitle = 'Мои задачи';
interface TasksListConsumerInterface extends ConsoleMyTasksListInterface {}

const TasksListConsumer: React.FC<TasksListConsumerInterface> = ({ basePath, tasks }) => {
  return (
    <AppContentWrapper>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <ConsoleMyTasksList basePath={basePath} tasks={tasks} />
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
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getMyTasksListSsr({
    sessionUser: props.layoutProps.sessionUser.me,
    locale: props.sessionLocale,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const links = getProjectLinks();

  return {
    props: {
      ...props,
      tasks: castDbData(payload),
      basePath: links.cms.url,
    },
  };
};

export default TasksListPage;
