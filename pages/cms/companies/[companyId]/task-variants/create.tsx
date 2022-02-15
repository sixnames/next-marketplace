import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import CreateTaskVariantForm, {
  CreateTaskVariantFormInterface,
} from 'components/console/CreateTaskVariantForm';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CreateTaskVariantConsumerInterface extends CreateTaskVariantFormInterface {
  pageCompany: CompanyInterface;
}

const CreateTaskVariantConsumer: React.FC<CreateTaskVariantConsumerInterface> = ({
  companySlug,
  basePath,
  pageCompany,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Создание типа задачи',
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
      <CreateTaskVariantForm companySlug={companySlug} basePath={basePath} />
    </CmsCompanyLayout>
  );
};

interface CreateTaskVariantPageInterface
  extends GetAppInitialDataPropsInterface,
    CreateTaskVariantConsumerInterface {}

const CreateTaskVariantPage: React.FC<CreateTaskVariantPageInterface> = ({
  layoutProps,
  basePath,
  companySlug,
  pageCompany,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CreateTaskVariantConsumer
        basePath={basePath}
        companySlug={companySlug}
        pageCompany={pageCompany}
      />
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

  return {
    props: {
      ...props,
      basePath: links.root,
      pageCompany: castDbData(companyResult),
      companySlug: companyResult.slug,
    },
  };
};

export default CreateTaskVariantPage;
