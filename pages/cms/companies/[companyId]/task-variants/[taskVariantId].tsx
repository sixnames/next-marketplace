import UpdateTaskVariantForm, {
  UpdateTaskVariantFormInterface,
} from 'components/console/UpdateTaskVariantForm';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getCompanyTaskVariantSsr } from 'db/ssr/company/getCompanyTaskVariantSsr';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface CreateTaskVariantDetailsConsumerInterface extends UpdateTaskVariantFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskVariantDetailsConsumer: React.FC<CreateTaskVariantDetailsConsumerInterface> = ({
  pageCompany,
  taskVariant,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${taskVariant.name}`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Типы задач',
        href: links.cms.companies.companyId.taskVariants.url,
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
