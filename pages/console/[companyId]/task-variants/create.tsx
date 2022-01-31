import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import CreateTaskVariantForm, {
  CreateTaskVariantFormInterface,
} from '../../../../components/console/CreateTaskVariantForm';
import { AppContentWrapperBreadCrumbs } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks, getConsoleTaskVariantLinks } from '../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface, getConsoleInitialData } from '../../../../lib/ssrUtils';

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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
    },
  };
};

export default CreateTaskVariantPage;
