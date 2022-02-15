import ConsoleRubricProductVariants from 'components/console/ConsoleRubricProductVariants';
import { TASK_VARIANT_SLUG_PRODUCT_VARIANTS } from 'lib/config/constantSelects';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'components/layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductVariantsPropsInterface extends CmsTaskProductLayoutInterface {}

const ProductVariants: React.FC<ProductVariantsPropsInterface> = ({ product, task }) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Связи товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout task={task} product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductVariants product={product} />
    </CmsTaskProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductVariantsPropsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductVariants {...props} />
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
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_VARIANTS) {
    return {
      notFound: true,
    };
  }

  const payload = await getFullProductSummaryWithDraft({
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

  const { summary } = payload;

  return {
    props: {
      ...props,
      product: castDbData(summary),
      task: castDbData(task),
    },
  };
};

export default Product;
