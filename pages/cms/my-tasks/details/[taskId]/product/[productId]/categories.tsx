import ConsoleRubricProductCategories from 'components/console/ConsoleRubricProductCategories';
import { TASK_VARIANT_SLUG_PRODUCT_CATEGORIES } from 'config/constantSelects';
import { getCompanyTaskSsr } from 'db/ssr/company/getCompanyTaskSsr';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_CATEGORIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  ProductCategoryInterface,
} from 'db/uiInterfaces';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';

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
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
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
