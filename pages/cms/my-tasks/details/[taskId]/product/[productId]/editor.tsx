import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import { TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT } from 'config/constantSelects';
import { getCompanyTaskSsr } from 'db/dao/ssr/getCompanyTaskSsr';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/getProjectLinks';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getFullProductSummary } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductAttributesInterface
  extends ConsoleRubricProductEditorInterface,
    CmsTaskProductLayoutInterface {}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
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

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductAttributes {...props} />
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

  const companySlug = DEFAULT_COMPANY_SLUG;
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

  const { summary, cardContent } = payload;

  return {
    props: {
      ...props,
      product: castDbData(summary),
      seoContentsList: castDbData(cardContent),
      task: castDbData(task),
      companySlug,
    },
  };
};

export default Product;
