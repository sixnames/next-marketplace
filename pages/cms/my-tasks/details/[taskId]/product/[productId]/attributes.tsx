import ConsoleRubricProductAttributes from 'components/console/ConsoleRubricProductAttributes';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'components/layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { getCmsProductAttributesPageSsr } from 'db/ssr/products/getCmsProductAttributesPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES } from 'lib/config/constantSelects';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES) {
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
