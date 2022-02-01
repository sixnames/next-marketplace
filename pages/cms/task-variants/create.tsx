import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import CreateTaskVariantForm, {
  CreateTaskVariantFormInterface,
} from '../../../components/console/CreateTaskVariantForm';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { AppContentWrapperBreadCrumbs } from '../../../db/uiInterfaces';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getCmsLinks, getConsoleTaskVariantLinks } from '../../../lib/linkUtils';
import { getAppInitialData, GetAppInitialDataPropsInterface } from '../../../lib/ssrUtils';

interface CreateTaskVariantConsumerInterface extends CreateTaskVariantFormInterface {}

const CreateTaskVariantConsumer: React.FC<CreateTaskVariantConsumerInterface> = ({
  companySlug,
  basePath,
}) => {
  const links = getConsoleTaskVariantLinks({
    basePath,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание типа задачи',
    config: [
      {
        name: 'Типы задач',
        href: links.parentLink,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <CreateTaskVariantForm companySlug={companySlug} basePath={basePath} />
    </AppContentWrapper>
  );
};

interface CreateTaskVariantPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskVariantConsumerInterface {}

const CreateTaskVariantPage: React.FC<CreateTaskVariantPageInterface> = ({
  layoutProps,
  basePath,
  companySlug,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskVariantConsumer basePath={basePath} companySlug={companySlug} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreateTaskVariantPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const links = getCmsLinks({});
  return {
    props: {
      ...props,
      basePath: links.root,
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default CreateTaskVariantPage;