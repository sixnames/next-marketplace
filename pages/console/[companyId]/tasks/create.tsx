import CreateTaskForm, { CreateTaskFormInterface } from 'components/console/CreateTaskForm';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface CreateTaskConsumerInterface extends CreateTaskFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskConsumer: React.FC<CreateTaskConsumerInterface> = ({
  companySlug,
  taskVariants,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание задачи',
    config: [
      {
        name: 'Задачи',
        href: links.console.companyId.tasks.url,
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
  pageCompany,
  companySlug,
  taskVariants,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskConsumer
        pageCompany={pageCompany}
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

  return {
    props: {
      ...props,
      pageCompany: castDbData(props.layoutProps.pageCompany),
      companySlug: props.layoutProps.pageCompany.slug,
      taskVariants: castDbData(taskVariants),
    },
  };
};

export default CreateTaskPage;
