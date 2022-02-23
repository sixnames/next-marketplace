import CreateTaskForm, { CreateTaskFormInterface } from 'components/console/CreateTaskForm';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface CreateTaskConsumerInterface extends CreateTaskFormInterface {}

const CreateTaskConsumer: React.FC<CreateTaskConsumerInterface> = ({
  companySlug,
  taskVariants,
}) => {
  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание задачи',
    config: [
      {
        name: 'Задачи',
        href: links.cms.tasks.url,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <CreateTaskForm companySlug={companySlug} taskVariants={taskVariants} />
    </AppContentWrapper>
  );
};

interface CreateTaskPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskConsumerInterface {}

const CreateTaskPage: React.FC<CreateTaskPageInterface> = ({
  layoutProps,
  companySlug,
  taskVariants,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskConsumer taskVariants={taskVariants} companySlug={companySlug} />
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

  return {
    props: {
      ...props,
      companySlug: DEFAULT_COMPANY_SLUG,
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default CreateTaskPage;
