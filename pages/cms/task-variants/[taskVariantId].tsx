import UpdateTaskVariantForm, {
  UpdateTaskVariantFormInterface,
} from 'components/console/UpdateTaskVariantForm';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskVariantSsr } from 'db/ssr/company/getCompanyTaskVariantSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface TaskVariantDetailsConsumerInterface extends UpdateTaskVariantFormInterface {}

const TaskVariantDetailsConsumer: React.FC<TaskVariantDetailsConsumerInterface> = ({
  taskVariant,
}) => {
  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${taskVariant.name}`,
    config: [
      {
        name: 'Типы задач',
        href: links.cms.taskVariants.url,
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
  taskVariant,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <TaskVariantDetailsConsumer taskVariant={taskVariant} />
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

  return {
    props: {
      ...props,
      taskVariant: castDbData(taskVariant),
    },
  };
};

export default TaskVariantDetailsPage;
