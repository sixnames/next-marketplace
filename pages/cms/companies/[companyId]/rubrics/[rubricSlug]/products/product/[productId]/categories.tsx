import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductCategories from 'components/console/ConsoleRubricProductCategories';
import { COL_CATEGORIES, COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  CompanyInterface,
  ProductCategoryInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getFullProductSummary } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';

interface ProductCategoriesInterface {
  product: ProductSummaryInterface;
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
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.root,
      },
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.rubrics.parentLink,
      },
      {
        name: `Товары`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.rubrics.product.root,
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
  const { productId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const { props } = await getAppInitialData({ context });
  if (!props) {
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

  const payload = await getFullProductSummary({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
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
      rubricId: summary.rubricId,
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      product: castDbData(summary),
      categoriesTree: castDbData(categoriesTree),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};

export default Product;
