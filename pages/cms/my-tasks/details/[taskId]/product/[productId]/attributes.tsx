import ConsoleRubricProductAttributes from 'components/console/ConsoleRubricProductAttributes';
import { getCompanyTaskSsr } from 'db/dao/ssr/getCompanyTaskSsr';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/getProjectLinks';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { getCmsProductAttributesPageSsr } from 'db/dao/ssr/getCmsProductAttributesPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { castDbData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CmsProductAttributesPageConsumerInterface extends CmsTaskProductLayoutInterface {}

const CmsProductAttributesPageConsumer: React.FC<CmsProductAttributesPageConsumerInterface> = ({
  product,
  task,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Атрибуты товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout product={product} task={task} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductAttributes product={product} />
    </CmsTaskProductLayout>
  );
};

export interface CmsProductAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsProductAttributesPageConsumerInterface {}

const CmsProductAttributesPage: NextPage<CmsProductAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsProductAttributesPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsProductAttributesPageInterface>> => {
  const { query } = context;
  const props = await getCmsProductAttributesPageSsr(context);
  if (!props) {
    return {
      notFound: true,
    };
  }

  const task = await getCompanyTaskSsr({
    locale: props.sessionLocale,
    taskId: `${query.taskId}`,
    noProduct: true,
  });
  if (!task) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      task: castDbData(task),
    },
  };
};
export default CmsProductAttributesPage;
