import ConsoleRubricProductCategories from 'components/console/ConsoleRubricProductCategories';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummary } from 'db/ssr/products/getProductFullSummary';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductCategoryInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductCategoriesInterface {
  product: ProductSummaryInterface;
  categoriesTree: ProductCategoryInterface[];
  pageCompany: CompanyInterface;
}

const ProductCategories: React.FC<ProductCategoriesInterface> = ({
  product,
  pageCompany,
  categoriesTree,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: `Рубрикатор`,
        href: links.cms.companies.companyId.rubrics.url,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.cms.companies.companyId.rubrics.rubricSlug.url,
      },
      {
        name: `Товары`,
        href: links.cms.companies.companyId.rubrics.rubricSlug.products.url,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.cms.companies.companyId.rubrics.rubricSlug.products.product.productId.url,
      },
    ],
  };

  return (
    <CmsProductLayout companySlug={pageCompany.slug} product={product} breadcrumbs={breadcrumbs}>
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
  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
  const categoriesCollection = collections.categoriesCollection();
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

  const payload = await getProductFullSummary({
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

  return {
    props: {
      ...props,
      product: castDbData(summary),
      categoriesTree: castDbData(categoriesTree),
      pageCompany: castDbData(companyResult),
    },
  };
};

export default Product;
