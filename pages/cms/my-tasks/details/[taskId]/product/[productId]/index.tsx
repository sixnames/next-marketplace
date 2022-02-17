import ConsoleRubricProductDetails from 'components/console/ConsoleRubricProductDetails';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'components/layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { TASK_VARIANT_SLUG_PRODUCT_DETAILS } from 'lib/config/constantSelects';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductDetailsInterface extends CmsTaskProductLayoutInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, task }) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Детали товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout product={product} task={task} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductDetails product={product} />
    </CmsTaskProductLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const { props } = await getAppInitialData({ context });
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
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_DETAILS) {
    return {
      notFound: true,
    };
  }

  const payload = await getProductFullSummaryWithDraft({
    taskId: task._id.toHexString(),
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(payload.summary),
      task: castDbData(task),
    },
  };
};

export default Product;
