import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import CreateTaskForm, { CreateTaskFormInterface } from 'components/console/CreateTaskForm';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks, getConsoleTaskLinks } from 'lib/linkUtils';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';

interface CreateTaskConsumerInterface extends CreateTaskFormInterface {}

const CreateTaskConsumer: React.FC<CreateTaskConsumerInterface> = ({
  companySlug,
  basePath,
  taskVariants,
}) => {
  const links = getConsoleTaskLinks({
    basePath,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание задачи',
    config: [
      {
        name: 'Задачи',
        href: links.parentLink,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <CreateTaskForm companySlug={companySlug} taskVariants={taskVariants} basePath={basePath} />
    </AppContentWrapper>
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
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskConsumer
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const taskVariants = await getCompanyTaskVariantsListSsr({
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });

  if (!taskVariants) {
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
      basePath: links.root,
      companySlug: props.layoutProps.pageCompany.slug,
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default CreateTaskPage;
