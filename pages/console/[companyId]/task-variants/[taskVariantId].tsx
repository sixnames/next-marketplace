import UpdateTaskVariantForm, {
  UpdateTaskVariantFormInterface,
} from 'components/console/UpdateTaskVariantForm';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskVariantSsr } from 'db/ssr/company/getCompanyTaskVariantSsr';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';

interface CreateTaskVariantDetailsConsumerInterface extends UpdateTaskVariantFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskVariantDetailsConsumer: React.FC<CreateTaskVariantDetailsConsumerInterface> = ({
  taskVariant,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${taskVariant.name}`,
    config: [
      {
        name: 'Типы задач',
        href: links.console.companyId.taskVariants.url,
      },
    ],
  };
  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <UpdateTaskVariantForm taskVariant={taskVariant} />
    </AppContentWrapper>
  );
};

interface CreateTaskVariantDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskVariantDetailsConsumerInterface {}

const CreateTaskVariantDetailsPage: React.FC<CreateTaskVariantDetailsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskVariantDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreateTaskVariantDetailsPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
      pageCompany: castDbData(props.layoutProps.pageCompany),
      taskVariant: castDbData(taskVariant),
    },
  };
};

export default CreateTaskVariantDetailsPage;
