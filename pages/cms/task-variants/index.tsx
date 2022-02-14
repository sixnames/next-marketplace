import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsoleTaskVariantsList, {
  ConsoleTaskVariantsListInterface,
} from 'components/console/ConsoleTaskVariantsList';
import Inner from 'components/Inner';
import WpTitle from 'components/WpTitle';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { getCompanyTaskVariantsListSsr } from 'db/dao/ssr/getCompanyTaskVariantsListSsr';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getCmsLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

const pageTitle = 'Типы задач';
interface TaskVariantsListConsumerInterface extends ConsoleTaskVariantsListInterface {}

const TaskVariantsListConsumer: React.FC<TaskVariantsListConsumerInterface> = ({
  basePath,
  taskVariants,
}) => {
  return (
    <AppContentWrapper>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <ConsoleTaskVariantsList basePath={basePath} taskVariants={taskVariants} />
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
  basePath,
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <TaskVariantsListConsumer taskVariants={taskVariants} basePath={basePath} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<TaskVariantsListPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getCompanyTaskVariantsListSsr({
    locale: props.sessionLocale,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const links = getCmsLinks({});

  return {
    props: {
      ...props,
      taskVariants: castDbData(payload),
      basePath: links.root,
    },
  };
};

export default TaskVariantsListPage;
