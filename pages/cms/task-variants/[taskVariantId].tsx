import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import UpdateTaskVariantForm, {
  UpdateTaskVariantFormInterface,
} from '../../../components/console/UpdateTaskVariantForm';
import { getCompanyTaskVariantSsr } from '../../../db/dao/ssr/getCompanyTaskVariantSsr';
import { AppContentWrapperBreadCrumbs } from '../../../db/uiInterfaces';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getCmsLinks, getConsoleTaskVariantLinks } from '../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';

interface TaskVariantDetailsConsumerInterface extends UpdateTaskVariantFormInterface {
  basePath: string;
}

const TaskVariantDetailsConsumer: React.FC<TaskVariantDetailsConsumerInterface> = ({
  basePath,
  taskVariant,
}) => {
  const links = getConsoleTaskVariantLinks({
    basePath,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${taskVariant.name}`,
    config: [
      {
        name: 'Типы задач',
        href: links.parentLink,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <UpdateTaskVariantForm taskVariant={taskVariant} />
    </AppContentWrapper>
  );
};

interface TaskVariantDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    TaskVariantDetailsConsumerInterface {}

const TaskVariantDetailsPage: React.FC<TaskVariantDetailsPageInterface> = ({
  layoutProps,
  basePath,
  taskVariant,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <TaskVariantDetailsConsumer basePath={basePath} taskVariant={taskVariant} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TaskVariantDetailsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getCompanyTaskVariantSsr({
    locale: props.sessionLocale,
    taskVariantId: `${context.query.taskVariantId}`,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }
  const taskVariant = {
    ...payload,
    name: getFieldStringLocale(payload.nameI18n, props.sessionLocale),
  };

  const links = getCmsLinks({});
  return {
    props: {
      ...props,
      basePath: links.root,
      taskVariant: castDbData(taskVariant),
    },
  };
};

export default TaskVariantDetailsPage;
