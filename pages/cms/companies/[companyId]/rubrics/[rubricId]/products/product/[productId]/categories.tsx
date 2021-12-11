import ConsoleRubricProductCategories from 'components/console/ConsoleRubricProductCategories';
import { ROUTE_CMS } from 'config/common';
import { COL_CATEGORIES, COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  CompanyInterface,
  ProductCategoryInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductCategoriesInterface {
  product: ProductInterface;
  categoriesTree: ProductCategoryInterface[];
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ProductCategories: React.FC<ProductCategoriesInterface> = ({
  product,
  routeBasePath,
  pageCompany,
  categoriesTree,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.snippetTitle}`,
        href: `${routeBasePath}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
      <ConsoleRubricProductCategories product={product} categoriesTree={categoriesTree} />
    </CmsProductLayout>
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
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
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

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { product } = payload;

  // Get rubric categories
  const initialCategories = await categoriesCollection
    .find({
      rubricId: product.rubricId,
    })
    .toArray();
  const categories: ProductCategoryInterface[] = initialCategories.map((category) => {
    return {
      ...category,
      categories: [],
      selected: product.selectedOptionsSlugs.some((slug) => slug === category.slug),
    };
  });

  const categoriesTree = getTreeFromList<ProductCategoryInterface>({
    list: categories,
    childrenFieldName: 'categories',
  });

  return {
    props: {
      ...props,
      product: castDbData(product),
      categoriesTree: castDbData(categoriesTree),
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default Product;
