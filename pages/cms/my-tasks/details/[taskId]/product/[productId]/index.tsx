import ConsoleRubricProductDetails from 'components/console/ConsoleRubricProductDetails';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { getCompanyTaskSsr } from 'db/dao/ssr/getCompanyTaskSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/getProjectLinks';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductDetailsInterface extends CmsTaskProductLayoutInterface {}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, task }) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
      {
        name: `${task.name}`,
        href: links.cms.myTasks.details.taskId.url,
      },
      {
        name: `${product?.cardTitle}`,
        href: links.cms.myTasks.details.taskId.product.productId.url,
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
  });
  if (!task) {
    return {
      notFound: true,
    };
  }

  const payload = await getFullProductSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    userId: props.layoutProps.sessionUser.me._id,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
    taskVariantSlug: getTaskVariantSlugByRule('updateProduct'),
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
      task: castDbData({
        ...task,
        product: null,
      }),
    },
  };
};

export default Product;
