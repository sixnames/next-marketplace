import ConsoleRubricProductCategories from 'components/console/ConsoleRubricProductCategories';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'components/layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { AppContentWrapperBreadCrumbs, ProductCategoryInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { TASK_VARIANT_SLUG_PRODUCT_CATEGORIES } from 'lib/config/constantSelects';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductCategoriesInterface extends CmsTaskProductLayoutInterface {
  categoriesTree: ProductCategoryInterface[];
}

const ProductCategories: React.FC<ProductCategoriesInterface> = ({
  product,
  task,
  categoriesTree,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout task={task} product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductCategories product={product} categoriesTree={categoriesTree} />
    </CmsTaskProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductCategoriesInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductCategories {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const collections = await getDbCollections();
  const categoriesCollection = collections.categoriesCollection();
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
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_CATEGORIES) {
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

  const { summary } = payload;

  // Get rubric categories
  const initialCategories = await categoriesCollection
    .find({
      rubricId: summary.rubric?._id,
    })
    .toArray();
  const categories: ProductCategoryInterface[] = initialCategories.map((category) => {
    return {
      ...category,
      categories: [],
      selected: summary.filterSlugs.some((slug) => slug === category.slug),
    };
  });

  const categoriesTree = getTreeFromList<ProductCategoryInterface>({
    list: categories,
    childrenFieldName: 'categories',
  });

  return {
    props: {
      ...props,
      product: castDbData(summary),
      categoriesTree: castDbData(categoriesTree),
      task: castDbData(task),
    },
  };
};

export default Product;
