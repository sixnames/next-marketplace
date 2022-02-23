import ConsoleTaskVariantsList, {
  ConsoleTaskVariantsListInterface,
} from 'components/console/ConsoleTaskVariantsList';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';

import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

const pageTitle = 'Типы задач';
interface TaskVariantsListConsumerInterface extends ConsoleTaskVariantsListInterface {}

const TaskVariantsListConsumer: React.FC<TaskVariantsListConsumerInterface> = ({
  taskVariants,
}) => {
  return (
    <AppContentWrapper>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <ConsoleTaskVariantsList taskVariants={taskVariants} />
      </Inner>
    </AppContentWrapper>
  );
};

interface TaskVariantsListPageInterface
  extends GetAppInitialDataPropsInterface,
    TaskVariantsListConsumerInterface {}

const TaskVariantsListPage: React.FC<TaskVariantsListPageInterface> = ({
  layoutProps,
  taskVariants,
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <TaskVariantsListConsumer taskVariants={taskVariants} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TaskVariantsListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getCompanyTaskVariantsListSsr({
    locale: props.sessionLocale,
    companySlug: props.layoutProps.pageCompany.slug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      taskVariants: castDbData(payload),
    },
  };
};

export default TaskVariantsListPage;
