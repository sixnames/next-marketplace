import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import UpdateTaskVariantForm, {
  UpdateTaskVariantFormInterface,
} from 'components/console/UpdateTaskVariantForm';
import { COL_COMPANIES } from 'db/collectionNames';
import { getCompanyTaskVariantSsr } from 'db/dao/ssr/getCompanyTaskVariantSsr';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CreateTaskVariantDetailsConsumerInterface extends UpdateTaskVariantFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskVariantDetailsConsumer: React.FC<CreateTaskVariantDetailsConsumerInterface> = ({
  pageCompany,
  taskVariant,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${taskVariant.name}`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
      {
        name: 'Типы задач',
        href: links.taskVariants.parentLink,
      },
    ],
  };
  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <UpdateTaskVariantForm taskVariant={taskVariant} />
    </CmsCompanyLayout>
  );
};

interface CreateTaskVariantDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskVariantDetailsConsumerInterface {}

const CreateTaskVariantDetailsPage: React.FC<CreateTaskVariantDetailsPageInterface> = ({
  layoutProps,
  pageCompany,
  taskVariant,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskVariantDetailsConsumer pageCompany={pageCompany} taskVariant={taskVariant} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreateTaskVariantDetailsPageInterface>> => {
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
      pageCompany: castDbData(companyResult),
      taskVariant: castDbData(taskVariant),
    },
  };
};

export default CreateTaskVariantDetailsPage;
