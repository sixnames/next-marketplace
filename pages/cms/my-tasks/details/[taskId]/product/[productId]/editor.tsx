import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'components/layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT } from 'lib/config/constantSelects';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullProductSummary } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductEditorInterface
  extends ConsoleRubricProductEditorInterface,
    CmsTaskProductLayoutInterface {}

const ProductEditor: React.FC<ProductEditorInterface> = ({
  task,
  product,
  seoContentsList,
  companySlug,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Контент карточки товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout task={task} product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductEditor
        product={product}
        seoContentsList={seoContentsList}
        companySlug={companySlug}
      />
    </CmsTaskProductLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductEditorInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductEditor {...props} />
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
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT) {
    return {
      notFound: true,
    };
  }

  const companySlug = task.companySlug || DEFAULT_COMPANY_SLUG;
  const payload = await getFullProductSummary({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { summary } = payload;
  const lastLog = task.log[task.log.length - 1];
  const seoContentsList = lastLog?.draft || payload.seoContentsList;

  return {
    props: {
      ...props,
      product: castDbData(summary),
      seoContentsList: castDbData(seoContentsList),
      task: castDbData(task),
      companySlug,
    },
  };
};

export default Product;
