import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsoleTaskVariantsList, {
  ConsoleTaskVariantsListInterface,
} from 'components/console/ConsoleTaskVariantsList';
import Inner from 'components/Inner';
import { COL_COMPANIES } from 'db/collectionNames';
import { getCompanyTaskVariantsListSsr } from 'db/ssr/company/getCompanyTaskVariantsListSsr';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

const pageTitle = 'Типы задач';
interface TaskVariantsListConsumerInterface extends ConsoleTaskVariantsListInterface {
  pageCompany: CompanyInterface;
}

const TaskVariantsListConsumer: React.FC<TaskVariantsListConsumerInterface> = ({
  basePath,
  taskVariants,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: pageTitle,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleTaskVariantsList basePath={basePath} taskVariants={taskVariants} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface TaskVariantsListPageInterface
  extends GetAppInitialDataPropsInterface,
    TaskVariantsListConsumerInterface {}

const TaskVariantsListPage: React.FC<TaskVariantsListPageInterface> = ({
  layoutProps,
  taskVariants,
  pageCompany,
  basePath,
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <TaskVariantsListConsumer
        taskVariants={taskVariants}
        basePath={basePath}
        pageCompany={pageCompany}
      />
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

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${context.query.companyId}`),
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  const payload = await getCompanyTaskVariantsListSsr({
    locale: props.sessionLocale,
    companySlug: companyResult.slug,
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
      pageCompany: castDbData(companyResult),
      basePath: links.root,
    },
  };
};

export default TaskVariantsListPage;
